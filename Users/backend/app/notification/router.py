from fastapi import WebSocket, WebSocketDisconnect, APIRouter
import asyncio

notification_router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

connections = []


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
async def send_notification(message: str):
    disconnected = []
    for conn in connections:
        try:
            await conn.send_text(message)
        except:
            disconnected.append(conn)

    for d in disconnected:
        if d in connections:
            connections.remove(d)
    return {"status": "sent"}
