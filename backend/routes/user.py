from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models.database import SessionLocal
from models.user import User
from pydantic import BaseModel
from datetime import datetime
from services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request/response
class UserBase(BaseModel):
    name: str
    email: str
    phone_number: str
    town: str
    permission_level: int
    pro_pic: str | None = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserLevelUpdate(BaseModel):
    permission_level: int

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    try:
        user_data = user.dict()
        db_user = user_service.create_user(user_data)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_service = UserService(db)
    users = user_service.get_all_users(skip=skip, limit=limit)
    return users

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserBase, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user_data = user.dict()
    db_user = user_service.update_user(user_id, user_data)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_service = UserService(db)
    success = user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.patch("/{user_id}/level", response_model=UserResponse)
def update_user_level(user_id: int, level_update: UserLevelUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    db_user = user_service.update_user_permission_level(user_id, level_update.permission_level)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user