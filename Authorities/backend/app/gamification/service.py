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
            "condition_value": 50,
            "description": "Ai parcurs peste {value} km cu trotineta electrică.",
            "value": 10
        },
        {
            "name": "Scooter Lover",
            "identification_name": "scooter_lover",
            "type": "scooter",
            "condition_type": "rides_count",
            "condition_value": 30,
            "description": "Ai realizat peste {value} curse cu trotineta electrică.",
            "value": 15
        },
        {
            "name": "Ridesharing Addict",
            "identification_name": "ridesharing_addict",
            "type": "ride_sharing",
            "condition_type": "km_total",
            "condition_value": 100,
            "description": "Ai parcurs peste {value} km cu mașini de ridesharing.",
            "value": 12
        },
        {
            "name": "Public Transport Fan",
            "identification_name": "public_transport_fan",
            "type": "public_transport",
            "condition_type": "rides_count",
            "condition_value": 20,
            "description": "Ai efectuat peste {value} curse în cadrul transportului public.",
            "value": 12
        },
        {
            "name": "All-Round Traveler",
            "identification_name": "all_round_traveler",
            "type": "general",
            "condition_type": "badges_count",
            "condition_value": 4,
            "description": "Ai obținut cel puțin {value} alte badge-uri diferite.",
            "value": 12
        },
        {
            "name": "Early Bird",
            "identification_name": "early_bird",
            "type": "general",
            "condition_type": "morning_rides",
            "condition_value": 5,
            "description": "Ai avut cel puțin {value} curse dimineața (06:00 - 11:59).",
            "value": 12
        },
        {
            "name": "Night Rider",
            "identification_name": "night_rider",
            "type": "general",
            "condition_type": "night_rides",
            "condition_value": 5,
            "description": "Ai avut cel puțin {value} curse seara (20:00 - 23:59).",
            "value": 12
        },
        {
            "name": "Streak Master",
            "identification_name": "streak_master",
            "type": "general",
            "condition_type": "daily_streak",
            "condition_value": 7,
            "description": "Ai avut un streak de {value} zile consecutive cu cel puțin o călătorie.",
            "value": 12
        },
        {
            "name": "Low Emission Champion",
            "identification_name": "low_emission",
            "type": "general",
            "condition_type": "pollution",
            "condition_value": 10,
            "description": "Ai realizat peste {value} curse în zone cu un nivel scăzut de poluare.",
            "value": 12
        },
        {
            "name": "Noise Cartographer",
            "identification_name": "noise",
            "type": "general",
            "condition_type": "noise",
            "condition_value": 10,
            "description": "Ai ajutat la identificarea nivelului de zgomot în peste {value} zone",
            "value": 12
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
