from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import SessionLocal
from models.communication import Reply
from models.user import User
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/replies",
    tags=["Replies"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class ReplyBase(BaseModel):
    review_id: Optional[int]
    comment_id: Optional[int]
    text_comment: str
    photos: str | None = None

class ReplyCreate(ReplyBase):
    pass

class ReplyResponse(ReplyBase):
    id: int
    reply_date: datetime
    
    class Config:
        orm_mode = True

@router.post("/", response_model=ReplyResponse)
def create_reply(reply: ReplyCreate, db: Session = Depends(get_db)):
    if not reply.review_id and not reply.comment_id:
        raise HTTPException(
            status_code=400, 
            detail="Either review_id or comment_id must be provided"
        )
    
    db_reply = Reply(**reply.dict())
    db.add(db_reply)
    try:
        db.commit()
        db.refresh(db_reply)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_reply

@router.get("/{reply_id}", response_model=ReplyResponse)
def get_reply(reply_id: int, db: Session = Depends(get_db)):
    reply = db.query(Reply).filter(Reply.id == reply_id).first()
    if reply is None:
        raise HTTPException(status_code=404, detail="Reply not found")
    return reply 