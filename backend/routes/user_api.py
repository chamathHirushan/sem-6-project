from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from models.communication import Notification, Conversation, Message
from models.favourite import Favourite
from models.job import Job, JobPost, JobApplication, Working
from models.user import User
from models.worker import WorkerPost, WorkerReview
from models.working import WorkingCategory, UserWorkingField
from services.user_service import user_to_payload, UserService
from utilities.validate_permissins import require_role, get_current_user, get_db

router = APIRouter(
    prefix="/user",
    tags=["User API"],
    dependencies=[require_role(0)],
)

task_router = APIRouter(
    tags=["Tasks"],
    dependencies=[require_role(0)],
)


# ---------- helpers ----------

def parse_photos(photos) -> List[str]:
    if not photos:
        return []
    value = str(photos).strip()
    if value.startswith("["):
        try:
            import json
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(p) for p in parsed if p]
        except Exception:
            pass
    return [p.strip() for p in value.split(",") if p.strip()]


def join_photos(images) -> Optional[str]:
    if not images:
        return None
    if isinstance(images, list):
        return ",".join(str(i) for i in images if i)
    return str(images)


def days_since(dt) -> int:
    if not dt:
        return 0
    now = datetime.utcnow()
    if getattr(dt, "tzinfo", None):
        now = datetime.now(dt.tzinfo)
        return max(0, (now - dt).days)
    return max(0, (now - dt.replace(tzinfo=None)).days)


def format_days_posted(dt) -> str:
    d = days_since(dt)
    if d < 1:
        return "today"
    if d == 1:
        return "1 day"
    if d < 30:
        return f"{d} days"
    months = d // 30
    if months == 1:
        return "1 month"
    if months < 12:
        return f"{months} months"
    years = months // 12
    return "1 year" if years == 1 else f"{years} years"


def relative_time(dt) -> str:
    if not dt:
        return ""
    now = datetime.utcnow()
    if getattr(dt, "tzinfo", None):
        now = datetime.now(dt.tzinfo)
        delta = now - dt
    else:
        delta = now - dt.replace(tzinfo=None)
    seconds = int(delta.total_seconds())
    if seconds < 60:
        return "just now"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes} min ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours} hour ago" if hours == 1 else f"{hours} hours ago"
    days = hours // 24
    if days < 30:
        return f"{days} day ago" if days == 1 else f"{days} days ago"
    return format_days_posted(dt) + " ago"


def bookmark_types(entity_type: str) -> List[str]:
    if entity_type in ("job", "job_post"):
        return ["job", "job_post"]
    if entity_type in ("service", "worker_post"):
        return ["service", "worker_post"]
    return [entity_type]


def is_bookmarked(db: Session, user_id: int, entity_id: int, entity_type: str) -> bool:
    return db.query(Favourite).filter(
        Favourite.user_id == user_id,
        Favourite.source_entity_id == entity_id,
        Favourite.source_entity_type.in_(bookmark_types(entity_type)),
    ).first() is not None


def create_notification(db: Session, user_id: int, ntype: str, source_id: int):
    db.add(Notification(
        user_id=user_id,
        notification_type=ntype,
        source_entity_id=source_id,
        is_read=False,
    ))


def get_or_create_category(db: Session, name: str) -> WorkingCategory:
    if not name:
        name = "Other"
    cat = db.query(WorkingCategory).filter(WorkingCategory.category_name.ilike(name)).first()
    if not cat:
        cat = WorkingCategory(category_name=name)
        db.add(cat)
        db.commit()
        db.refresh(cat)
    return cat


def avg_user_rating(user: User) -> float:
    reviews = []
    for post in getattr(user, "worker_posts", []) or []:
        reviews.extend(post.reviews or [])
    if not reviews:
        return 0
    return round(sum(r.rating or 0 for r in reviews) / len(reviews), 1)


