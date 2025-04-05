from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import TypeVar
from app.tranzy_client.models import TranzyShapes, TranzyRoutes, TranzyTrips
import requests
from decouple import config

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

T = TypeVar('T')
TRANZY_KEY = config("tranzy_key")


class TranzyService:

    # ------------------------------- Vehicles
    def get_tranzy_vehicles(self):
        response = requests.get("https://api.tranzy.ai/v1/opendata/vehicles",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        return response.json()

    def get_tranzy_vehicles_by_route_id(self, route_id: str):
        response = requests.get("https://api.tranzy.ai/v1/opendata/vehicles",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        vehicles = []
        for vehicle in response.json():
            if str(vehicle["route_id"]) == route_id:
                vehicles.append(vehicle)

        return vehicles

    # ------------------------------- Shapes
    def get_shapes_by_shape_id(self, shape_id: str, db: Session):
        return db.query(TranzyShapes).filter(TranzyShapes.shape_id == shape_id).all()

    def get_shape_for_route_id(self, route_id: str, db: Session):
        trips = db.query(TranzyTrips).filter(TranzyTrips.route_id == route_id).all()
        shapes = {}
        for index, trip in enumerate(trips):
            shapes[index] = db.query(TranzyShapes).filter(TranzyShapes.shape_id == trip.shape_id).all()

        return shapes

    def get_shape_for_route_short_name(self, route_short_name: str, db: Session):
        route = db.query(TranzyRoutes).filter(TranzyRoutes.route_short_name == route_short_name).first()
        trips = db.query(TranzyTrips).filter(TranzyTrips.route_id == route.route_id).all()
        shapes = {}
        for index, trip in enumerate(trips):
            shapes[index] = db.query(TranzyShapes).filter(TranzyShapes.shape_id == trip.shape_id).all()

        return shapes

    # ------------------------------- Routes
    def get_routes(self, db: Session):
        return db.query(TranzyRoutes).all()

    def disable_route(self, route_id: str, db: Session):
        route = db.query(TranzyRoutes).filter(TranzyRoutes.route_id == route_id).first()
        route.disabled = not route.disabled
        db.commit()
        return route

    # ------------------------------- Generic
    def save_entity(self, entity: [T], db: Session):
        db.add(entity)
        db.commit()
        return entity

    def delete_all(self, entity: [T], db: Session):
        db.query(entity).delete()
        db.commit()
        return entity
