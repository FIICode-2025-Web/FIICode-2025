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


@feedback_router.post("/", status_code=201)
def add_feedback(feedback_entry: FeedbackSchema, db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    return feedback_service.add_feedback(feedback_entry, db, token)

@feedback_router.get("/")
def get_reports_by_user(db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    return feedback_service.get_feedbacks_by_user(db, token)
