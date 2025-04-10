from app.ride_history.models import RideHistory
from app.ride_history.schemas import HistorySchema
from app.auth.jwt.jwt_bearer import decodeJWT
from app.gamification.service import GamificationService
from app.auth.models import Users

gamificationService = GamificationService()


class HistoryService:
    def get_ride_history(self, db):
        return db.query(RideHistory).all()

    def save_ride_history(self, history: HistorySchema, db, token: str):
        payload = decodeJWT(token)
        user_id = payload["id"]

        ride_history = RideHistory(
            type=history.type,
            user_id=user_id,
            km_travelled=history.km_travelled,
            duration=history.duration,
            cost=history.cost,
            start_time=history.start_time,
            end_time=history.end_time
        )
        db.add(ride_history)
        db.commit()
        db.refresh(ride_history)
        gamificationService.evaluate_user_badges(user_id, db)
        return ride_history

    def get_ride_history_by_user(self, db, token: str):
        payload = decodeJWT(token)
        user_id = payload["email"]
        return db.query(RideHistory).filter(RideHistory.user_id == user_id).all()
