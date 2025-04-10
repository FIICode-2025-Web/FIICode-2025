from app.feedback.models import Feedback


class FeedbackService:
    def get_feedbacks(self, db):
        return db.query(Feedback).all()