def job_list_item(post: JobPost, db: Session, user: User) -> dict:
    days = days_since(post.posted_date)
    photos = parse_photos(post.photos)
    category_name = ""
    budget = 0
    if post.job:
        budget = post.job.budget or 0
        if post.job.category:
            category_name = post.job.category.category_name or ""
    return {
        "id": str(post.id),
        "title": post.post_title,
        "category": category_name,
        "subCategory": post.subcategory or category_name,
        "image": photos[0] if photos else "",
        "location": post.location or "",
        "daysPosted": days,
        "jobType": "Part-Time",
        "budget": budget,
        "isUrgent": bool(post.boost_level) or days <= 3,
        "isTrending": (post.views or 0) > 10 or (post.boost_level or 0) > 1,
        "isBookmarked": is_bookmarked(db, user.id, post.id, "job"),
    }


def service_list_item(post: WorkerPost, db: Session, user: User) -> dict:
    days = days_since(post.post_date)
    photos = parse_photos(post.photos)
    category_name = post.category.category_name if post.category else ""
    title = post.title or (post.description or "")[:80] or "Service"
    return {
        "id": str(post.id),
        "title": title,
        "category": category_name,
        "subCategory": post.subcategory or category_name,
        "image": photos[0] if photos else "",
        "location": post.location or "",
        "daysPosted": days,
        "taskType": post.subcategory or category_name,
        "isUrgent": bool(post.boost_level) or days <= 3,
        "isTrending": (post.views or 0) > 10 or (post.boost_level or 0) > 1,
        "isBookmarked": is_bookmarked(db, user.id, post.id, "service"),
    }


def map_posted_status(status: Optional[str]) -> str:
    value = (status or "pending").lower()
    if value in ("accepted", "in progress", "in_progress", "ongoing"):
        return "In Progress"
    if value in ("cancelled", "canceled"):
        return "Cancelled"
    if value in ("completed", "complete"):
        return "Completed"
    return "Pending"


def map_applied_status(status: Optional[str]) -> str:
    value = (status or "pending").lower()
    if value in ("accepted", "accept"):
        return "Accepted"
    if value in ("rejected", "reject"):
        return "Rejected"
    if value in ("cancelled", "canceled"):
        return "Cancelled"
    return "Pending"


def map_assigned_status(status: Optional[str]) -> str:
    value = (status or "ongoing").lower()
    if value in ("completed", "complete"):
        return "Completed"
    return "Ongoing"


# ---------- pydantic ----------

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    town: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None
    pro_pic: Optional[str] = None


