from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class CommentReview(Base):
    __tablename__ = "comment_review"
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer)  # FK to either task/service post based on usage
    comment = Column(Text)
    photos = Column(String)
    time = Column(DateTime(timezone=True), server_default=func.now())

class Reply(Base):
    __tablename__ = "reply"
    id = Column(Integer, primary_key=True)
    comment_id = Column(Integer, ForeignKey("comment_review.id"))
    message = Column(Text)
    time = Column(DateTime(timezone=True), server_default=func.now())
