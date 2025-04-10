from app.gamification.models import Badges
from sqlalchemy.orm import Session
from sqlalchemy import text


class GamificationService:
    default_badges = [
        {
            "name": "Ecofriendly",
            "identification_name": "ecofriendly",
            "type": "scooter",
            "condition_type": "km_total",
            "condition_value": 50
        },
        {
            "name": "Scooter Lover",
            "identification_name": "scooter_lover",
            "type": "scooter",
            "condition_type": "rides_count",
            "condition_value": 30
        },
        {
            "name": "Ridesharing Addict",
            "identification_name": "ridesharing_addict",
            "type": "ride_sharing",
            "condition_type": "km_total",
            "condition_value": 100
        },
        {
            "name": "Public Transport Fan",
            "identification_name": "public_transport_fan",
            "type": "public_transport",
            "condition_type": "rides_count",
            "condition_value": 20
        },
        {
            "name": "All-Round Traveler",
            "identification_name": "all_round_traveler",
            "type": "general",
            "condition_type": "badges_count",
            "condition_value": 4
        },
        {
            "name": "Early Bird",
            "identification_name": "early_bird",
            "type": "general",
            "condition_type": "morning_rides",
            "condition_value": 5
        },
        {
            "name": "Night Rider",
            "identification_name": "night_rider",
            "type": "general",
            "condition_type": "night_rides",
            "condition_value": 5
        },
    {
        "name": "Streak Master",
        "identification_name": "streak_master",
        "type": "general",
        "condition_type": "daily_streak",
        "condition_value": 7
    }

    ]

    def add_badges(self, db: Session):
        db.query(Badges).delete()
        db.commit()

        db.execute(text("ALTER SEQUENCE badges_id_seq RESTART WITH 1"))

        for badge_data in self.default_badges:
            badge = Badges(**badge_data)
            db.add(badge)

        db.commit()
        return {"message": "Badges added successfully"}
