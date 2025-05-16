from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import SessionLocal
from models.communication import Conversation, Message
from models.user import User
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class MessageResponse(BaseModel):
    id: int
    text: str
    photos: Optional[str]
    created_at: datetime
    sender_name: str
    sender_photo: str

    class Config:
        orm_mode = True

class ConversationResponse(BaseModel):
    id: int
    other_user_id: int
    other_user_name: str
    other_user_photo: str
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int

    class Config:
        orm_mode = True

@router.get("/user/{user_id}", response_model=List[ConversationResponse])
def get_user_conversations(
    user_id: int,
    days: int = 30,  # Get conversations with activity in last 30 days by default
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all conversations for a user, sorted by most recent activity"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Get conversations where user is either user_1 or user_2
    conversations = db.query(Conversation)\
        .join(Message)\
        .filter(
            ((Conversation.user_1_id == user_id) | 
             (Conversation.user_2_id == user_id)) &
            (Message.created_at >= cutoff_date)
        )\
        .order_by(Message.created_at.desc())\
        .distinct()\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    response = []
    for conv in conversations:
        # Determine the other user in the conversation
        other_user_id = conv.user_2_id if conv.user_1_id == user_id else conv.user_1_id
        other_user = db.query(User).filter(User.id == other_user_id).first()
        
        # Get the last message
        last_message = db.query(Message)\
            .filter(Message.conversation_id == conv.id)\
            .order_by(Message.created_at.desc())\
            .first()
        
        # Count unread messages
        unread_count = db.query(Message)\
            .filter(
                Message.conversation_id == conv.id,
                Message.sender_id != user_id,
                Message.is_read == False
            )\
            .count()
        
        response.append({
            'id': conv.id,
            'other_user_id': other_user_id,
            'other_user_name': f"{other_user.first_name} {other_user.last_name}",
            'other_user_photo': other_user.pro_pic,
            'last_message': last_message.text if last_message else None,
            'last_message_time': last_message.created_at if last_message else None,
            'unread_count': unread_count
        })
    
    return response

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    user_id: int,  # Current user ID for authorization
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get messages for a specific conversation"""
    # Verify user is part of the conversation
    conversation = db.query(Conversation)\
        .filter(
            Conversation.id == conversation_id,
            ((Conversation.user_1_id == user_id) | 
             (Conversation.user_2_id == user_id))
        )\
        .first()
    
    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found or you're not a participant"
        )
    
    # Get messages
    messages = db.query(Message)\
        .filter(Message.conversation_id == conversation_id)\
        .order_by(Message.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # Mark unread messages as read
    db.query(Message)\
        .filter(
            Message.conversation_id == conversation_id,
            Message.sender_id != user_id,
            Message.is_read == False
        )\
        .update({"is_read": True})
    
    db.commit()
    
    response = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        response.append({
            **msg.__dict__,
            'sender_name': f"{sender.first_name} {sender.last_name}",
            'sender_photo': sender.pro_pic
        })
    
    return response 