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
    name = Column(String)
    email = Column(String, unique=True, index=True)
    mobile = Column(String)
    address = Column(String)
    password = Column(String)
    user_level = Column(Enum(UserLevelEnum))
    premium_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job_posts = relationship("JobPost", back_populates="employer")
    worker_profiles = relationship("WorkerProfile", back_populates="user")
    worker_posts = relationship("WorkerPost", back_populates="user")
    job_applications = relationship("JobApplication", back_populates="applicant")
    working = relationship("Working", back_populates="worker")
