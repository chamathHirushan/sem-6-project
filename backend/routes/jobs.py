from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.database import SessionLocal
from models.job import Job, JobPost, JobPostComment, JobApplication, Working
from models.user import User
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class JobPostBase(BaseModel):
    title: str
    description: str
    location: str
    salary: float
    employer_id: int

class JobPostCreate(JobPostBase):
    pass

class JobPostResponse(JobPostBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class JobApplicationBase(BaseModel):
    job_id: int
    applicant_id: int
    status: str

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationResponse(JobApplicationBase):
    id: int
    applied_at: datetime
    
    class Config:
        orm_mode = True

class CommentResponse(BaseModel):
    id: int
    commenter_id: int
    text_comment: str
    photos: Optional[str]
    comment_date: datetime
    commenter_name: str
    commenter_photo: str

    class Config:
        orm_mode = True

class JobPostDetailResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    post_title: str
    location: str
    description: str
    due_date: datetime
    posted_date: datetime
    photos: Optional[str]
    views: int
    boost_level: int
    poster_name: str
    poster_photo: str
    category_name: str
    budget: float
    status: str

    class Config:
        orm_mode = True

# Job Post endpoints
@router.post("/posts/", response_model=JobPostResponse)
def create_job_post(job: JobPostCreate, db: Session = Depends(get_db)):
    db_job = JobPost(**job.dict())
    db.add(db_job)
    try:
        db.commit()
        db.refresh(db_job)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_job

@router.get("/posts/{job_id}", response_model=JobPostResponse)
def get_job_post(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobPost).filter(JobPost.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job post not found")
    return job

@router.get("/posts/", response_model=List[JobPostResponse])
def get_job_posts(
    skip: int = 0, 
    limit: int = 100, 
    location: Optional[str] = None,
    min_salary: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(JobPost)
    if location:
        query = query.filter(JobPost.location == location)
    if min_salary:
        query = query.filter(JobPost.salary >= min_salary)
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/posts/all", response_model=List[JobPostDetailResponse])
def get_all_job_posts(db: Session = Depends(get_db)):
    """Get all job posts with poster details"""
    posts = db.query(JobPost).join(Job).join(User).all()
    
    response = []
    for post in posts:
        post_dict = {
            **post.__dict__,
            'poster_name': f"{post.user.first_name} {post.user.last_name}",
            'poster_photo': post.user.pro_pic,
            'category_name': post.job.category.category_name,
            'budget': post.job.budget,
            'status': post.job.status
        }
        response.append(post_dict)
    
    return response

@router.get("/posts/recommended/{user_id}", response_model=List[JobPostDetailResponse])
def get_recommended_jobs(user_id: int, db: Session = Depends(get_db)):
    """Get recommended jobs based on user's profile and history"""
    # Get user's categories from their previous jobs and applications
    user_categories = db.query(Job.category_id)\
        .filter(Job.user_id == user_id)\
        .distinct()\
        .all()
    category_ids = [cat[0] for cat in user_categories]
    
    # Get active jobs in those categories
    recommended_jobs = db.query(JobPost)\
        .join(Job)\
        .filter(
            Job.category_id.in_(category_ids),
            Job.available == True
        )\
        .order_by(JobPost.boost_level.desc(), JobPost.posted_date.desc())\
        .limit(10)\
        .all()
    
    response = []
    for post in recommended_jobs:
        post_dict = {
            **post.__dict__,
            'poster_name': f"{post.user.first_name} {post.user.last_name}",
            'poster_photo': post.user.pro_pic,
            'category_name': post.job.category.category_name,
            'budget': post.job.budget,
            'status': post.job.status
        }
        response.append(post_dict)
    
    return response

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
def get_post_comments(post_id: int, db: Session = Depends(get_db)):
    """Get all comments for a specific job post"""
    comments = db.query(JobPostComment)\
        .join(User, JobPostComment.commenter_id == User.id)\
        .filter(JobPostComment.post_id == post_id)\
        .all()
    
    response = []
    for comment in comments:
        comment_dict = {
            **comment.__dict__,
            'commenter_name': f"{comment.commenter.first_name} {comment.commenter.last_name}",
            'commenter_photo': comment.commenter.pro_pic
        }
        response.append(comment_dict)
    
    return response

# Job Application endpoints
@router.post("/applications/", response_model=JobApplicationResponse)
def create_job_application(application: JobApplicationCreate, db: Session = Depends(get_db)):
    # Check if job exists
    job = db.query(JobPost).filter(JobPost.id == application.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job post not found")
    
    db_application = JobApplication(**application.dict())
    db.add(db_application)
    try:
        db.commit()
        db.refresh(db_application)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_application

@router.get("/applications/{application_id}", response_model=JobApplicationResponse)
def get_job_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if application is None:
        raise HTTPException(status_code=404, detail="Job application not found")
    return application

@router.get("/applications/", response_model=List[JobApplicationResponse])
def get_job_applications(
    job_id: Optional[int] = None,
    applicant_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication)
    if job_id:
        query = query.filter(JobApplication.job_id == job_id)
    if applicant_id:
        query = query.filter(JobApplication.applicant_id == applicant_id)
    if status:
        query = query.filter(JobApplication.status == status)
    applications = query.offset(skip).limit(limit).all()
    return applications

@router.put("/applications/{application_id}", response_model=JobApplicationResponse)
def update_job_application_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if application is None:
        raise HTTPException(status_code=404, detail="Job application not found")
    
    application.status = status
    try:
        db.commit()
        db.refresh(application)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return application

@router.get("/user/{user_id}/all", response_model=dict)
def get_user_jobs(user_id: int, db: Session = Depends(get_db)):
    """Get all jobs related to a user (posted, applied, invited)"""
    # Jobs posted by user
    posted_jobs = db.query(Job)\
        .filter(Job.user_id == user_id)\
        .all()
    
    posted_jobs_data = [{
        'id': job.id,
        'title': job.job_title,
        'status': job.status,
        'budget': job.budget,
        'category': job.category.category_name,
        'is_assigned': bool(job.job_posts),
        'is_expired': job.service_received is not None if job.service_received else False
    } for job in posted_jobs]

    # Jobs applied to
    applied_jobs = db.query(JobApplication)\
        .join(JobPost)\
        .join(Job)\
        .filter(JobApplication.applicant_id == user_id)\
        .all()
    
    applied_jobs_data = [{
        'id': app.job.id,
        'title': app.job.job_title,
        'status': app.status,
        'budget': app.job.budget,
        'category': app.job.category.category_name,
        'is_assigned': app.status == 'accepted',
        'is_rejected': app.status == 'rejected'
    } for app in applied_jobs]

    # Jobs invited to (assuming there's an invitation system - you might need to add this model)
    # This is a placeholder - you'll need to implement the invitation system
    invited_jobs = []

    return {
        'posted_jobs': posted_jobs_data,
        'applied_jobs': applied_jobs_data,
        'invited_jobs': invited_jobs
    } 