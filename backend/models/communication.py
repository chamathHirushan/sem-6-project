from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    notification_type = Column(String)  # new review, new comment, new message
    source_entity_id = Column(Integer)  # ID of the review/comment/message
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="notifications")

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True)
    user_1_id = Column(Integer, ForeignKey("users.id"))
    user_2_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    user_1 = relationship("User", foreign_keys=[user_1_id], back_populates="conversations")
    user_2 = relationship("User", foreign_keys=[user_2_id], back_populates="conversations_2")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text)
    photos = Column(String)  # Comma-separated list of image URLs or JSON array
    source_entity = Column(String)  # e.g., "replying for a worker post"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False) 

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="messages")

class Reply(Base):
    __tablename__ = "replies"
    id = Column(Integer, primary_key=True)
    review_id = Column(Integer, ForeignKey("worker_reviews.id"), nullable=True)
    comment_id = Column(Integer, ForeignKey("job_post_comments.id"), nullable=True)
    text_comment = Column(Text)
    photos = Column(String)  # Comma-separated list of image URLs or JSON array
    reply_date = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    review = relationship("WorkerReview", back_populates="replies")
    comment = relationship("JobPostComment", back_populates="replies") 