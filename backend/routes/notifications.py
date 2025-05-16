from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import SessionLocal
from models.communication import Notification
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class NotificationResponse(BaseModel):
    id: int
    notification_type: str
    source_entity_id: int
    created_at: datetime
    is_read: bool
    message: str  # Computed message based on type
    link: str     # Computed link to the relevant page

    class Config:
        orm_mode = True

@router.get("/user/{user_id}", response_model=List[NotificationResponse])
def get_user_notifications(
    user_id: int, 
    limit: int = 50,
    skip: int = 0,
    db: Session = Depends(get_db)
):
    """Get notifications for a user"""
    notifications = db.query(Notification)\
        .filter(Notification.user_id == user_id)\
        .order_by(Notification.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    response = []
    for notif in notifications:
        # Create user-friendly message and link based on notification type
        message, link = get_notification_details(notif)
        
        response.append({
            **notif.__dict__,
            'message': message,
            'link': link
        })
    
    return response

@router.put("/read/{notification_id}")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    """Mark a notification as read"""
    notification = db.query(Notification)\
        .filter(Notification.id == notification_id)\
        .first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

@router.put("/read-all/{user_id}")
def mark_all_notifications_read(user_id: int, db: Session = Depends(get_db)):
    """Mark all notifications as read for a user"""
    db.query(Notification)\
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        )\
        .update({"is_read": True})
    
    db.commit()
    return {"message": "All notifications marked as read"}

def get_notification_details(notification: Notification) -> tuple[str, str]:
    """Helper function to generate user-friendly message and link for notifications"""
    base_url = "/app"  # You might want to make this configurable
    
    type_messages = {
        "new_message": (
            "You have a new message",
            f"{base_url}/conversations"
        ),
        "job_approved": (
            "Your job application was approved",
            f"{base_url}/jobs/{notification.source_entity_id}"
        ),
        "job_rejected": (
            "Your job application was rejected",
            f"{base_url}/jobs/{notification.source_entity_id}"
        ),
        "job_invited": (
            "You've been invited to a job",
            f"{base_url}/jobs/{notification.source_entity_id}"
        ),
        "new_review": (
            "You received a new review",
            f"{base_url}/reviews/{notification.source_entity_id}"
        ),
        "new_comment": (
            "Someone commented on your post",
            f"{base_url}/posts/{notification.source_entity_id}"
        )
    }

    message, link = type_messages.get(
        notification.notification_type, 
        ("New notification", f"{base_url}")
    )
    
    return message, link 