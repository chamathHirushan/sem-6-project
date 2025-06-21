from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Favourite(Base):
    __tablename__ = "favourites"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source_entity_type = Column(String)  # "person" or "post"
    source_entity_id = Column(Integer)  # ID of the user or post

    # Relationships
    user = relationship("User", back_populates="favourites") 