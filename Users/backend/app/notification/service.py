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
        users = db.query(Users).filter(Users.id != user).all()
        for user in users:
            notification = Notification(
                user_id=user.id,
                message=message,
                datePosted=datetime.datetime.now(),
                is_read=False,
            )
            db.add(notification)
            db.commit()
            db.refresh(notification)

        return []

    def add_notification_to_user(self, message, user_id: str, db: Session):
        notification = Notification(
            user_id=int(user_id),
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
        user = payload["id"]
        return db.query(Notification).filter(Notification.user_id == user).all()

    def mark_notification_as_read(self, notification_id: int, token: str, db: Session):
        payload = decodeJWT(token)
        user = payload["id"]
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if notification and notification.user_id == user:
            notification.is_read = True
            db.commit()
            db.refresh(notification)
            return notification

        return None
