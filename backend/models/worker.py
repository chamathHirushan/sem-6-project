from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
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
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("working_category.id"))
    location = Column(String)  # town
    description = Column(Text)
    post_date = Column(DateTime(timezone=True), server_default=func.now())
    photos = Column(String)  # Comma-separated list of image URLs or JSON array
    views = Column(Integer, default=0)
    boost_level = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="worker_posts")
    category = relationship("WorkingCategory", back_populates="worker_posts")
    reviews = relationship("WorkerReview", back_populates="post")

class WorkerReview(Base):
    __tablename__ = "worker_reviews"
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("worker_posts.id"))
    worker_id = Column(Integer, ForeignKey("users.id"))
    commenter_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Float)  # 1 to 5
    text_comment = Column(Text)
    photos = Column(String)  # Comma-separated list of image URLs or JSON array
    review_date = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    post = relationship("WorkerPost", back_populates="reviews")
    worker = relationship("User", foreign_keys=[worker_id], back_populates="worker_reviews_received")
    commenter = relationship("User", foreign_keys=[commenter_id], back_populates="worker_reviews")
    replies = relationship("Reply", back_populates="review")
