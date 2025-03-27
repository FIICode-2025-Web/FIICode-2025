from typing import Annotated

from fastapi import Depends, APIRouter, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.ridesharing.schemas import CarRequest
from app.ridesharing.service import RideSharingService
from app.scooter.service import ScooterService
from app.scooter.schemas import CoordinateSchema

ridesharing_router = APIRouter(prefix="/api/v1/ridesharing", tags=["ridesharing"])

db_dependency = Annotated[Session, Depends(get_db)]

ridesharing_service = RideSharingService()


@ridesharing_router.get("/")
def get_cars(db: db_dependency):
    return ridesharing_service.get_cars(db)


@ridesharing_router.post("/car")
def get_closest_car(db: db_dependency, car_request: CarRequest = Body(default=None)):
    return ridesharing_service.get_closest_car(db, car_request)
