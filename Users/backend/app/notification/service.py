from app.notification.models import Notification
from app.auth.models import Users
from sqlalchemy.orm import Session
from app.auth.jwt.jwt_handler import decodeJWT
import datetime


class NotificationService:
    def add_notification(self, notification, db):
        notification = Notification(**notification)
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    def add_notification_to_all_users(self, message, user: str, db: Session):
        users = db.query(Users).filter(Users.email != user).all()
        for user in users:
            notification = Notification(
                user=user.email,
                message=message,
                datePosted=datetime.datetime.now(),
                is_read=False,
            )
            db.add(notification)
            db.commit()
            db.refresh(notification)

        return []

    def get_notifications_by_user(self, db, token: str):
        payload = decodeJWT(token)
        user = payload["email"]
        return db.query(Notification).filter(Notification.user == user).all()

    def mark_notification_as_read(self, notification_id: int, token: str, db: Session):
        payload = decodeJWT(token)
        user = payload["email"]
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if notification and notification.user == user:
            notification.is_read = True
            db.commit()
            db.refresh(notification)
            return notification

        return None
