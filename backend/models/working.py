from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class WorkingCategory(Base):
    __tablename__ = "working_category"
    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)

    # Relationships
    worker_posts = relationship("WorkerPost", back_populates="category")
    jobs = relationship("Job", back_populates="category")
    user_fields = relationship("UserWorkingField", back_populates="category")


class UserWorkingField(Base):
    __tablename__ = "user_working_fields"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("working_category.id"))
    status = Column(String, default="pending")
    description = Column(Text)

    user = relationship("User", back_populates="working_fields")
    category = relationship("WorkingCategory", back_populates="user_fields")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)  # URL to the stored image 