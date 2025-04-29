from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skills = Column(Text)
    experience = Column(Text)
    availability = Column(String)

    user = relationship("User", back_populates="worker_profiles")

class WorkerPost(Base):
    __tablename__ = "worker_posts"
    id = Column(Integer, primary_key=True)
    worker_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="worker_posts")