class JobCreateBody(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    mini_description: Optional[str] = None
    budget: Optional[float] = None
    location: Optional[str] = None
    urgent: Optional[bool] = False
    category: Optional[str] = None
    subcategory: Optional[str] = None
    due_date: Optional[str] = None
    posted_date: Optional[str] = None
    images: Optional[list] = None
    poster: Optional[str] = None
    boost_level: Optional[int] = 0


class TaskCreateBody(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    location: Optional[str] = None


class ServiceCreateBody(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    mini_description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    images: Optional[list] = None
    poster: Optional[str] = None
    boost_level: Optional[int] = 0


class BookmarkBody(BaseModel):
    state: Optional[bool] = True
    entity_type: Optional[str] = "job"
    type: Optional[str] = None


class ReviewBody(BaseModel):
    rating: Optional[float] = 5
    text: Optional[str] = None
    comment: Optional[str] = None
    text_comment: Optional[str] = None
    photos: Optional[list] = None


class FieldCreateBody(BaseModel):
    category: Optional[str] = None
    category_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "pending"


class FieldUpdateBody(BaseModel):
    description: Optional[str] = None
    status: Optional[str] = None


class JobStatusBody(BaseModel):
    status: Optional[str] = None
    category: Optional[str] = None


class ConversationCreateBody(BaseModel):
    other_user_id: int


class MessageCreateBody(BaseModel):
    text: str
    photos: Optional[list] = None


# ---------- profile ----------

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    payload = user_to_payload(current_user)
    payload["last_active"] = current_user.last_active_time.isoformat() if current_user.last_active_time else None
    payload["joined_date"] = current_user.created_at.isoformat() if current_user.created_at else None
    payload["created_at"] = payload["joined_date"]
    return payload


@router.put("/profile")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = {}
    if data.name is not None:
        updates["name"] = data.name
    if data.town is not None:
        updates["town"] = data.town
    if data.phone_number is not None:
        updates["phone_number"] = data.phone_number
    pic = data.pro_pic if data.pro_pic is not None else data.profile_picture
    if pic is not None:
        updates["pro_pic"] = pic
    user = UserService(db).update_user(current_user.id, updates) if updates else current_user
    return user_to_payload(user)


# ---------- jobs ----------

@router.get("/jobs/available")
def get_available_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = db.query(JobPost).options(
        joinedload(JobPost.job).joinedload(Job.category),
        joinedload(JobPost.user),
    ).join(Job, JobPost.job_id == Job.id).filter(
        or_(Job.available == True, Job.available.is_(None))
    ).order_by(JobPost.boost_level.desc(), JobPost.posted_date.desc()).all()
    return [job_list_item(post, db, current_user) for post in posts]


@router.post("/jobs/add")
def add_job(
    data: JobCreateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = get_or_create_category(db, data.category or "Other")
    due_date = None
    if data.due_date:
        try:
            due_date = datetime.fromisoformat(data.due_date.replace("Z", "+00:00"))
        except Exception:
            due_date = None

    job = Job(
        user_id=current_user.id,
        category_id=category.id,
        job_title=data.title or "Untitled",
        budget=data.budget or 0,
        status="posted",
        available=True,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    photos = join_photos(data.images)
    if data.poster and photos:
        photos = f"{data.poster},{photos}"
    elif data.poster:
        photos = data.poster

    boost = data.boost_level or (1 if data.urgent else 0)
    post = JobPost(
        job_id=job.id,
        user_id=current_user.id,
        post_title=data.title or "Untitled",
        location=data.location,
        description=data.description or data.mini_description,
        due_date=due_date,
        photos=photos,
        boost_level=boost,
        subcategory=data.subcategory,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return job_list_item(post, db, current_user)


@router.get("/jobs")
def get_user_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = []

    posted = db.query(JobPost).options(
        joinedload(JobPost.job).joinedload(Job.category)
    ).filter(JobPost.user_id == current_user.id).order_by(JobPost.posted_date.desc()).all()
    for post in posted:
        photos = parse_photos(post.photos)
        budget = post.job.budget if post.job else 0
        result.append({
            "id": str(post.id),
            "title": post.post_title,
            "description": post.description or "",
            "imageUrl": photos[0] if photos else "",
            "budget": f"Rs.{int(budget)}" if budget else "-",
            "category": "Posted by Me",
            "subCategory": post.subcategory or (post.job.category.category_name if post.job and post.job.category else ""),
            "status": map_posted_status(post.job.status if post.job else None),
        })

    applications = db.query(JobApplication).options(
        joinedload(JobApplication.job).joinedload(JobPost.job)
    ).filter(JobApplication.applicant_id == current_user.id).all()
    for app in applications:
        post = app.job
        if not post:
            continue
        photos = parse_photos(post.photos)
        budget = post.job.budget if post.job else 0
        result.append({
            "id": str(post.id),
            "application_id": app.id,
            "title": post.post_title,
            "description": post.description or "",
            "imageUrl": photos[0] if photos else "",
            "budget": f"Rs.{int(budget)}" if budget else "-",
            "category": "Applied by Me",
            "subCategory": post.subcategory or "",
            "status": map_applied_status(app.status),
        })

    assigned = db.query(Working).options(
        joinedload(Working.job).joinedload(JobPost.job)
    ).filter(Working.worker_id == current_user.id).all()
    for work in assigned:
        post = work.job
        if not post:
            continue
        photos = parse_photos(post.photos)
        budget = post.job.budget if post.job else 0
        result.append({
            "id": str(post.id),
            "working_id": work.id,
            "title": post.post_title,
            "description": post.description or "",
            "imageUrl": photos[0] if photos else "",
            "budget": f"Rs.{int(budget)}" if budget else "-",
            "category": "Assigned to Me",
            "subCategory": post.subcategory or "",
            "status": map_assigned_status(work.status),
        })

    return result


@router.get("/jobs/{job_id}")
def get_job_details(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(JobPost).options(
        joinedload(JobPost.job).joinedload(Job.category),
        joinedload(JobPost.user),
    ).filter(JobPost.id == job_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Job not found")

    post.views = (post.views or 0) + 1
    db.commit()

    photos = parse_photos(post.photos)
    category_name = post.job.category.category_name if post.job and post.job.category else ""
    has_applied = db.query(JobApplication).filter(
        JobApplication.job_id == post.id,
        JobApplication.applicant_id == current_user.id,
        JobApplication.status != "cancelled",
    ).first() is not None

    return {
        "id": str(post.id),
        "title": post.post_title,
        "category": category_name,
        "subCategory": post.subcategory or category_name,
        "location": post.location or "",
        "isUrgent": bool(post.boost_level) or days_since(post.posted_date) <= 3,
        "daysPosted": format_days_posted(post.posted_date),
        "dueDate": post.due_date.strftime("%Y-%m-%d") if post.due_date else "",
        "postedDate": post.posted_date.strftime("%Y-%m-%d") if post.posted_date else "",
        "postedUserName": post.user.name if post.user else "",
        "postedUserImage": post.user.pro_pic if post.user else "",
        "postedUserId": post.user_id,
        "postedUserRating": avg_user_rating(post.user) if post.user else 0,
        "miniDescription": (post.description or "")[:160],
        "budget": post.job.budget if post.job else 0,
        "address": post.location or "",
        "description": post.description or "",
        "poster": photos[0] if photos else "",
        "isBookmarked": is_bookmarked(db, current_user.id, post.id, "job"),
        "image": photos,
        "hasApplied": has_applied,
    }


@router.post("/jobs/{job_id}/apply")
def apply_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(JobPost).filter(JobPost.id == job_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Job not found")
    if post.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot apply to your own job")

    existing = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.applicant_id == current_user.id,
    ).first()
    if existing:
        if existing.status == "cancelled":
            existing.status = "pending"
            db.commit()
        else:
            raise HTTPException(status_code=400, detail="Already applied")
        application = existing
    else:
        application = JobApplication(
            job_id=job_id,
            applicant_id=current_user.id,
            status="pending",
        )
        db.add(application)
        db.commit()
        db.refresh(application)

    if post.user_id:
        create_notification(db, post.user_id, "new application", application.id)
        db.commit()
    return {"success": True, "application_id": application.id}


@router.delete("/jobs/{job_id}/cancel")
def cancel_job_application(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.applicant_id == current_user.id,
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    application.status = "cancelled"
    db.commit()
    return {"success": True}


@router.patch("/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    data: JobStatusBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    status = data.status or "Pending"
    category = data.category or "Posted by Me"

    if category == "Posted by Me":
        post = db.query(JobPost).filter(JobPost.id == job_id, JobPost.user_id == current_user.id).first()
        if not post or not post.job:
            raise HTTPException(status_code=404, detail="Job not found")
        mapping = {
            "Pending": "posted",
            "In Progress": "accepted",
            "Cancelled": "cancelled",
            "Completed": "completed",
        }
        post.job.status = mapping.get(status, status.lower())
        if status == "Cancelled":
            post.job.available = False
        db.commit()
        return {"success": True, "status": status}

    if category == "Applied by Me":
        application = db.query(JobApplication).filter(
            JobApplication.job_id == job_id,
            JobApplication.applicant_id == current_user.id,
        ).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        application.status = status.lower()
        db.commit()
        return {"success": True, "status": status}

    if category == "Assigned to Me":
        work = db.query(Working).filter(
            Working.job_id == job_id,
            Working.worker_id == current_user.id,
        ).first()
        if not work:
            raise HTTPException(status_code=404, detail="Assignment not found")
        work.status = status.lower()
        db.commit()
        return {"success": True, "status": status}

    raise HTTPException(status_code=400, detail="Unknown category")


# ---------- services ----------

@router.get("/services/available")
def get_available_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = db.query(WorkerPost).options(
        joinedload(WorkerPost.user),
        joinedload(WorkerPost.category),
        joinedload(WorkerPost.reviews),
    ).order_by(WorkerPost.boost_level.desc(), WorkerPost.post_date.desc()).all()
    return [service_list_item(post, db, current_user) for post in posts]


@router.post("/services/add")
def add_service(
    data: ServiceCreateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = get_or_create_category(db, data.category or "Other")
    photos = join_photos(data.images)
    if data.poster and photos:
        photos = f"{data.poster},{photos}"
    elif data.poster:
        photos = data.poster

    post = WorkerPost(
        user_id=current_user.id,
        category_id=category.id,
        location=data.location,
        title=data.title,
        subcategory=data.subcategory,
        description=data.description or data.mini_description,
        photos=photos,
        boost_level=data.boost_level or 0,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return service_list_item(post, db, current_user)


@router.get("/services/{service_id}")
def get_service_details(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(WorkerPost).options(
        joinedload(WorkerPost.user),
        joinedload(WorkerPost.category),
        joinedload(WorkerPost.reviews),
    ).filter(WorkerPost.id == service_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Service not found")

    post.views = (post.views or 0) + 1
    db.commit()

    photos = parse_photos(post.photos)
    reviews = post.reviews or []
    avg_rating = round(sum(r.rating or 0 for r in reviews) / len(reviews), 1) if reviews else 0
    category_name = post.category.category_name if post.category else ""
    title = post.title or (post.description or "")[:80] or "Service"
    comments = []
    for review in reviews:
        comments.append({
            "id": review.id,
            "name": review.commenter.name if review.commenter else "User",
            "text": review.text_comment,
            "rating": review.rating,
            "date": review.review_date.strftime("%Y-%m-%d") if review.review_date else "",
        })

    return {
        "id": str(post.id),
        "title": title,
        "category": category_name,
        "taskType": post.subcategory or category_name,
        "location": post.location or "",
        "isUrgent": bool(post.boost_level),
        "isTrending": (post.views or 0) > 10,
        "daysPosted": format_days_posted(post.post_date),
        "dueDate": "",
        "postedDate": post.post_date.strftime("%Y-%m-%d") if post.post_date else "",
        "postedUserName": post.user.name if post.user else "",
        "postedUserImage": post.user.pro_pic if post.user else "",
        "postedUserId": post.user_id,
        "postedUserRating": avg_rating,
        "miniDescription": (post.description or "")[:160],
        "budget": 0,
        "address": post.location or "",
        "description": post.description or "",
        "poster": photos[0] if photos else "",
        "isBookmarked": is_bookmarked(db, current_user.id, post.id, "service"),
        "image": photos,
        "comments": comments,
        "reviewCount": len(reviews),
    }


# ---------- bookmarks ----------

@router.get("/bookmarks")
def get_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favs = db.query(Favourite).filter(Favourite.user_id == current_user.id).all()
    jobs = []
    services = []
    for fav in favs:
        if fav.source_entity_type in ("job", "job_post"):
            post = db.query(JobPost).options(
                joinedload(JobPost.job).joinedload(Job.category)
            ).filter(JobPost.id == fav.source_entity_id).first()
            if post:
                item = job_list_item(post, db, current_user)
                item["isBookmarked"] = True
                jobs.append(item)
        elif fav.source_entity_type in ("service", "worker_post"):
            post = db.query(WorkerPost).options(
                joinedload(WorkerPost.category),
                joinedload(WorkerPost.user),
            ).filter(WorkerPost.id == fav.source_entity_id).first()
            if post:
                item = service_list_item(post, db, current_user)
                item["isBookmarked"] = True
                services.append(item)
    return {"jobs": jobs, "services": services, "tasks": services}


@router.post("/bookmarks/add/{item_id}")
def add_bookmark(
    item_id: int,
    data: Optional[BookmarkBody] = None,
    entity_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = data or BookmarkBody()
    etype = entity_type or data.entity_type or data.type or "job"
    if etype in ("task", "worker"):
        etype = "service"
    if etype == "job_post":
        etype = "job"
    if data.state is False:
        db.query(Favourite).filter(
            Favourite.user_id == current_user.id,
            Favourite.source_entity_id == item_id,
            Favourite.source_entity_type.in_(bookmark_types(etype)),
        ).delete(synchronize_session=False)
        db.commit()
        return {"success": True, "bookmarked": False}

    existing = db.query(Favourite).filter(
        Favourite.user_id == current_user.id,
        Favourite.source_entity_id == item_id,
        Favourite.source_entity_type.in_(bookmark_types(etype)),
    ).first()
    if not existing:
        db.add(Favourite(
            user_id=current_user.id,
            source_entity_type=etype,
            source_entity_id=item_id,
        ))
        db.commit()
    return {"success": True, "bookmarked": True}


@router.delete("/bookmarks/remove/{item_id}")
def remove_bookmark(
    item_id: int,
    entity_type: Optional[str] = Query("job"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    etype = entity_type or "job"
    if etype in ("task", "worker"):
        etype = "service"
    db.query(Favourite).filter(
        Favourite.user_id == current_user.id,
        Favourite.source_entity_id == item_id,
        Favourite.source_entity_type.in_(bookmark_types(etype)),
    ).delete(synchronize_session=False)
    db.commit()
    return {"success": True}


# ---------- notifications ----------

def notification_message(notif: Notification) -> tuple:
    ntype = (notif.notification_type or "").lower()
    if "application" in ntype:
        return "Someone applied to your job", f"/my-jobs"
    if "review" in ntype:
        return "You received a new review", f"/hire/{notif.source_entity_id}"
    if "message" in ntype:
        return "You have a new message", "/conversations"
    if "comment" in ntype:
        return "New comment on your post", f"/work/{notif.source_entity_id}"
    return notif.notification_type or "Notification", "/"


@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(50).all()
    result = []
    for notif in rows:
        message, link = notification_message(notif)
        result.append({
            "id": notif.id,
            "message": message,
            "time": relative_time(notif.created_at),
            "read": bool(notif.is_read),
            "link": link,
        })
    return result


@router.post("/notifications/read/all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"success": True}


@router.post("/notifications/read/{notification_id}")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"success": True}


# ---------- reviews ----------

@router.get("/reviews")
def get_user_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reviews = db.query(WorkerReview).filter(
        or_(
            WorkerReview.worker_id == current_user.id,
            WorkerReview.commenter_id == current_user.id,
        )
    ).order_by(WorkerReview.review_date.desc()).all()
    result = []
    for review in reviews:
        result.append({
            "id": review.id,
            "post_id": review.post_id,
            "rating": review.rating,
            "text": review.text_comment,
            "commenter_name": review.commenter.name if review.commenter else "",
            "review_date": review.review_date.isoformat() if review.review_date else None,
        })
    return result


@router.post("/reviews/{post_id}")
def add_review(
    post_id: int,
    data: ReviewBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(WorkerPost).filter(WorkerPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Service post not found")
    review = WorkerReview(
        post_id=post_id,
        worker_id=post.user_id,
        commenter_id=current_user.id,
        rating=data.rating or 5,
        text_comment=data.text_comment or data.comment or data.text,
        photos=join_photos(data.photos),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    if post.user_id and post.user_id != current_user.id:
        create_notification(db, post.user_id, "new review", review.id)
        db.commit()
    return {"success": True, "id": review.id}


# ---------- fields ----------

@router.get("/fields")
def get_fields(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fields = db.query(UserWorkingField).options(
        joinedload(UserWorkingField.category)
    ).filter(UserWorkingField.user_id == current_user.id).all()
    result = []
    for field in fields:
        title = field.category.category_name if field.category else "Field"
        result.append({
            "id": str(field.id),
            "title": title,
            "description": field.description or "",
            "imageUrl": "",
            "budget": "",
            "status": field.status or "pending",
            "category_id": field.category_id,
        })
    return result


@router.post("/fields")
def add_field(
    data: FieldCreateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = None
    if data.category_id:
        category = db.query(WorkingCategory).filter(WorkingCategory.id == data.category_id).first()
    if not category:
        category = get_or_create_category(db, data.category or data.title or "Other")
    field = UserWorkingField(
        user_id=current_user.id,
        category_id=category.id,
        status=data.status or "pending",
        description=data.description,
    )
    db.add(field)
    db.commit()
    db.refresh(field)
    return {
        "id": str(field.id),
        "title": category.category_name,
        "description": field.description or "",
        "imageUrl": "",
        "budget": "",
        "status": field.status,
        "category_id": field.category_id,
    }


@router.put("/fields/{field_id}")
def update_field(
    field_id: int,
    data: FieldUpdateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = db.query(UserWorkingField).filter(
        UserWorkingField.id == field_id,
        UserWorkingField.user_id == current_user.id,
    ).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    if data.status is not None:
        field.status = data.status
    if data.description is not None:
        field.description = data.description
    db.commit()
    return {"success": True}


# ---------- conversations ----------

def conversation_payload(conv: Conversation, current_user: User, db: Session) -> dict:
    other_id = conv.user_2_id if conv.user_1_id == current_user.id else conv.user_1_id
    other = db.query(User).filter(User.id == other_id).first()
    last_message = db.query(Message).filter(
        Message.conversation_id == conv.id
    ).order_by(Message.created_at.desc()).first()
    unread = db.query(Message).filter(
        Message.conversation_id == conv.id,
        Message.sender_id != current_user.id,
        Message.is_read == False,
    ).count()
    return {
        "id": conv.id,
        "other_user_id": other_id,
        "other_user_name": other.name if other else "User",
        "other_user_photo": other.pro_pic if other else "",
        "last_message": last_message.text if last_message else "",
        "last_message_time": last_message.created_at.isoformat() if last_message and last_message.created_at else None,
        "unread_count": unread,
    }


def get_or_create_conversation(db: Session, user_id: int, other_user_id: int) -> Conversation:
    if user_id == other_user_id:
        raise HTTPException(status_code=400, detail="Cannot chat with yourself")
    conv = db.query(Conversation).filter(
        or_(
            (Conversation.user_1_id == user_id) & (Conversation.user_2_id == other_user_id),
            (Conversation.user_1_id == other_user_id) & (Conversation.user_2_id == user_id),
        )
    ).first()
    if not conv:
        conv = Conversation(user_1_id=user_id, user_2_id=other_user_id)
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return conv


@router.get("/conversations")
def list_conversations(
    other_user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if other_user_id:
        conv = get_or_create_conversation(db, current_user.id, other_user_id)
        return [conversation_payload(conv, current_user, db)]
    convs = db.query(Conversation).filter(
        or_(Conversation.user_1_id == current_user.id, Conversation.user_2_id == current_user.id)
    ).all()
    payloads = [conversation_payload(c, current_user, db) for c in convs]
    payloads.sort(key=lambda c: c["last_message_time"] or "", reverse=True)
    return payloads


@router.post("/conversations")
def start_conversation(
    data: ConversationCreateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_or_create_conversation(db, current_user.id, data.other_user_id)
    return conversation_payload(conv, current_user, db)


@router.get("/conversations/{conversation_id}/messages")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv or current_user.id not in (conv.user_1_id, conv.user_2_id):
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()

    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False,
    ).update({"is_read": True})
    db.commit()

    result = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        result.append({
            "id": msg.id,
            "from": "me" if msg.sender_id == current_user.id else (sender.name if sender else "them"),
            "text": msg.text,
            "sender_id": msg.sender_id,
            "created_at": msg.created_at.isoformat() if msg.created_at else None,
        })
    return result


@router.post("/conversations/{conversation_id}/messages")
def send_message(
    conversation_id: int,
    data: MessageCreateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv or current_user.id not in (conv.user_1_id, conv.user_2_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        text=data.text,
        photos=join_photos(data.photos),
        is_read=False,
    )
    db.add(msg)
    other_id = conv.user_2_id if conv.user_1_id == current_user.id else conv.user_1_id
    create_notification(db, other_id, "new message", conversation_id)
    db.commit()
    db.refresh(msg)
    return {
        "id": msg.id,
        "from": "me",
        "text": msg.text,
        "sender_id": msg.sender_id,
        "created_at": msg.created_at.isoformat() if msg.created_at else None,
    }


# ---------- analytics ----------

def _period_days(period: str) -> int:
    if period in ("for_1_month", "1m"):
        return 30
    if period in ("for_6_months", "6m"):
        return 180
    return 365


def build_user_period(db: Session, user: User, days: int) -> dict:
    cutoff = datetime.utcnow() - timedelta(days=days)
    posts = db.query(JobPost).options(joinedload(JobPost.job).joinedload(Job.category)).filter(
        JobPost.user_id == user.id,
        JobPost.posted_date >= cutoff,
    ).all()
    posted_counts = {}
    views = 0
    for post in posts:
        label = post.subcategory or (post.job.category.category_name if post.job and post.job.category else "Other")
        posted_counts[label] = posted_counts.get(label, 0) + 1
        views += post.views or 0

    applications = db.query(JobApplication).options(
        joinedload(JobApplication.job)
    ).filter(
        JobApplication.applicant_id == user.id,
        JobApplication.applied_at >= cutoff,
    ).all()
    invite_counts = {}
    accepted = 0
    for app in applications:
        label = app.job.subcategory if app.job else "Other"
        invite_counts[label] = invite_counts.get(label, 0) + 1
        if (app.status or "").lower() in ("accepted", "completed"):
            accepted += 1

    completed_work = db.query(Working).filter(
        Working.worker_id == user.id,
        Working.status.ilike("completed"),
    ).count()

    total_apps = len(applications) or 1
    posted_tasks = [{"label": k, "value": v} for k, v in posted_counts.items()] or [{"label": "None", "value": 0}]
    invites = [{"label": k, "value": v} for k, v in invite_counts.items()] or [{"label": "None", "value": 0}]
    return {
        "posted_tasks": posted_tasks,
        "invites": invites,
        "total_subscription_views": views,
        "completed_invites": completed_work,
        "engaged_users": len(applications),
        "views_per_task": round(views / len(posts), 1) if posts else 0,
        "completion_rate": round(completed_work / max(len(posts), 1), 2),
        "acceptance_rate": round(accepted / total_apps, 2),
    }


@router.get("/analytics")
def get_analytics(
    period: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = {
        "for_1_month": build_user_period(db, current_user, 30),
        "for_6_months": build_user_period(db, current_user, 180),
        "for_12_months": build_user_period(db, current_user, 365),
    }
    if period and period in data:
        return data[period]
    return data


# ---------- legacy task add ----------

@task_router.post("/task/add")
def add_task(
    data: TaskCreateBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return add_job(JobCreateBody(
        title=data.title,
        description=data.description,
        budget=data.budget,
        location=data.location,
    ), db, current_user)
