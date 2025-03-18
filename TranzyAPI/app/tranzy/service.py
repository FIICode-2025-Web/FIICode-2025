from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import TypeVar
from app.tranzy.models import TranzyShapes, TranzyRoutes, TranzyTrips, TranzyStops, TranzyStopTimes
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
        vehicles = []
        for vehicle in response.json():
            vehicle = self.process_vehicle(vehicle)
            vehicles.append(vehicle)

        return vehicles

    def get_tranzy_vehicles_by_route_id(self, route_id: str):
        response = requests.get("https://api.tranzy.ai/v1/opendata/vehicles",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        vehicles = []
        for vehicle in response.json():
            if str(vehicle["route_id"]) == route_id:
                vehicle = self.process_vehicle(vehicle)
                vehicles.append(vehicle)

        return vehicles

    def get_tranzy_vehicles_by_route_short_name(self, route_short_name: str, direction_id: int, db: Session):
        response = requests.get("https://api.tranzy.ai/v1/opendata/vehicles",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        route = db.query(TranzyRoutes).filter(TranzyRoutes.route_short_name == route_short_name).first()
        trip = db.query(TranzyTrips).filter(
            TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == direction_id).first()
        if not trip:
            if direction_id == 0:
                trip = db.query(TranzyTrips).filter(
                    TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == 1).first()
            else:
                trip = db.query(TranzyTrips).filter(
                    TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == 0).first()
        vehicles = []
        for vehicle in response.json():
            if vehicle["route_id"] == route.route_id and "trip_id" in vehicle and vehicle["trip_id"] is not None:
                vehicle = self.process_vehicle(vehicle)
                if vehicle["trip_id"] == str(trip.trip_id):
                    vehicles.append(vehicle)

        return vehicles

    def process_vehicle(self, vehicle):
        processed_trip_id = "".join(vehicle["trip_id"].split("_"))
        vehicle["trip_id"] = processed_trip_id
        return vehicle

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
        if not route:
            return {}
        trips = db.query(TranzyTrips).filter(TranzyTrips.route_id == route.route_id).all()
        if not trips:
            return {}
        shapes = {}
        for index, trip in enumerate(trips):
            shapes[index] = db.query(TranzyShapes).filter(TranzyShapes.shape_id == trip.shape_id).all()

        return shapes

    # ------------------------------- Stops
    def get_stops(self, db):
        return db.query(TranzyStops).all()

    def get_stops_by_route_id(self, route_id: str, direction_id: int, db: Session):
        route = db.query(TranzyRoutes).filter(TranzyRoutes.route_id == route_id).first()
        trip = db.query(TranzyTrips).filter(
            TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == direction_id).first()

        stop_times = db.query(TranzyStopTimes).filter(TranzyStopTimes.trip_id == trip.trip_id).all()
        stops = []
        for stop_time in stop_times:
            stops.append(db.query(TranzyStops).filter(TranzyStops.stop_id == stop_time.stop_id).first())
        return stops

    def get_stop_by_route_short_name(self, route_short_name: str, direction_id: int, db: Session):
        route = db.query(TranzyRoutes).filter(TranzyRoutes.route_short_name == route_short_name).first()
        trip = db.query(TranzyTrips).filter(
            TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == direction_id).first()
        if not trip:
            if direction_id == 0:
                trip = db.query(TranzyTrips).filter(
                    TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == 1).first()
            else:
                trip = db.query(TranzyTrips).filter(
                    TranzyTrips.route_id == route.route_id, TranzyTrips.direction_id == 0).first()
        stop_times = db.query(TranzyStopTimes).filter(TranzyStopTimes.trip_id == trip.trip_id).all()
        stops = []
        for stop_time in stop_times:
            stops.append(db.query(TranzyStops).filter(TranzyStops.stop_id == stop_time.stop_id).first())
        return stops

    # ------------------------------- Stop Times

    # ------------------------------- Trips
    def get_trips(self, db):
        return db.query(TranzyTrips).all()

    # ------------------------------- Routes
    def get_routes(self, db: Session):
        return db.query(TranzyRoutes).all()

    # ------------------------------- Generic
    def save_entity(self, entity: [T], db: Session):
        db.add(entity)
        db.commit()
        return entity

    def delete_all(self, entity: [T], db: Session):
        db.query(entity).delete()
        db.commit()
        return entity
