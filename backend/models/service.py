# from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from .database import Base

# class ServiceCategory(Base):
#     __tablename__ = "service_category"
#     id = Column(Integer, primary_key=True)
#     category_name = Column(String)

# class ServicePost(Base):
#     __tablename__ = "service_posts"
#     id = Column(Integer, primary_key=True)
#     service_id = Column(Integer, ForeignKey("service_category.id"))
#     user_id = Column(Integer, ForeignKey("users.id"))
#     expired_at = Column(DateTime)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
