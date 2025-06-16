from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from models.user import User
from typing import Optional, List
from datetime import datetime

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: dict) -> User:
        """
        Create a new user in the database
        """
        try:
            db_user = User(
                name=user_data.get('name'),
                email=user_data.get('email'),
                phone_number=user_data.get('phone_number'),
                town=user_data.get('town'),
                permission_level=user_data.get('permission_level', 1),
                pro_pic=user_data.get('pro_pic'),
                last_active_time=datetime.utcnow()  # Set last_active_time
            )
            
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_user(self, user_id: int) -> Optional[User]:
        """
        Fetch user data from the database by ID
        """
        try:
            return self.db.query(User).filter(User.id == user_id).first()
        except SQLAlchemyError as e:
            raise e

    def get_user_by_email(self, user_email: str) -> Optional[User]:
        """
        Fetch user data from the database by email
        """
        try:
            return self.db.query(User).filter(User.email == user_email).first()
        except SQLAlchemyError as e:
            raise e

    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Fetch all users with pagination
        """
        try:
            return self.db.query(User).offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            raise e

    def update_user(self, user_id: int, user_data: dict) -> Optional[User]:
        """
        Update user data in the database
        """
        try:
            db_user = self.get_user(user_id)
            if not db_user:
                return None
            
            for key, value in user_data.items():
                if hasattr(db_user, key) and key != 'id':  # Don't allow ID updates
                    setattr(db_user, key, value)
            
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def update_user_permission_level(self, user_id: int, permission_level: int) -> Optional[User]:
        """
        Update user permission level
        """
        try:
            db_user = self.get_user(user_id)
            if not db_user:
                return None
            
            db_user.permission_level = permission_level
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete_user(self, user_id: int) -> bool:
        """
        Delete user from the database
        """
        try:
            db_user = self.get_user(user_id)
            if not db_user:
                return False
            
            self.db.delete(db_user)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def search_users(self, search_term: str, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Search users by name or email
        """
        try:
            return self.db.query(User).filter(
                (User.name.ilike(f"%{search_term}%")) | 
                (User.email.ilike(f"%{search_term}%"))
            ).offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            raise e

    def get_users_by_permission_level(self, permission_level: int, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Get users by permission level
        """
        try:
            return self.db.query(User).filter(
                User.permission_level == permission_level
            ).offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            raise e

    def count_users(self) -> int:
        """
        Count total number of users
        """
        try:
            return self.db.query(User).count()
        except SQLAlchemyError as e:
            raise e

    def count_users_by_permission_level(self, permission_level: int) -> int:
        """
        Count users by permission level
        """
        try:
            return self.db.query(User).filter(
                User.permission_level == permission_level
            ).count()
        except SQLAlchemyError as e:
            raise e