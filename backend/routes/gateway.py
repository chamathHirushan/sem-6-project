from fastapi import APIRouter
from services.gateway_service import GatewayService
from utilities.validate_permissins import require_role

otp_service = GatewayService()

router= APIRouter(
    dependencies=[require_role(1)],
    tags=["Gateways"]
)

@router.post("/otp/send")
async def send_otp(
        user_id:str,
        phone_number:str
    ):
    return await otp_service._store_otp(user_id, phone_number)

@router.post("/otp/verify")
async def verify_otp(
        user_id:str,
        input_otp:str
    ):
    return otp_service._verify_otp(user_id, input_otp)