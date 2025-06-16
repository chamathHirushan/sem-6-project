import os
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, Request, Response, Header, Depends
from firebase_admin import auth, credentials
import firebase_admin
from sqlalchemy.orm import Session
from services.auth_service import AuthService
from services.user_service import UserService
from models.database import SessionLocal

cred = credentials.Certificate("./config/firebase-service-account.json")
firebase_admin.initialize_app(cred)
router = APIRouter()

ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 1))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

parsed_url = urlparse(FRONTEND_URL)
domain = parsed_url.hostname 

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/me")
async def session(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    try:
        # Development override: Skip authentication and return a dummy user
        if os.getenv("DEV_MODE", "false").lower() == "true":
            user_record = {
                "email": "developer@example.com",
                "role": 3,
                "name": "Developer",
                "phone_number": "+1234567890",
                "profile_picture": "https://via.placeholder.com/150"
            }
            access_token = AuthService().create_access_token(user_record)
            refresh_token = AuthService().create_refresh_token(user_record, "Development Region")

            refresh_cookie_options = {
                "httponly": True,
                "secure": False,
                "samesite": "Strict",
                "path": "/auth/refresh",
                "max_age": 86400 * REFRESH_TOKEN_EXPIRE_DAYS
            }

            response.set_cookie(key="refresh_token", value=refresh_token, **refresh_cookie_options)

            return {
                "user": user_record,
                "token": access_token
            }

        user_service = UserService(db)
        access_token = None

        if authorization and authorization.startswith("Bearer "):
            access_token = authorization.split(" ")[1]
            try:
                decoded_token = AuthService().decode_access_token(access_token)
                email = decoded_token.get("email")
                user_record = user_service.get_user_by_email(email)
                
                if not user_record:
                    raise HTTPException(status_code=401, detail="User not found")
                
                # Convert SQLAlchemy model to dict
                user_record = {
                    "email": user_record.email,
                    "role": user_record.permission_level,
                    "name": user_record.name,
                    "phone_number": user_record.phone_number,
                    "profile_picture": user_record.pro_pic
                }
            except Exception as e:
                # Token is invalid, continue to Firebase verification
                authorization = None
        
        if not authorization:
            # 🔐 First-time login or token expired
            body = await request.json()
            firebase_token = body.get("token")
            
            if not firebase_token:
                raise HTTPException(status_code=400, detail="Firebase token required")
            
            decoded_token = auth.verify_id_token(firebase_token)
            
            email = decoded_token.get("email")
            name = decoded_token.get("name")
            photo = decoded_token.get("picture") or decoded_token.get("photoUrl")

            user_record = user_service.get_user_by_email(email)
            
            if not user_record:
                # Create new user
                user_data = {
                    "email": email,
                    "permission_level": 1,  # Default permission level
                    "name": name,
                    "phone_number": "+1234567890",  # Default phone number
                    "pro_pic": photo,
                    "town": "Unknown"  # Add default town
                }
                db_user = user_service.create_user(user_data)
                user_record = {
                    "email": db_user.email,
                    "role": db_user.permission_level,
                    "name": db_user.name,
                    "phone_number": db_user.phone_number,
                    "profile_picture": db_user.pro_pic
                }
            else:
                # Convert existing user to dict
                user_record = {
                    "email": user_record.email,
                    "role": user_record.permission_level,
                    "name": user_record.name,
                    "phone_number": user_record.phone_number,
                    "profile_picture": user_record.pro_pic
                }

            country, region = await AuthService().get_user_region(request)
            
            # Create tokens
            access_token = AuthService().create_access_token(user_record)
            refresh_token = AuthService().create_refresh_token(user_record, country)
            
            refresh_cookie_options = {
                "httponly": True,
                "secure": True if not domain or not domain.startswith("localhost") else False,
                "samesite": "Strict",
                "path": "/auth/refresh",
                "max_age": 86400 * REFRESH_TOKEN_EXPIRE_DAYS
            }

            if domain and not domain.startswith("localhost"):
                refresh_cookie_options["domain"] = domain

            response.set_cookie(key="refresh_token", value=refresh_token, **refresh_cookie_options)

        return {
            "user": user_record,
            "token": access_token,
        }

    except Exception as e:
        print(f"Authentication error: {str(e)}")  # Add logging
        raise HTTPException(status_code=401, detail="Authentication failed")
    
@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="No refresh token")
    
        decoded_token = AuthService().decode_refresh_token(refresh_token)
        email = decoded_token.get("email")
        
        country, region = await AuthService().get_user_region(request)
        if country != decoded_token.get("region") and country != "Unknown Country":
            AuthService().clear_cookies(response)
            raise HTTPException(status_code=401, detail="Invalid IP address")
        
        user_service = UserService(db)
        user_record = user_service.get_user_by_email(email)
        
        if not user_record:
            raise HTTPException(status_code=404, detail="User not found")

        # Convert to dict
        user_dict = {
            "email": user_record.email,
            "role": user_record.permission_level,
            "name": user_record.name,
            "phone_number": user_record.phone_number,
            "profile_picture": user_record.pro_pic
        }

        new_access_token = AuthService().create_access_token(user_dict)

        return {"token": new_access_token}

    except Exception as e:
        print(f"Refresh token error: {str(e)}")  # Add logging
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
@router.post("/signout")
async def signout(
    response: Response
):
    try:
        AuthService().clear_cookies(response)
        return {"message": "Logged out successfully"}
    except Exception:
        raise HTTPException(status_code=500, detail="Logout failed")
    
@router.post("/store-phone")
async def store_phone(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        body = await request.json()
        phone_number = body.get("phone_number")
        email = body.get("email")
        
        user_service = UserService(db)
        user_record = user_service.get_user_by_email(email)
        
        if not user_record:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update phone number
        user_service.update_user(user_record.id, {"phone_number": phone_number})
        
        print("storing phone number for user:", email, "phone number:", phone_number)
        return {"message": "Phone number updated successfully"}
    
    except Exception as e:
        print(f"Store phone error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to store phone number")