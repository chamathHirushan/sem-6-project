from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class JobPost(Base):
    __tablename__ = "job_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    location = Column(String)
    salary = Column(Float)
    employer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employer = relationship("User", back_populates="job_posts")
    applications = relationship("JobApplication", back_populates="job")
    workers = relationship("Working", back_populates="job")

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
