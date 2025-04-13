from fastapi import APIRouter
from utilities.validate_permissins import require_role

router= APIRouter(
    dependencies=[require_role(1)],
    tags=["User"]
)

@router.get("/dashboard")
def get_home_data():
    return {"message": "User dashboard data - sent from backend."}