from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class WorkingCategory(Base):
    __tablename__ = "working_category"
    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)

    # Relationships
    worker_posts = relationship("WorkerPost", back_populates="category")
    jobs = relationship("Job", back_populates="category")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)  # URL to the stored image 