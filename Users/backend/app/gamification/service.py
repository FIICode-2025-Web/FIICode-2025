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
                    description=badge_info.description
                    .replace("{value}", str(badge_info.condition_value))
                ),
            )
            badges_list.append(badge_schema)
        return badges_list

    def get_inactive_badges_by_user(self, token, db: Session):
        user_id = decodeJWT(token)["id"]
        earned_badge_ids = {ub.badge_id for ub in db.query(UserBadges).filter(UserBadges.user_id == user_id).all()}
        all_badges = db.query(Badges).all()
        inactive_badges = []
        for badge in all_badges:
            if badge.id not in earned_badge_ids:
                badge_schema = GetBadgeSchema(
                    user_id=user_id,
                    badge_info=BadgeSchema(
                        id=badge.id,
                        name=badge.name,
                        identification_name=badge.identification_name,
                        type=badge.type,
                        condition_type=badge.condition_type,
                        condition_value=badge.condition_value,
                        description=self.generate_inactive_description(badge)
                    ),
                )
                inactive_badges.append(badge_schema)
        return inactive_badges

    def generate_inactive_description(self, badge: Badges):
        if badge.condition_type == "km_total":
            return f"Parcurge {badge.condition_value} km cu {self.translate_type(badge.type)}."
        elif badge.condition_type == "rides_count":
            return f"Parcurge {badge.condition_value} curse cu {self.translate_type(badge.type)}."
        elif badge.condition_type == "badges_count":
            return f"Obtine {badge.condition_value} badge-uri."
        elif badge.condition_type == "morning_rides":
            return f"Realizează {badge.condition_value} curse dimineața (06:00 - 11:59)."
        elif badge.condition_type == "night_rides":
            return f"Realizează {badge.condition_value} curse noaptea (20:00 - 23:59)."
        elif badge.condition_type == "daily_streak":
            return f"Folosește una din modalitățile de transport în cel puțin {badge.condition_value} zile consecutive."
        elif badge.condition_type == "pollution":
            return f"Realizează {badge.condition_value} curse în zone cu un nivel scăzut de poluare."
        elif badge.condition_type == "noise":
            return f"Ajută la identificarea nivelului de zgomot în cel puțin {badge.condition_value} zone."
        else:
            return "Progres necunoscut."

    def translate_type(self, t):
        return {
            "scooter": "trotineta electrică",
            "ride_sharing": "ridesharing",
            "public_transport": "transport public"
        }.get(t, t)
