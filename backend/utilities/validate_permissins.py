from fastapi import Depends, HTTPException, Request, Header
from services.auth_service import AuthService
import jwt

async def get_current_user_role(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    access_token = authorization.split(" ")[1]
    
    try:
        decoded_token = AuthService().decode_access_token(access_token)
        email = decoded_token.get("email")
        user_role = decoded_token.get("role")
        return user_role, email

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid access token")


# Create role-checking hook factory
def require_role(required_role: int):
    async def dependency(
        request: Request,
        user_data: tuple = Depends(get_current_user_role)
    ):
        user_role, email = user_data
        if user_role < required_role:
            raise HTTPException(
                status_code= 403,
                detail="Permission denied."
            )
        request.state.email = email
    return Depends(dependency)