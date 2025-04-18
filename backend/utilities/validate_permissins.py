from fastapi import Depends, HTTPException, Request
from services.auth_service import AuthService
import jwt

async def get_current_user_role(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token")
    
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
    async def dependency(request: Request):
        user_role, email = await get_current_user_role(request)
        if user_role < required_role:
            raise HTTPException(
                status_code= 403,
                detail="Permission denied."
            )
        request.state.email = email
    return Depends(dependency)