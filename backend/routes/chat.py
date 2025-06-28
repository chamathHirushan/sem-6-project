from fastapi import APIRouter, Request
from pydantic import BaseModel
from Lab_RAG_Azure_AI_Search.agent import run_agent
# from ...Lab_RAG_Azure_AI_Search.agent import run_agent
router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # Call your agent logic here, passing request.message
    # For now, just return a dummy response
    response = run_agent(request.message)  # You need to implement this
    return {"response": response}