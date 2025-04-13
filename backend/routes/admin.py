from fastapi import APIRouter
from utilities.validate_permissins import require_role

router= APIRouter(
    dependencies=[require_role(3)],
    tags=["Admin"]
)

@router.get("/stats")
def get_stats():
    return "done"