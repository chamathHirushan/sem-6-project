from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        from Lab_RAG_Azure_AI_Search.agent import run_agent
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Chat service is unavailable (Azure SDK not installed).",
        )
    try:
        response = run_agent(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Chat service is unavailable: {e}",
        )
