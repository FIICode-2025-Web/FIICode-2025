from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.air_pollution.service import AirPollutionService

air_router = APIRouter(prefix="/api/v1/air_pollution", tags=["air_pollution"])

db_dependency = Annotated[Session, Depends(get_db)]

air_pollution_service = AirPollutionService()


# ------------------------------- Vehicles
@air_router.get("/")
def get_pollution_levels():
    return air_pollution_service.get_air_pollution_levels()
