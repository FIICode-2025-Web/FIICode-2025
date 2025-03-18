from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.tranzy_client.client import TranzyClient

tranzy_client_router = APIRouter(prefix="/api/v1/tranzy_client", tags=["tranzy_client"])

db_dependency = Annotated[Session, Depends(get_db)]

tranzy_client = TranzyClient()


@tranzy_client_router.get("/vehicles")
def get_vehicles(db: db_dependency):
    return tranzy_client.get_tranzy_vehicles()


@tranzy_client_router.get("/routes")
def get_routes(db: db_dependency):
    return tranzy_client.get_tranzy_routes(db)


@tranzy_client_router.get("/stops")
def get_stops(db: db_dependency):
    return tranzy_client.get_tranzy_stops(db)


@tranzy_client_router.get("/stop_times")
def get_stop_times(db: db_dependency):
    return tranzy_client.get_tranzy_stop_times(db)


@tranzy_client_router.get("/trips")
def get_trips(db: db_dependency):
    return tranzy_client.get_tranzy_trips(db)


@tranzy_client_router.get("/shapes")
def get_shapes(db: db_dependency):
    return tranzy_client.get_tranzy_shapes(db)
