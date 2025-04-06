from typing import Annotated
import httpx
from fastapi import Depends, APIRouter
from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.jwt.jwt_handler import decodeJWT

notification_router = APIRouter(prefix="/api/v1/notification", tags=["notification"])


@notification_router.post("/")
async def send_notification(
        message: str,
        token: Annotated[str, Depends(jwtBearer())]
):
    user = decodeJWT(token)["email"]
    async with httpx.AsyncClient() as client:
        await client.post(
            f"http://127.0.0.1:8004/api/v1/notification/send-notification?message={message}&user={user}",
        )
    return {"status": "sent"}
