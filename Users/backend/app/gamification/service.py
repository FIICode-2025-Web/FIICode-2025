from app.gamification.models import UserBadges, Badges
from app.auth.models import Users
from sqlalchemy.orm import Session
from app.auth.exceptions import UserNotFoundException, BadgeNotFoundException, BadgeAlreadyAwardedException


class GamificationService:
    def award_badge(self, user_id: int, badge_id, db: Session):
        user_exists = db.query(Users).filter_by(id=user_id).first()
        if not user_exists:
            raise UserNotFoundException()

        badge_exists = db.query(Badges).filter_by(id=badge_id).first()
        if not badge_exists:
            raise BadgeNotFoundException()
        existing_badge = db.query(UserBadges).filter_by(user_id=user_id, badge_id=badge_id).first()
        if existing_badge:
            raise BadgeAlreadyAwardedException()
        new_badge = UserBadges(user_id=user_id, badge_id=badge_id)
        db.add(new_badge)
        db.commit()
        db.refresh(new_badge)

        return {"message": "Badge awarded successfully", "badge": new_badge}
