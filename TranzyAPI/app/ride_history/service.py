from datetime import datetime, timedelta

from sqlalchemy import func

from app.auth.jwt.jwt_bearer import decodeJWT
from app.gamification.service import GamificationService
from app.ride_history.models import RideHistory
from app.ride_history.schemas import HistorySchema
from app.tranzy.models import TranzyRoutes

gamificationService = GamificationService()


class HistoryService:
    def get_ride_history(self, db):
        return db.query(RideHistory).all()

    def save_ride_history(self, history: HistorySchema, db, token: str):
        payload = decodeJWT(token)
        user_id = payload["id"]

        ride_history = RideHistory(
            type=history.type,
            ride_id=history.ride_id,
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
        user_id = payload["id"]
        return db.query(RideHistory).filter(RideHistory.user_id == user_id).all()

    def get_frequent_routes(self, token: str, db):
        payload = decodeJWT(token)
        user_id = payload["id"]

        one_month_ago = datetime.utcnow() - timedelta(days=30)

        results = (
            db.query(
                RideHistory.ride_id,
                func.count(RideHistory.id).label("count")
            )
            .filter(
                RideHistory.user_id == user_id,
                RideHistory.type == "public_transport",
                RideHistory.start_time >= one_month_ago
            )
            .group_by(RideHistory.ride_id)
            .order_by(func.count(RideHistory.id).desc())
            .limit(3)
            .all()
        )

        suggestions = []
        for ride_id, count in results:
            route = db.query(TranzyRoutes).filter(TranzyRoutes.route_id == ride_id).first()
            suggestions.append({
                "ride_id": ride_id,
                "times_used": count,
                "route_short_name": route.route_short_name,
                # "suggestion": f"Vrei să refaci traseul {route.route_short_name}? În ultimele 30 de zile ai folosit acest traseu de {count} ori.",
            })

        return suggestions
