from fastapi import APIRouter, HTTPException, Header, Request
from firebase_admin import auth, credentials
import firebase_admin

cred = credentials.Certificate("./config/firebase-service-account.json")
firebase_admin.initialize_app(cred)
router = APIRouter()

@router.get("/")
async def login(
        authorization: str = Header(None)
    ):
    try:
        id_token = authorization.split(" ")[1]
        decoded_token = auth.verify_id_token(id_token)
        email = decoded_token.get("email")
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

    # # 2. Get user record from DB
    # query = users.select().where(users.c.email == email)
    # user_record = await database.fetch_one(query)
    user_record = {
        "email": email,
        "role": 3,
        "name": "Chamat",
        "phone_number": "+1234567890",
        "profile_picture": "https://example.com/profile.jpg"
    }
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": user_record["email"],
        "role": user_record["role"],
        "name": user_record["name"],
        "phone_number": user_record["phone_number"],
        "profile_picture": user_record["profile_picture"]
    }