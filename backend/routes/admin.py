from fastapi import APIRouter
from utilities.validate_permissins import require_role

router= APIRouter(
    dependencies=[require_role(3)],
    tags=["Admin"]
)

@router.get("/dashboard")
def get_home_data():
    return {"message": "Admin dashboard data - sent from backend."}