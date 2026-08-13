from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from models.job import Job, JobPost
from models.user import User
from utilities.validate_permissins import require_role, get_db

router = APIRouter(
    dependencies=[require_role(3)],
    tags=["Admin"]
)


def _month_labels(months: int):
    now = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    labels = []
    for i in range(months - 1, -1, -1):
        year = now.year
        month = now.month - i
        while month <= 0:
            month += 12
            year -= 1
        labels.append(datetime(year, month, 1))
    return labels


def build_admin_analytics(db: Session, months: int = 12) -> dict:
    cutoff = datetime.utcnow() - timedelta(days=months * 30)
    posts = db.query(JobPost).join(Job, JobPost.job_id == Job.id).filter(
        JobPost.posted_date >= cutoff
    ).all()
    users = db.query(User).all()

    month_starts = _month_labels(months)
    post_counts = {d.strftime("%Y-%m-01"): 0 for d in month_starts}
    earnings_counts = {d.strftime("%Y-%m-01"): 0 for d in month_starts}
    boosted = 0
    completed = 0
    assigned = 0
    open_posts = 0
    cancelled = 0

    for post in posts:
        dt = post.posted_date
        if dt:
            naive = dt.replace(tzinfo=None) if getattr(dt, "tzinfo", None) else dt
            key = naive.replace(day=1).strftime("%Y-%m-01")
            if key in post_counts:
                post_counts[key] += 1
                boost = post.boost_level or 0
                earnings_counts[key] += boost * 500
        if (post.boost_level or 0) > 0:
            boosted += 1
        status = (post.job.status or "posted").lower() if post.job else "posted"
        if status in ("completed", "complete"):
            completed += 1
        elif status in ("accepted", "in progress", "ongoing"):
            assigned += 1
        elif status in ("cancelled", "canceled"):
            cancelled += 1
        else:
            open_posts += 1

    active_cutoff = datetime.utcnow() - timedelta(days=months * 30)
    active_users = 0
    for user in users:
        last = user.last_active_time or user.created_at
        if last:
            naive = last.replace(tzinfo=None) if getattr(last, "tzinfo", None) else last
            if naive >= active_cutoff:
                active_users += 1
        else:
            active_users += 1

    total_users = len(users) or 1
    total_earnings = sum(earnings_counts.values())
    completion_rate = round(completed / max(len(posts), 1), 2)

    return {
        "posts": [{"label": k, "count": v} for k, v in post_counts.items()],
        "earnings": [{"label": k, "count": v} for k, v in earnings_counts.items()],
        "posted_tasks": [
            {"label": "Completed", "value": completed},
            {"label": "Assigned", "value": assigned},
            {"label": "Open", "value": open_posts},
            {"label": "Cancelled", "value": cancelled},
        ],
        "kpis": {
            "earnings": total_earnings,
            "boosted_posts": boosted,
            "completion_rate": completion_rate,
            "active_users": active_users,
            "active_user_percentage": f"{round(active_users / total_users * 100)}%",
        },
    }


@router.get("/dashboard")
def get_home_data(db: Session = Depends(get_db)):
    data = build_admin_analytics(db, 12)
    data["message"] = "Admin dashboard data"
    return data


@router.get("/analytics")
def get_admin_analytics(
    period: str = Query("for_12_months"),
    db: Session = Depends(get_db),
):
    months = 1 if period == "for_1_month" else 6 if period == "for_6_months" else 12
    return build_admin_analytics(db, months)
