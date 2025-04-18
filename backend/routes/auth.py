import os
from fastapi import APIRouter, HTTPException, Request, Response
from firebase_admin import auth, credentials
import firebase_admin
from services.auth_service import AuthService
from services.user_service import UserService

cred = credentials.Certificate("./config/firebase-service-account.json")
firebase_admin.initialize_app(cred)
router = APIRouter()

ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 1))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

@router.post("/me")
async def session(
    request: Request,
    response: Response
):
    try:
        access_token = request.cookies.get("access_token")
        
        if access_token:
            decoded_token = AuthService().decode_access_token(access_token)
            email = decoded_token.get("email")
            user_record = UserService().get_user(email)
        else:
             # 🔐 First-time login or token expired
            body = await request.json()
            firebase_token = body.get("token")
            decoded_token = auth.verify_id_token(firebase_token)
            
            email = decoded_token.get("email")
            name = decoded_token.get("name")
            photo = decoded_token.get("picture") or decoded_token.get("photoUrl")

            user_record = UserService().get_user(email)
            if not user_record:
                user_record = {
                    "email": email,
                    "role": 3,
                    "name": name,
                    "phone_number": "+1234567890",
                    "profile_picture": photo
                }
                UserService().create_user(user_record)

            country, region = await AuthService().get_user_region(request)
            
            # Create and set cookie
            access_token = AuthService().create_access_token(user_record)
            refresh_token = AuthService().create_refresh_token(user_record, country)
            
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="Strict",
                max_age=3600 * ACCESS_TOKEN_EXPIRE_HOURS,
                domain="localhost"
            )
            
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="Strict",
                path="/auth/refresh",
                max_age=86400 * REFRESH_TOKEN_EXPIRE_DAYS,
            )
        return user_record

    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")
    
@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response
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
        
        user_record = UserService().get_user(email)
        #dummy , deleet this below
        user_record = {
                "email": email,
                "role": 3,
                "name": "name",
                "phone_number": "+1234567890",
                "profile_picture": "photo"
            }
        if not user_record:
            raise HTTPException(status_code=404, detail="User not found")

        new_access_token = AuthService().create_access_token(user_record)

        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=3600 * ACCESS_TOKEN_EXPIRE_HOURS,
        )
        return {"message": "Token refreshed"}

    except Exception:
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