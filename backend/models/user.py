from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserLevelEnum(enum.Enum):
    admin = "admin"
    moderator = "moderator"
    premium = "premium"
    user = "user"

class UserLevel(Base):
    __tablename__ = "user_levels"
    id = Column(Integer, primary_key=True, index=True)
    level_name = Column(Enum(UserLevelEnum), nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    permission_level = Column(Integer)
    last_active_time = Column(DateTime(timezone=True))
    town = Column(String)
    pro_pic = Column(String)  # URL to profile picture
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    worker_posts = relationship("WorkerPost", back_populates="user")
    job_posts = relationship("JobPost", back_populates="user")
    worker_reviews = relationship("WorkerReview", back_populates="commenter")
    worker_reviews_received = relationship("WorkerReview", back_populates="worker")
    job_comments = relationship("JobPostComment", back_populates="commenter")
    notifications = relationship("Notification", back_populates="user")
    conversations = relationship("Conversation", back_populates="user_1")
    conversations_2 = relationship("Conversation", back_populates="user_2")
    messages = relationship("Message", back_populates="sender")
    favourites = relationship("Favourite", back_populates="user")
