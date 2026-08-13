from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from services.gateway_service import GatewayService
from services.user_service import UserService
from utilities.validate_permissins import require_role, get_db

otp_service = GatewayService()

router = APIRouter(
    dependencies=[require_role(0)],
    tags=["Gateways"]
)


@router.post("/otp/send")
async def send_otp(
        phone_number: str,
        request: Request
    ):
    email = request.state.email
    return await otp_service._store_otp(email, phone_number)


@router.post("/otp/verify")
async def verify_otp(
        input_otp: str,
        phone_number: str,
        request: Request,
        db: Session = Depends(get_db)
    ):
    email = request.state.email
    verified = otp_service._verify_otp(email, input_otp, phone_number)
    if verified:
        user_service = UserService(db)
        user = user_service.get_user_by_email(email)
        if user:
            user_service.update_user(user.id, {"phone_number": phone_number})
    return verified
