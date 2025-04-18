from fastapi import APIRouter
from services.gateway_service import GatewayService
from utilities.validate_permissins import require_role
from fastapi import Request

otp_service = GatewayService()

router= APIRouter(
    dependencies=[require_role(0)],
    tags=["Gateways"]
)

@router.post("/otp/send")
async def send_otp(
        phone_number:str,
        request: Request
    ):
    email = request.state.email
    return await otp_service._store_otp(email, phone_number)

@router.post("/otp/verify")
async def verify_otp(
        input_otp:str,
        phone_number : str,
        request: Request
    ):
    email = request.state.email
    return otp_service._verify_otp(email, input_otp, phone_number)