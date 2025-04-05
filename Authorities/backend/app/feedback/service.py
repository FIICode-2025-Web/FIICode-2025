from datetime import datetime

from app.auth.jwt.jwt_handler import decodeJWT
from app.feedback.models import Feedback
from app.feedback.schemas import FeedbackSchema


class FeedbackService:
    def get_feedbacks(self, db):
        return db.query(Feedback).all()
