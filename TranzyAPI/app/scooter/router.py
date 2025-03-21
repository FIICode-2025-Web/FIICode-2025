from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.scooter.service import ScooterService
from app.scooter.schemas import CoordinateSchema

scooter_router = APIRouter(prefix="/api/v1/scooter", tags=["scooter"])

db_dependency = Annotated[Session, Depends(get_db)]

scooter_service = ScooterService()


@scooter_router.get("/")
def get_scooters(db: db_dependency):
    return scooter_service.get_scooters(db)

@scooter_router.post("/route")
def get_route(coordinates: CoordinateSchema):
    return scooter_service.get_route_between_locations(coordinates)
