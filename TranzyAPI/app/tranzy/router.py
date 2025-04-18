from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.scooter.schemas import CoordinateSchema
from app.tranzy.service import TranzyService
from app.auth.jwt.jwt_bearer import jwtBearer

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


@tranzy_router.get("/routes/route-between-two-points")
def get_routes_between_two_points(stop_id_A: int, stop_id_B: int, db: db_dependency):
    return tranzy_service.get_routes_between_two_stations(stop_id_A, stop_id_B, db)


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


# -------------------------------- Favorite Routes
@tranzy_router.get("/favorite-routes")
def get_favorite_routes(token: Annotated[str, Depends(jwtBearer())], db: db_dependency):
    return tranzy_service.get_favorite_routes(token, db)


@tranzy_router.post("/favorite-routes")
def add_favorite_route(route_id: int, token: Annotated[str, Depends(jwtBearer())],
                       db: db_dependency):
    return tranzy_service.add_favorite_route(route_id, token, db)

@tranzy_router.delete("/favorite-routes/{route_id}")
def delete_favorite_route(route_id: int, token: Annotated[str, Depends(jwtBearer())],
                           db: db_dependency):
    return tranzy_service.delete_favorite_route(route_id, token, db)


# ------------------------------- General
@tranzy_router.post("/route_between_two_points")
def get_route(coordinates: CoordinateSchema):
    return tranzy_service.get_route_between_locations(coordinates)

@tranzy_router.get("/user-data")
def get_user_data(token: Annotated[str, Depends(jwtBearer())], db: db_dependency):
    return tranzy_service.get_user_data(token, db)
