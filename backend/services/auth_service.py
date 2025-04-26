from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request, Response
import httpx
import jwt
import os

ACCESS_SECRET = os.getenv("ACCESS_SECRET")
REFRESH_SECRET = os.getenv("REFRESH_SECRET")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 1))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"), 7)
ALGORITHM = "HS256"

class AuthService:    
    async def get_user_region(self, request: Request):
        try:
            ip = request.client.host
            forwarded = request.headers.get("x-forwarded-for")
            if forwarded:
                ip = forwarded.split(",")[0]
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"https://ipapi.co/{ip}/json/")
                response.raise_for_status()  # Raises HTTPError for non-2xx responses

                data = response.json()
                return data.get("country_name", "Unknown Country"), data.get("region", "Unknown Region")
        
        except (httpx.RequestError, httpx.HTTPStatusError):
            return "Unknown Country", "Unknown Region"

    def create_access_token(self, data: dict, expires_delta: timedelta = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)):
        to_encode = data.copy()
        now = datetime.now(timezone.utc)
        expire = now + expires_delta

        to_encode.update({
            "iat": now,
            "exp": expire
        })

        encoded_jwt = jwt.encode(to_encode, ACCESS_SECRET, algorithm=ALGORITHM)
        return encoded_jwt
    
    def decode_access_token(self, token: str):
        try:
            decoded_token = jwt.decode(token, ACCESS_SECRET, algorithms=[ALGORITHM], options={"verify_exp": True})
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        
    def create_refresh_token(self, data: dict, country: str, expires_delta: timedelta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)):
        to_encode = data.copy()
        now = datetime.now(timezone.utc)
        expire = now + expires_delta

        to_encode.update({
            "iat": now,
            "exp": expire,
            "country": country,
            "type": "refresh"
        })

        encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET, algorithm=ALGORITHM)
        
        # store this/update in db in user table # when logout delete this token from db
        return encoded_jwt

    def decode_refresh_token(self, token: str):
        try:
            decoded_token = jwt.decode(token, REFRESH_SECRET, algorithms=[ALGORITHM], options={"verify_exp": True})
            
            if decoded_token.get("type") != "refresh":
                raise HTTPException(status_code=401, detail="Invalid refresh token type")

            return decoded_token
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Refresh token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    def clear_cookies(self, response: Response):
        #response.delete_cookie(key="access_token", path="/")
        response.delete_cookie(key="refresh_token", path="/auth/refresh")