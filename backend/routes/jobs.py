from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.database import SessionLocal
from models.job import Job, JobPost, JobPostComment, JobApplication, Working
from models.user import User
from models.working import WorkingCategory
from pydantic import BaseModel
from datetime import datetime, timedelta

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
class JobBase(BaseModel):
    user_id: int
    category_id: int
    job_title: str
    budget: float
    status: str = "posted"

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    available: bool
    service_received: Optional[datetime]

    class Config:
        orm_mode = True

class JobPostBase(BaseModel):
    job_id: int
    user_id: int
    post_title: str
    location: str
    description: str
    due_date: datetime
    photos: str | None = None
    boost_level: int = 0
    subcategory: str | None = None

class JobPostCreate(JobPostBase):
    pass

class JobPostResponse(JobPostBase):
    id: int
    posted_date: datetime
    views: int
    
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

# Frontend Job Response Model
class FrontendJobResponse(BaseModel):
    id: str
    title: str
    category: str
    subCategory: str
    image: str
    location: str
    daysPosted: int
    budget: float
    isUrgent: bool
    isTrending: bool
    isBookmarked: bool

    class Config:
        orm_mode = True

# Job endpoints
@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.dict())
    db.add(db_job)
    try:
        db.commit()
        db.refresh(db_job)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_job

# Job Post endpoints
@router.post("/posts/", response_model=JobPostResponse)
def create_job_post(job: JobPostCreate, db: Session = Depends(get_db)):
    # Check if job exists
    db_job = db.query(Job).filter(Job.id == job.job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    db_job_post = JobPost(**job.dict())
    db.add(db_job_post)
    try:
        db.commit()
        db.refresh(db_job_post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_job_post

@router.get("/posts/{post_id}", response_model=JobPostResponse)
def get_job_post(post_id: int, db: Session = Depends(get_db)):
    job_post = db.query(JobPost).filter(JobPost.id == post_id).first()
    if job_post is None:
        raise HTTPException(status_code=404, detail="Job post not found")
    return job_post

@router.get("/posts/", response_model=List[JobPostResponse])
def get_job_posts(
    skip: int = 0, 
    limit: int = 100, 
    location: Optional[str] = None,
    min_salary: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(JobPost).join(Job)
    if location:
        query = query.filter(JobPost.location == location)
    if min_salary:
        query = query.filter(Job.budget >= min_salary)
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/posts/all", response_model=List[JobPostDetailResponse])
def get_all_job_posts(db: Session = Depends(get_db)):
    """Get all job posts with poster details"""
    try:
        posts = db.query(JobPost)\
            .join(Job, JobPost.job_id == Job.id)\
            .join(User, JobPost.user_id == User.id)\
            .join(Working, Job.category_id == Working.id)\
            .options(
                joinedload(JobPost.job),
                joinedload(JobPost.user),
                joinedload(JobPost.job).joinedload(Job.category)
            )\
            .all()
        
        response = []
        for post in posts:
            post_dict = {
                'id': post.id,
                'job_id': post.job_id,
                'user_id': post.user_id,
                'post_title': post.post_title,
                'location': post.location,
                'description': post.description,
                'due_date': post.due_date,
                'posted_date': post.posted_date,
                'photos': post.photos,
                'views': post.views,
                'boost_level': post.boost_level,
                'poster_name': post.user.name,
                'poster_photo': post.user.pro_pic,
                'category_name': post.job.category.category_name,
                'budget': post.job.budget,
                'status': post.job.status
            }
            response.append(post_dict)
        
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching job posts: {str(e)}"
        )

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
            'poster_name': post.user.name,  # Updated to use the combined name field
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

@router.get("/frontend/all", response_model=List[FrontendJobResponse])
def get_frontend_jobs(
    category: Optional[str] = None,
    subCategory: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all jobs in the format expected by the frontend Works component"""
    try:
        # Start with a query that joins JobPost with Job and related tables
        query = db.query(JobPost)\
            .join(Job, JobPost.job_id == Job.id)\
            .join(User, JobPost.user_id == User.id)\
            .join(WorkingCategory, Job.category_id == WorkingCategory.id)\
            .filter(Job.available == True)\
            .options(
                joinedload(JobPost.job),
                joinedload(JobPost.user),
                joinedload(JobPost.job).joinedload(Job.category)
            )
        
        # Apply filters
        if category:
            query = query.filter(WorkingCategory.category_name.ilike(f"%{category}%"))
        if subCategory:
            query = query.filter(JobPost.subcategory.ilike(f"%{subCategory}%"))
        if location:
            query = query.filter(JobPost.location.ilike(f"%{location}%"))
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (JobPost.post_title.ilike(search_term)) |
                (JobPost.location.ilike(search_term)) |
                (Job.job_title.ilike(search_term))
            )
        
        # Order by boost level (urgency) and posted date
        query = query.order_by(JobPost.boost_level.desc(), JobPost.posted_date.desc())
        
        posts = query.all()
        
        response = []
        current_date = datetime.now()
        
        for post in posts:
            # Calculate days posted - handle timezone differences
            if post.posted_date.tzinfo is not None:
                # If posted_date has timezone info, make current_date timezone-aware
                current_date_tz = current_date.replace(tzinfo=post.posted_date.tzinfo)
                days_posted = (current_date_tz - post.posted_date).days
            else:
                # If posted_date is naive, use naive current_date
                days_posted = (current_date - post.posted_date.replace(tzinfo=None)).days
            
            # Determine if job is urgent (boost_level > 0 or posted within last 3 days)
            is_urgent = post.boost_level > 0 or days_posted <= 3
            
            # For now, isBookmarked is False (this would need to be implemented with user favorites)
            is_bookmarked = False
            
            # Get the first photo as image, or use a default
            image_url = post.photos.split(',')[0] if post.photos else "default_job_image.jpg"
            
            job_dict = {
                'id': str(post.id),
                'title': post.post_title,
                'category': post.job.category.category_name,
                'subCategory': post.subcategory or post.job.category.category_name,  # Use actual subcategory or fallback to category
                'image': image_url,
                'location': post.location,
                'daysPosted': days_posted,
                'budget': post.job.budget,
                'isUrgent': is_urgent,
                'isBookmarked': is_bookmarked
            }
            response.append(job_dict)
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching frontend jobs: {str(e)}"
        ) 