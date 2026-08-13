import hashlib
import os
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, Request, Response, Header, Depends
from fastapi.responses import JSONResponse
from firebase_admin import auth, credentials
import firebase_admin
from sqlalchemy.orm import Session
from services.auth_service import AuthService
from services.user_service import UserService, user_to_payload
from models.database import SessionLocal
from pydantic import BaseModel

FIREBASE_READY = False
try:
    cred_path = os.getenv("FIREBASE_CREDENTIALS", "./config/firebase-service-account.json")
    if os.path.exists(cred_path) and not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        FIREBASE_READY = True
    elif firebase_admin._apps:
        FIREBASE_READY = True
except Exception as e:
    print(f"Firebase initialization skipped: {e}")

router = APIRouter()

ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 1))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

parsed_url = urlparse(FRONTEND_URL)
domain = parsed_url.hostname


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _set_refresh_cookie(response: Response, refresh_token: str, secure: bool):
    refresh_cookie_options = {
        "httponly": True,
        "secure": secure,
        "samesite": "Strict",
        "path": "/auth/refresh",
        "max_age": 86400 * REFRESH_TOKEN_EXPIRE_DAYS
    }
    if domain and not domain.startswith("localhost"):
        refresh_cookie_options["domain"] = domain
    response.set_cookie(key="refresh_token", value=refresh_token, **refresh_cookie_options)


def _issue_tokens(user, country: str, response: Response):
    payload = user_to_payload(user)
    access_token = AuthService().create_access_token(payload)
    refresh_token = AuthService().create_refresh_token(payload, country)
    secure = True if not domain or not domain.startswith("localhost") else False
    _set_refresh_cookie(response, refresh_token, secure)
    return payload, access_token


@router.post("/me")
async def session(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    try:
        user_service = UserService(db)

        if os.getenv("DEV_MODE", "false").lower() == "true":
            user_record = user_service.get_user_by_email("developer@example.com")
            if not user_record:
                user_record = user_service.create_user({
                    "email": "developer@example.com",
                    "permission_level": 3,
                    "name": "Developer",
                    "phone_number": None,
                    "pro_pic": "https://via.placeholder.com/150",
                    "town": "Colombo",
                })
            payload, access_token = _issue_tokens(user_record, "Development Region", response)
            return {"user": payload, "token": access_token}

        user_record = None

        if authorization and authorization.startswith("Bearer "):
            try:
                access_token = authorization.split(" ")[1]
                decoded_token = AuthService().decode_access_token(access_token)
                email = decoded_token.get("email")
                user_id = decoded_token.get("id")
                if user_id is not None:
                    try:
                        user_record = user_service.get_user(int(user_id))
                    except (TypeError, ValueError):
                        user_record = None
                if not user_record and email:
                    user_record = user_service.get_user_by_email(email)
            except Exception:
                user_record = None

        if not user_record:
            body = await request.json()
            firebase_token = body.get("token")

            if not firebase_token:
                raise HTTPException(status_code=400, detail="Firebase token required")

            if not FIREBASE_READY:
                raise HTTPException(status_code=503, detail="Firebase is not configured")

            decoded_token = auth.verify_id_token(firebase_token)

            email = decoded_token.get("email")
            name = decoded_token.get("name") or (email.split("@")[0] if email else "User")
            photo = decoded_token.get("picture") or decoded_token.get("photoUrl")

            user_record = user_service.get_user_by_email(email)

            if not user_record:
                user_record = user_service.create_user({
                    "email": email,
                    "permission_level": 1,
                    "name": name,
                    "phone_number": None,
                    "pro_pic": photo,
                })

        country, _region = await AuthService().get_user_region(request)
        payload, access_token = _issue_tokens(user_record, country, response)

        return {
            "user": payload,
            "token": access_token,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Authentication error: {str(e)}")
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

        country, _region = await AuthService().get_user_region(request)
        token_country = decoded_token.get("country") or decoded_token.get("region")
        if country != token_country and country != "Unknown Country":
            AuthService().clear_cookies(response)
            raise HTTPException(status_code=401, detail="Invalid IP address")

        user_service = UserService(db)
        user_record = user_service.get_user_by_email(email)

        if not user_record:
            raise HTTPException(status_code=404, detail="User not found")

        payload = user_to_payload(user_record)
        new_access_token = AuthService().create_access_token(payload)

        return {"token": new_access_token}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Refresh token error: {str(e)}")
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

        user_service.update_user(user_record.id, {"phone_number": phone_number})

        return {"message": "Phone number updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Store phone error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to store phone number")


MERCHANT_ID = os.getenv("PAYHERE_MERCHANT_ID", "")
MERCHANT_SECRET = os.getenv("PAYHERE_MERCHANT_SECRET", "")


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


def _require_payhere_config():
    if not MERCHANT_ID or not MERCHANT_SECRET:
        raise HTTPException(
            status_code=503,
            detail="PayHere is unavailable (PAYHERE_MERCHANT_ID / PAYHERE_MERCHANT_SECRET not set).",
        )


@router.post("/start")
async def start_payment(data: StartPaymentRequest):
    _require_payhere_config()
    print(f"Payment request for order: {data.order_id}")

    hashed_secret = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()
    hash_input = f"{MERCHANT_ID}{data.order_id}{data.amount}{data.currency}{hashed_secret}"
    hash_value = hashlib.md5(hash_input.encode()).hexdigest().upper()

    print(f"Hash generated for order: {data.order_id}")
    return {"hash": hash_value, "merchant_id": MERCHANT_ID}


@router.post("/notify")
async def payment_notify(data: NotifyRequest):
    _require_payhere_config()
    print(f"Payment notification received for order: {data.order_id}")

    hashed_secret = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()
    sig_input = (
        f"{data.merchant_id}{data.order_id}{data.payhere_amount}"
        f"{data.payhere_currency}{data.status_code}{hashed_secret}"
    )
    local_md5sig = hashlib.md5(sig_input.encode()).hexdigest().upper()

    if local_md5sig == data.md5sig and data.status_code == "2":
        print(f"Payment successful for order: {data.order_id}")
        return {"status": "Payment verified"}

    print(f"Payment verification failed for order: {data.order_id}")
    return JSONResponse(status_code=400, content={"status": "Verification failed"})
