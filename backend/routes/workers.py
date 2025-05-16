from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.database import SessionLocal
from models.worker import WorkerProfile, WorkerPost, WorkerReview
from models.user import User
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/workers",
    tags=["Workers"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class WorkerProfileBase(BaseModel):
    user_id: int
    skills: str
    experience: str
    availability: str

class WorkerProfileCreate(WorkerProfileBase):
    pass

class WorkerProfileResponse(WorkerProfileBase):
    id: int
    
    class Config:
        orm_mode = True

class WorkerPostBase(BaseModel):
    worker_id: int
    title: str
    description: str

class WorkerPostCreate(WorkerPostBase):
    pass

class WorkerPostResponse(WorkerPostBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class ReviewResponse(BaseModel):
    id: int
    worker_id: int
    commenter_id: int
    rating: float
    text_comment: str
    photos: Optional[str]
    review_date: datetime
    commenter_name: str
    commenter_photo: str

    class Config:
        orm_mode = True

class WorkerPostDetailResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    location: str
    description: str
    post_date: datetime
    photos: Optional[str]
    views: int
    boost_level: int
    worker_name: str
    worker_photo: str
    category_name: str
    avg_rating: Optional[float]
    review_count: int
    is_editable: bool  # Whether the requesting user can edit this post

    class Config:
        orm_mode = True

# Worker Profile endpoints
@router.post("/profiles/", response_model=WorkerProfileResponse)
def create_worker_profile(profile: WorkerProfileCreate, db: Session = Depends(get_db)):
    db_profile = WorkerProfile(**profile.dict())
    db.add(db_profile)
    try:
        db.commit()
        db.refresh(db_profile)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_profile

@router.get("/profiles/{profile_id}", response_model=WorkerProfileResponse)
def get_worker_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(WorkerProfile).filter(WorkerProfile.id == profile_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    return profile

@router.get("/profiles/", response_model=List[WorkerProfileResponse])
def get_worker_profiles(
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(WorkerProfile)
    if user_id:
        query = query.filter(WorkerProfile.user_id == user_id)
    profiles = query.offset(skip).limit(limit).all()
    return profiles

@router.put("/profiles/{profile_id}", response_model=WorkerProfileResponse)
def update_worker_profile(
    profile_id: int,
    profile: WorkerProfileBase,
    db: Session = Depends(get_db)
):
    db_profile = db.query(WorkerProfile).filter(WorkerProfile.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    
    for var, value in vars(profile).items():
        setattr(db_profile, var, value)
    
    try:
        db.commit()
        db.refresh(db_profile)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_profile

# Worker Post endpoints
@router.post("/posts/", response_model=WorkerPostResponse)
def create_worker_post(post: WorkerPostCreate, db: Session = Depends(get_db)):
    db_post = WorkerPost(**post.dict())
    db.add(db_post)
    try:
        db.commit()
        db.refresh(db_post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_post

@router.get("/posts/{post_id}", response_model=WorkerPostResponse)
def get_worker_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(WorkerPost).filter(WorkerPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Worker post not found")
    return post

@router.get("/posts/", response_model=List[WorkerPostResponse])
def get_worker_posts(
    worker_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(WorkerPost)
    if worker_id:
        query = query.filter(WorkerPost.worker_id == worker_id)
    posts = query.offset(skip).limit(limit).all()
    return posts

@router.delete("/posts/{post_id}")
def delete_worker_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(WorkerPost).filter(WorkerPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Worker post not found")
    
    try:
        db.delete(post)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Worker post deleted successfully"}

@router.get("/posts/available", response_model=List[WorkerPostDetailResponse])
def get_available_worker_posts(db: Session = Depends(get_db)):
    """Get all available worker posts with worker details and ratings"""
    posts = db.query(WorkerPost)\
        .join(User)\
        .all()
    
    response = []
    for post in posts:
        # Calculate average rating and review count
        reviews = post.reviews
        review_count = len(reviews)
        avg_rating = sum(r.rating for r in reviews) / review_count if review_count > 0 else None

        post_dict = {
            **post.__dict__,
            'worker_name': f"{post.user.first_name} {post.user.last_name}",
            'worker_photo': post.user.pro_pic,
            'category_name': post.category.category_name,
            'avg_rating': avg_rating,
            'review_count': review_count
        }
        response.append(post_dict)
    
    return response

@router.get("/posts/{post_id}/reviews", response_model=List[ReviewResponse])
def get_post_reviews(post_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a specific worker post"""
    reviews = db.query(WorkerReview)\
        .join(User, WorkerReview.commenter_id == User.id)\
        .filter(WorkerReview.post_id == post_id)\
        .order_by(WorkerReview.review_date.desc())\
        .all()
    
    response = []
    for review in reviews:
        review_dict = {
            **review.__dict__,
            'commenter_name': f"{review.commenter.first_name} {review.commenter.last_name}",
            'commenter_photo': review.commenter.pro_pic
        }
        response.append(review_dict)
    
    return response

@router.get("/posts/user/{user_id}", response_model=List[WorkerPostDetailResponse])
def get_user_worker_posts(
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all worker posts for a specific user, sorted by time"""
    posts = db.query(WorkerPost)\
        .filter(WorkerPost.user_id == user_id)\
        .order_by(WorkerPost.post_date.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    response = []
    for post in posts:
        # Calculate average rating and review count
        reviews = post.reviews
        review_count = len(reviews)
        avg_rating = sum(r.rating for r in reviews) / review_count if review_count > 0 else None

        post_dict = {
            **post.__dict__,
            'worker_name': f"{post.user.first_name} {post.user.last_name}",
            'worker_photo': post.user.pro_pic,
            'category_name': post.category.category_name,
            'avg_rating': avg_rating,
            'review_count': review_count,
            'is_editable': True  # Since these are the user's own posts
        }
        response.append(post_dict)
    
    return response

@router.get("/posts/{post_id}/details", response_model=WorkerPostDetailResponse)
def get_worker_post_details(
    post_id: int,
    current_user_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific worker post"""
    post = db.query(WorkerPost)\
        .filter(WorkerPost.id == post_id)\
        .first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Worker post not found")
    
    # Calculate average rating and review count
    reviews = post.reviews
    review_count = len(reviews)
    avg_rating = sum(r.rating for r in reviews) / review_count if review_count > 0 else None

    response = {
        **post.__dict__,
        'worker_name': f"{post.user.first_name} {post.user.last_name}",
        'worker_photo': post.user.pro_pic,
        'category_name': post.category.category_name,
        'avg_rating': avg_rating,
        'review_count': review_count,
        'is_editable': post.user_id == current_user_id
    }
    
    return response

@router.post("/posts/", response_model=WorkerPostDetailResponse)
def create_worker_post(
    user_id: int,
    post_data: WorkerPostCreate,
    db: Session = Depends(get_db)
):
    """Create a new worker post subscription"""
    db_post = WorkerPost(
        user_id=user_id,
        category_id=post_data.category_id,
        location=post_data.location,
        description=post_data.description,
        photos=post_data.photos,
        views=0,
        boost_level=0
    )
    
    db.add(db_post)
    try:
        db.commit()
        db.refresh(db_post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    # Return full response including calculated fields
    return get_worker_post_details(db_post.id, user_id, db)

@router.put("/posts/{post_id}", response_model=WorkerPostDetailResponse)
def update_worker_post(
    post_id: int,
    current_user_id: int,
    post_data: WorkerPostCreate,
    db: Session = Depends(get_db)
):
    """Update an existing worker post"""
    post = db.query(WorkerPost)\
        .filter(WorkerPost.id == post_id)\
        .first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Worker post not found")
    
    if post.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")
    
    # Update fields
    for var, value in post_data.dict(exclude_unset=True).items():
        setattr(post, var, value)
    
    try:
        db.commit()
        db.refresh(post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    # Return full response including calculated fields
    return get_worker_post_details(post_id, current_user_id, db) 