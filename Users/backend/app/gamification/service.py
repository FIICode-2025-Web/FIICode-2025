from app.gamification.models import UserBadges, Badges
from app.auth.models import Users
from sqlalchemy.orm import Session
from app.auth.exceptions import UserNotFoundException, BadgeNotFoundException, BadgeAlreadyAwardedException
from app.auth.jwt.jwt_bearer import decodeJWT
from app.gamification.schemas import GetBadgeSchema, BadgeSchema


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

    def get_badges_by_user(self, token, db: Session):
        user_id = decodeJWT(token)["id"]
        badges = db.query(UserBadges).filter(UserBadges.user_id == user_id).all()
        badges_list = []
        for badge in badges:
            badge_info = db.query(Badges).filter(Badges.id == badge.badge_id).first()
            badge_schema = GetBadgeSchema(
                user_id=user_id,
                badge_info=BadgeSchema(
                    id=badge_info.id,
                    name=badge_info.name,
                    identification_name=badge_info.identification_name,
                    type=badge_info.type,
                    condition_type=badge_info.condition_type,
                    condition_value=badge_info.condition_value,
                ),
            )
            badges_list.append(badge_schema)
        return badges_list
