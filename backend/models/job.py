from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("working_category.id"))
    job_title = Column(String)
    budget = Column(Float)
    status = Column(String)  # posted/accepted/completed/available
    service_received = Column(DateTime(timezone=True))
    available = Column(Boolean, default=True)

    # Relationships
    user = relationship("User", back_populates="jobs")
    category = relationship("WorkingCategory", back_populates="jobs")
    job_posts = relationship("JobPost", back_populates="job")

class JobPost(Base):
    __tablename__ = "job_posts"
    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    post_title = Column(String)
    location = Column(String)  # town
    description = Column(Text)
    due_date = Column(DateTime(timezone=True))
    posted_date = Column(DateTime(timezone=True), server_default=func.now())
    photos = Column(String)  # Comma-separated list of image URLs or JSON array
    views = Column(Integer, default=0)
    boost_level = Column(Integer, default=0)
    subcategory = Column(String)  # Specific subcategory like "AC Repairs", "CCTV", etc.

    # Relationships
    job = relationship("Job", back_populates="job_posts")
    user = relationship("User", back_populates="job_posts")
    comments = relationship("JobPostComment", back_populates="post")
    applications = relationship("JobApplication", back_populates="job")
    workers = relationship("Working", back_populates="job")

class JobPostComment(Base):
    __tablename__ = "job_post_comments"
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("job_posts.id"))
    commenter_id = Column(Integer, ForeignKey("users.id"))
    photos = Column(String)  # Comma-separated list of image URLs or JSON array
    text_comment = Column(Text)
    comment_date = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    post = relationship("JobPost", back_populates="comments")
    commenter = relationship("User", back_populates="job_comments")
    replies = relationship("Reply", back_populates="comment")

class JobApplication(Base):
    __tablename__ = "job_applications"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_posts.id"))
    applicant_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("JobPost", back_populates="applications")
    applicant = relationship("User", back_populates="job_applications")

class Working(Base):
    __tablename__ = "working"
    id = Column(Integer, primary_key=True)
    worker_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("job_posts.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String)

    worker = relationship("User", back_populates="working")
    job = relationship("JobPost", back_populates="workers")
