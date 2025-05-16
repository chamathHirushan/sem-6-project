from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import SessionLocal
from models.favourite import Favourite
from models.user import User
from models.worker import WorkerPost
from models.job import JobPost
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/favourites",
    tags=["Favourites"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class FavouriteUserResponse(BaseModel):
    id: int
    user_id: int
    name: str
    photo: str
    rating: Optional[float]

    class Config:
        orm_mode = True

class FavouritePostResponse(BaseModel):
    id: int
    type: str  # "worker" or "job"
    title: str
    description: str
    location: str
    posted_date: datetime
    poster_name: str
    poster_photo: str

    class Config:
        orm_mode = True

@router.get("/user/{user_id}", response_model=dict)
def get_user_favourites(user_id: int, db: Session = Depends(get_db)):
    """Get all favourites (users and posts) for a user"""
    favourites = db.query(Favourite).filter(Favourite.user_id == user_id).all()
    
    favourite_users = []
    favourite_posts = []

    for fav in favourites:
        if fav.source_entity_type == "person":
            user = db.query(User).filter(User.id == fav.source_entity_id).first()
            if user:
                # Calculate user's average rating from their worker posts' reviews
                reviews = []
                for post in user.worker_posts:
                    reviews.extend(post.reviews)
                avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else None

                favourite_users.append({
                    'id': user.id,
                    'user_id': user.id,
                    'name': f"{user.first_name} {user.last_name}",
                    'photo': user.pro_pic,
                    'rating': avg_rating
                })
        else:  # post
            if fav.source_entity_type == "worker_post":
                post = db.query(WorkerPost).filter(WorkerPost.id == fav.source_entity_id).first()
                if post:
                    favourite_posts.append({
                        'id': post.id,
                        'type': 'worker',
                        'title': f"Service in {post.location}",
                        'description': post.description,
                        'location': post.location,
                        'posted_date': post.post_date,
                        'poster_name': f"{post.user.first_name} {post.user.last_name}",
                        'poster_photo': post.user.pro_pic
                    })
            else:  # job_post
                post = db.query(JobPost).filter(JobPost.id == fav.source_entity_id).first()
                if post:
                    favourite_posts.append({
                        'id': post.id,
                        'type': 'job',
                        'title': post.post_title,
                        'description': post.description,
                        'location': post.location,
                        'posted_date': post.posted_date,
                        'poster_name': f"{post.user.first_name} {post.user.last_name}",
                        'poster_photo': post.user.pro_pic
                    })

    return {
        'favourite_users': favourite_users,
        'favourite_posts': favourite_posts
    } 