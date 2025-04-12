from upstash_redis import Redis
from fastapi import HTTPException
import httpx
import os

TEXT_LK_API_TOKEN = os.getenv("TEXT_LK_API_TOKEN")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")

TEXT_LK_API_URL = "https://app.text.lk/api/v3/sms/send"
UPSTASH_REDIS_REST_URL="https://mutual-jaybird-63336.upstash.io"

RETRY_PERIOD = 3600  # 1 hour (3600 seconds)
MAX_VALIDATE_TRIES = 5
OTP_EXPIRY = 300      # OTP expiry time in seconds (5 minutes)
MAX_REQ_COUNT = 3  # Max OTP request count per period

redis = Redis(url=UPSTASH_REDIS_REST_URL, token=UPSTASH_TOKEN)

class GatewayService:
    async def __send_and_get_otp(self, phone_number):
        headers = {
            "Authorization": f"Bearer {TEXT_LK_API_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "recipient": phone_number,
            "sender_id": "TextLKDemo",
            "type": "otp",
            "message": "Your OTP for Sewa.lk is {{OTP}}.",
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(TEXT_LK_API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=response.json())
        response_json = response.json() 
        return response_json.get('data', {}).get('otp')

    async def _store_otp(self, user_id, phone_number):
        otp_req_count = f"otp_req_count:{user_id}"
        req_attempt = redis.get(otp_req_count)

        if req_attempt and int(req_attempt or 0) >= MAX_REQ_COUNT:
            raise HTTPException(status_code=400, detail="Too many OTPs generated!. Try again later.")
        
        otp = await self.__send_and_get_otp(phone_number)
        redis.set(f"otp:{user_id}", otp, ex=OTP_EXPIRY)
        redis.incr(otp_req_count)
        if req_attempt is None:
            redis.expire(otp_req_count, RETRY_PERIOD)
        return {
            "success": True,
            "message": "OTP sent successfully."}

    def _verify_otp(self, user_id, input_otp):
        otp_key = f"otp:{user_id}"
        real_otp = redis.get(otp_key)
        
        if real_otp is None:
            raise HTTPException(status_code=400, detail="OTP expired!. Try again.")
        
        otp_validate_count = f"otp_validate_count:{user_id}:{real_otp}"
        validate_attempt = redis.get(otp_validate_count)
        
        if validate_attempt and int(validate_attempt or 0) >= MAX_VALIDATE_TRIES:
            raise HTTPException(status_code=400, detail="Too many failed attemps for the OTP!. OTP is invalid now.")
        
        if real_otp == input_otp:
            redis.delete(otp_key)
            redis.delete(f"otp_req_count:{user_id}")
            redis.delete(otp_validate_count)
            return True
        
        redis.incr(otp_validate_count)
        if validate_attempt is None:
            redis.expire(otp_validate_count, OTP_EXPIRY)
        return False