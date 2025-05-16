from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from models.database import engine
from models import Base
from routes import gateway, auth, admin, user, jobs, workers, favourites, notifications, conversations

app = FastAPI()

# create all tables in DB on startup
Base.metadata.create_all(bind=engine)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gateway.router, prefix="/api")
app.include_router(auth.router, prefix="/auth")
app.include_router(admin.router, prefix="/admin")
app.include_router(user.router, prefix="/user")
app.include_router(jobs.router, prefix="/api")
app.include_router(workers.router, prefix="/api")
app.include_router(favourites.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(conversations.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Job Finder app is running!"}

if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    #uvicorn.run("main:app", host="0.0.0.0", port=8000)

