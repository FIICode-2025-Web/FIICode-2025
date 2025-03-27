from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.scooter.schemas import CoordinateSchema
from app.tranzy.service import TranzyService

tranzy_router = APIRouter(prefix="/api/v1/tranzy", tags=["tranzy"])

db_dependency = Annotated[Session, Depends(get_db)]

tranzy_service = TranzyService()


# ------------------------------- Vehicles
@tranzy_router.get("/vehicles")
def get_vehicles():
    return tranzy_service.get_tranzy_vehicles()


@tranzy_router.get("/vehicles/route/{route_id}")
def get_vehicles_by_route_id(route_id: str):
    return tranzy_service.get_tranzy_vehicles_by_route_id(route_id)


@tranzy_router.get("/vehicles/route/route-short-name/{route_short_name}/{direction_id}")
def get_vehicles_by_route_id(route_short_name: str, direction_id: int, db: db_dependency):
    return tranzy_service.get_tranzy_vehicles_by_route_short_name(route_short_name, direction_id, db)


# ------------------------------- Shapes
@tranzy_router.get("/shapes/{shape_id}")
def get_shape_by_id(shape_id: str, db: db_dependency):
    return tranzy_service.get_shapes_by_shape_id(shape_id, db)


@tranzy_router.get("/shapes/route/{route_short_name}")
def get_shapes_for_route_short_name(route_short_name: str, db: db_dependency):
    return tranzy_service.get_shape_for_route_short_name(route_short_name, db)


@tranzy_router.get("/shapes/route/{route_id}")
def get_shapes_for_route(route_id: str, db: db_dependency):
    return tranzy_service.get_shape_for_route_id(route_id, db)


# ------------------------------- Routes
@tranzy_router.get("/routes")
def get_routes(db: db_dependency):
    return tranzy_service.get_routes(db)


# ------------------------------- Stops
@tranzy_router.get("/stops")
def get_stops(db: db_dependency):
    return tranzy_service.get_stops(db)


# @tranzy_router.get("/stops/route/{route_id}")
# def get_stops_by_route_id(route_id: str, direction_id: int, db: db_dependency):
#     return tranzy_service.get_stops_by_route_id(route_id, direction_id, db)


@tranzy_router.get("/stops/route/stop-times/{route_short_name}/{direction_id}")
def get_stop_by_route_short_name(route_short_name: str, direction_id: int, db: db_dependency):
    return tranzy_service.get_stop_by_route_short_name(route_short_name, direction_id, db)


# ------------------------------- Stop Times


# ------------------------------- Trips
@tranzy_router.get("/trips")
def get_trips(db: db_dependency):
    return tranzy_service.get_trips(db)


# ------------------------------- General
@tranzy_router.post("/route_between_two_points")
def get_route(coordinates: CoordinateSchema):
    return tranzy_service.get_route_between_locations(coordinates)
