from fastapi import Depends, HTTPException, Header, Request
from firebase_admin import auth

async def get_current_user_role(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code= 401,
            detail="Invalid authentication scheme"
        )
    
    token = authorization.split("Bearer ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        email = decoded_token.get("email")
        # query = users.select().where(users.c.email == email)
        user_role = 3 # temp
        return user_role, email
    
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code= 401,
            detail="Invalid token"
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code= 401,
            detail="Expired token"
        )

# Create role-checking hook factory
def require_role(required_role: int):
    async def dependency(request: Request):
        user_role, email = await get_current_user_role(request.headers.get("Authorization"))
        if user_role < required_role:
            raise HTTPException(
                status_code= 403,
                detail="Permission denied."
            )
        request.state.email = email
    return Depends(dependency)