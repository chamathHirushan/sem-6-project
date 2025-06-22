import hashlib
import os
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, Request, Response, Header
from firebase_admin import auth, credentials
import firebase_admin
from services.auth_service import AuthService
from services.user_service import UserService
from pydantic import BaseModel

cred = credentials.Certificate("./config/firebase-service-account.json")
firebase_admin.initialize_app(cred)
router = APIRouter()

ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 1))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

parsed_url = urlparse(FRONTEND_URL)
domain = parsed_url.hostname 

@router.post("/me")
async def session(
    request: Request,
    response: Response,
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

        if authorization and authorization.startswith("Bearer "):
            access_token = authorization.split(" ")[1]
            decoded_token = AuthService().decode_access_token(access_token)
            email = decoded_token.get("email")
            user_record = UserService().get_user(email)
            #dummy , deleet this below
            user_record = {
                    "email": email,
                    "role": 3,
                    "name": "John",
                    "phone_number": "+0771234567",
                    "profile_picture": "photo"
                }
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
                    "phone_number": "+0771234567",  # Default phone number, should be updated later
                    "profile_picture": photo
                }
                UserService().create_user(user_record)

            country, region = await AuthService().get_user_region(request)
            
            # Create and set cookie
            access_token = AuthService().create_access_token(user_record)
            refresh_token = AuthService().create_refresh_token(user_record, country)
            
            # cookie_options = {
            #     "httponly": True,
            #     "secure": True,
            #     "samesite": "Strict",
            #     "max_age": 3600 * ACCESS_TOKEN_EXPIRE_HOURS
            # }
            
            refresh_cookie_options = {
                "httponly": True,
                "secure": False,
                "samesite": "Strict",
                "path": "/auth/refresh",
                "max_age": 86400 * REFRESH_TOKEN_EXPIRE_DAYS
            }

            if domain and not domain.startswith("localhost"):
                #cookie_options["domain"] = domain
                refresh_cookie_options["domain"] = domain

            #response.set_cookie(key="access_token", value=access_token, **cookie_options)
            response.set_cookie(key="refresh_token", value=refresh_token, **refresh_cookie_options)

        return {
            "user": user_record,
            "token": access_token if access_token else None,
        }

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
        
        # new_cookie_options = {
        #     "httponly": True,
        #     "secure": True,
        #     "samesite": "Strict",
        #     "max_age": 3600 * ACCESS_TOKEN_EXPIRE_HOURS
        # }
        # if domain and not domain.startswith("localhost"):
        #     new_cookie_options["domain"] = domain

        #response.set_cookie(key="access_token", value=new_access_token, **new_cookie_options)

        return {"token": new_access_token}

    except Exception as e:
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
    request: Request
):
    # store the phone number in the database for the user
    body = await request.json()
    phone_number = body.get("phone_number")
    email = body.get("email")
    print("storing phone number for user:", email, "phone number:", phone_number)
    
    
MERCHANT_ID = "1230959"
MERCHANT_SECRET = "MjA5OTAzMjcyNzEzNzg1OTU1MTkxNzM5NjM0MzYyMTM1NjA0MjYyNg=="

# Request models
class StartPaymentRequest(BaseModel):
    order_id: str
    amount: str
    currency: str

class NotifyRequest(BaseModel):
    merchant_id: str
    order_id: str
    payhere_amount: str
    payhere_currency: str
    status_code: str
    md5sig: str

@router.post("/start")
async def start_payment(data: StartPaymentRequest):
    print(f"Payment request for order: {data.order_id}")
    
    # First hash the merchant secret
    hashed_secret = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()

    # Build the hash string
    hash_input = f"{MERCHANT_ID}{data.order_id}{data.amount}{data.currency}{hashed_secret}"
    hash_value = hashlib.md5(hash_input.encode()).hexdigest().upper()

    print(f"Hash generated for order: {data.order_id}")
    return {"hash": hash_value, "merchant_id": MERCHANT_ID}

@router.post("/notify")
async def payment_notify(data: NotifyRequest):
    print(f"Payment notification received for order: {data.order_id}")

    # First hash the merchant secret
    hashed_secret = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()

    # Build the local MD5 signature
    sig_input = (
        f"{data.merchant_id}{data.order_id}{data.payhere_amount}"
        f"{data.payhere_currency}{data.status_code}{hashed_secret}"
    )
    local_md5sig = hashlib.md5(sig_input.encode()).hexdigest().upper()

    if local_md5sig == data.md5sig and data.status_code == "2":
        print(f"Payment successful for order: {data.order_id}")
        return {"status": "Payment verified"}
    else:
        print(f"Payment verification failed for order: {data.order_id}")
        return {"status": "Verification failed"}, 400