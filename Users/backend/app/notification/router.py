from fastapi import WebSocket, WebSocketDisconnect, Depends, APIRouter
from sqlalchemy.orm import Session
import asyncio
from app.database import get_db
from typing import Annotated
from app.auth.jwt.jwt_bearer import jwtBearer

from app.notification.service import NotificationService

notification_router = APIRouter(prefix="/api/v1/notification", tags=["notification"])
db_dependency = Annotated[Session, Depends(get_db)]

connections = []

notification_service = NotificationService()


@notification_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        connections.remove(websocket)


@notification_router.post("/send-notification")
async def send_notification(db: db_dependency, type: str, message: str, user: str):
    disconnected = []
    if type == 'route_problem' or type == 'route_fixed':
        notification_service.add_notification_to_all_users(message, user, type, db)
    if type == 'badge':
        notification_service.add_notification_to_user(message, user, type, db)
    if type == 'noise':
        notification_service.add_notification_to_user(message, user, type, db)

    payload = {
        "type": type,
        "message": message,
        "user": user
    }

    for conn in connections:
        try:
            await conn.send_json(payload)
        except:
            disconnected.append(conn)

    for d in disconnected:
        if d in connections:
            connections.remove(d)
    return {"status": "sent"}


@notification_router.get("/")
def get_notifications(db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    notifications = notification_service.get_notifications_by_user(db, token)
    return notifications


@notification_router.patch("/mark-as-read/{notification_id}")
def mark_notification_as_read(notification_id: int, db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    notification = notification_service.mark_notification_as_read(notification_id, token, db)
    if notification:
        return {"status": "success", "notification": notification}
    return {"status": "error", "message": "Notification not found"}
