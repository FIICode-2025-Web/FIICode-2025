from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.ride_history.schemas import HistorySchema, RideHistoryResponseSchema
from app.ride_history.service import HistoryService
from app.auth.jwt.jwt_bearer import jwtBearer

history = APIRouter(prefix="/api/v1/ride-history", tags=["history"])

db_dependency = Annotated[Session, Depends(get_db)]

history_service = HistoryService()


@history.post("/", response_model=RideHistoryResponseSchema)
def post_ride_history(ride_history: HistorySchema, db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    return history_service.save_ride_history(ride_history, db, token)

@history.get("/")
def get_ride_history_by_user(db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    return history_service.get_ride_history_by_user(db, token)
