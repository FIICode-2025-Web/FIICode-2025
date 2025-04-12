from app.feedback.models import Feedback


class FeedbackService:
    def get_feedbacks(self, db):
        return db.query(Feedback).all()

    def review_feedback(self, feedback_id: int, db):
        feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not feedback:
            return None
        feedback.isReviewed = True
        db.commit()
        db.refresh(feedback)
        return feedback
