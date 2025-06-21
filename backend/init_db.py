from models.database import Base, engine
from models.user import User, UserLevel, UserLevelEnum
from models.worker import WorkerProfile, WorkerPost, WorkerReview
from models.job import Job, JobPost, JobPostComment, JobApplication, Working
from models.communication import Notification, Conversation, Message, Reply
from models.favourite import Favourite
from models.working import WorkingCategory, Image

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database tables created successfully!") 