from typing import Annotated

import httpx
from fastapi import Depends, APIRouter

notification_router = APIRouter(prefix="/api/v1/notification", tags=["notification"])


@notification_router.post("/")
async def send_notification(message: str):
    async with httpx.AsyncClient() as client:
        await client.post("http://127.0.0.1:8004/api/v1/auth/send-notification?message=" + message)
    return {"status": "sent"}