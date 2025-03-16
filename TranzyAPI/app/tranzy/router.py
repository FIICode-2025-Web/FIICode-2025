from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.tranzy.service import TranzyService

tranzy_router = APIRouter(prefix="/api/v1/tranzy", tags=["tranzy"])

db_dependency = Annotated[Session, Depends(get_db)]

tranzy_service = TranzyService()


@tranzy_router.get("/vehicles")
def get_vehicles():
    return tranzy_service.get_tranzy_vehicles()

@tranzy_router.get("/vehicles/route/{route_id}")
def get_vehicles_by_route_id(route_id: str):
    return tranzy_service.get_tranzy_vehicles_by_route_id(route_id)

@tranzy_router.get("/shapes/{shape_id}")
def get_shape_by_id(shape_id: str, db: db_dependency):
    return tranzy_service.get_shapes_by_shape_id(shape_id, db)

@tranzy_router.get("/shapes/route/{route_short_name}")
def get_shapes_for_route_short_name(route_short_name: str, db: db_dependency):
    return tranzy_service.get_shape_for_route_short_name(route_short_name, db)


@tranzy_router.get("/routes")
def get_routes(db: db_dependency):
    return tranzy_service.get_routes(db)

@tranzy_router.get("/shapes/route/{route_id}")
def get_shapes_for_route(route_id: str, db: db_dependency):
    return tranzy_service.get_shape_for_route_id(route_id, db)

@tranzy_router.get("/stops")
def get_stops(db: db_dependency):
    return tranzy_service.get_stops(db)

@tranzy_router.get("/trips")
def get_trips(db: db_dependency):
    return tranzy_service.get_trips(db)

