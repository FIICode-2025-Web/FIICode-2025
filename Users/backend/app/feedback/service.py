from datetime import datetime

from app.auth.jwt.jwt_handler import decodeJWT
from app.feedback.models import Feedback
from app.feedback.schemas import FeedbackSchema


class FeedbackService:
    def add_feedback(self, feedback_entry: FeedbackSchema, db, token: str):
        payload = decodeJWT(token)
        user_id = payload["id"]
        feedback = Feedback(
            user_id=user_id,
            title=feedback_entry.title,
            message=feedback_entry.message,
            isReviewed=False,
            datePosted=datetime.now(),
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback

    def get_feedbacks_by_user(self, db, token: str):
        payload = decodeJWT(token)
        user_id = payload["id"]
        return db.query(Feedback).filter(Feedback.user_id == user_id).all()
