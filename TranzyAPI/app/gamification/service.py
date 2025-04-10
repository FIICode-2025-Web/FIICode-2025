from app.gamification.models import UserBadges, Badges
from app.auth.models import Users
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.auth.exceptions import UserNotFoundException, BadgeNotFoundException, BadgeAlreadyAwardedException
from app.gamification.models import Badges, UserBadges
from app.ride_history.models import RideHistory


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
        new_badge = UserBadges(user_id=user_id, badge_id=badge_id, earned_at=func.now())
        db.add(new_badge)
        db.commit()
        db.refresh(new_badge)

        return {"message": "Badge awarded successfully", "badge": new_badge}

    def evaluate_user_badges(self, user_id, db: Session):
        all_badges = db.query(Badges).all()
        user_badge_ids = {ub.badge_id for ub in db.query(UserBadges).filter(UserBadges.user_id == user_id).all()}

        for badge in all_badges:
            print("badge",badge)
            if badge.id in user_badge_ids:
                continue

            if badge.condition_type == "km_total":
                total_km = db.query(func.sum(RideHistory.km_travelled)) \
                               .filter(RideHistory.user_id == user_id, RideHistory.type == badge.type).scalar() or 0
                if total_km >= badge.condition_value:
                    self.award_badge(user_id, badge.id, db)

            elif badge.condition_type == "rides_count":

                ride_count = db.query(RideHistory).filter_by(
                    user_id=user_id,
                    type=badge.type
                ).count()

                if ride_count >= badge.condition_value:
                    self.award_badge(user_id, badge.id, db)


            elif badge.condition_type == "badges_count":

                if len(user_badge_ids) >= badge.condition_value:
                    self.award_badge(user_id, badge.id, db)
