from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models.database import SessionLocal
from models.working import WorkingCategory
from pydantic import BaseModel

router = APIRouter(
    prefix="/working",
    tags=["Working"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class CategoryBase(BaseModel):
    category_name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        orm_mode = True

# Initialize default categories
default_categories = [
    "ACCOUNTING_AND_FINANCE",
    "ADMINISTRATIVE_AND_OFFICE",
    "ADVERTISING_AND_MARKETING",
    "COMPUTER_AND_IT",
    "CONSTRUCTION",
    "CUSTOMER_SERVICE",
    "EDUCATION",
    "HEALTHCARE",
    "LEGAL",
    "MANAGEMENT",
    "PERSONAL_CARE_AND_SERVICES",
    "REAL_ESTATE",
    "RESTAURANT_AND_HOSPITALITY",
    "SALES_AND_RETAIL",
    "TRANSPORTATION_AND_LOGISTICS"
]

@router.post("/categories/init", response_model=List[CategoryResponse])
def initialize_categories(db: Session = Depends(get_db)):
    """Initialize default working categories"""
    existing_categories = db.query(WorkingCategory).all()
    if existing_categories:
        return existing_categories
    
    categories = []
    for category_name in default_categories:
        db_category = WorkingCategory(category_name=category_name)
        db.add(db_category)
        categories.append(db_category)
    
    try:
        db.commit()
        for category in categories:
            db.refresh(category)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    return categories

@router.get("/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Get all working categories"""
    return db.query(WorkingCategory).all()

@router.post("/categories/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Create a new working category"""
    db_category = WorkingCategory(**category.dict())
    db.add(db_category)
    try:
        db.commit()
        db.refresh(db_category)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_category 