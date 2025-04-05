from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt.jwt_bearer import jwtBearer
from app.feedback.schemas import FeedbackSchema
from app.feedback.service import FeedbackService

feedback_router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])

db_dependency = Annotated[Session, Depends(get_db)]

feedback_service = FeedbackService()


@feedback_router.get("/")
def get_reports(db: db_dependency):
    return feedback_service.get_feedbacks(db)
