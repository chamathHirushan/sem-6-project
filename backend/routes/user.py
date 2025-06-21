from fastapi import APIRouter
from utilities.validate_permissins import require_role

router= APIRouter(
    dependencies=[require_role(0)],
    tags=["User"]
)

@router.get("/dashboard")
def get_home_data():
    return {"message": "User dashboard data - sent from backend."}