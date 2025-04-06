from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.gamification.service import GamificationService

from app.database import get_db

gamification_router = APIRouter(prefix="/api/v1/gamification", tags=["gamification"])
gamification_service = GamificationService()

db_dependency = Annotated[Session, Depends(get_db)]


@gamification_router.post("/")
def add_badges(db: db_dependency):
    return gamification_service.add_badges(db)
