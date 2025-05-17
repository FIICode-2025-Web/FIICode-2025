from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.gamification.service import GamificationService
from typing import Annotated
from app.auth.jwt.jwt_bearer import jwtBearer
from app.database import get_db

gamification_router = APIRouter(prefix="/api/v1/gamification", tags=["gamification"])
gamification_service = GamificationService()

db_dependency = Annotated[Session, Depends(get_db)]


@gamification_router.post("/")
def add_badges(user_id: int, badge_id: int, db: db_dependency):
    return gamification_service.award_badge(user_id, badge_id, db)


@gamification_router.get("/")
def get_badges_by_user(token: Annotated[str, Depends(jwtBearer())], db: db_dependency):
    return gamification_service.get_badges_by_user(token, db)


@gamification_router.get("/inactive")
def get_inactive_badges_by_user(token: Annotated[str, Depends(jwtBearer())], db: db_dependency):
    return gamification_service.get_inactive_badges_by_user(token, db)


@gamification_router.get("/leaderboard")
def get_leaderboard(db: db_dependency):
    return gamification_service.get_leaderboard(db)
