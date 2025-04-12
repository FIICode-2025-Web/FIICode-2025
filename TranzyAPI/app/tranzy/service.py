from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import TypeVar

from app.scooter.schemas import CoordinateSchema
from app.tranzy.models import TranzyShapes, TranzyRoutes, TranzyTrips, TranzyStops, TranzyStopTimes
import requests
from decouple import config
import openrouteservice

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

T = TypeVar('T')
TRANZY_KEY = config("tranzy_key")

OPENROUTESERVICEKEY = config("open_route_service_key")


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

    def get_route_between_locations(self, coordinates: CoordinateSchema):
        client = openrouteservice.Client(key=OPENROUTESERVICEKEY)
        coords = [
            (coordinates.longitude_A, coordinates.latitude_A),
            (coordinates.longitude_B, coordinates.latitude_B)
        ]

        route = client.directions(
            coords,
            profile='foot-walking',
            format='geojson',
            instructions=False
        )
        geometry = route['features'][0]['geometry']['coordinates']
        distance_m = route['features'][0]['properties']['summary']['distance']

        return {
            "route": geometry,
            "distance_meters": distance_m
        }

    # ------------------------------- Stop Times

    # ------------------------------- Trips
    def get_trips(self, db):
        return db.query(TranzyTrips).all()

    # ------------------------------- Routes
    def get_routes(self, db: Session):
        return db.query(TranzyRoutes).all()

    def get_routes_between_two_stations(self, stop_id_A: int, stop_id_B: int, db: Session):
        stop_times_A = db.query(TranzyStopTimes).filter(TranzyStopTimes.stop_id == stop_id_A).all()
        stop_times_B = db.query(TranzyStopTimes).filter(TranzyStopTimes.stop_id == stop_id_B).all()

        trips_A = {st.trip_id: st.stop_sequence for st in stop_times_A}
        trips_B = {st.trip_id: st.stop_sequence for st in stop_times_B}

        common_trip_ids = set(trips_A.keys()) & set(trips_B.keys())

        stop_A = db.query(TranzyStops).filter(TranzyStops.stop_id == stop_id_A).first()
        stop_B = db.query(TranzyStops).filter(TranzyStops.stop_id == stop_id_B).first()

        results = []
        for trip_id in common_trip_ids:
            seq_A = trips_A[trip_id]
            seq_B = trips_B[trip_id]

            direction = 1 if seq_A < seq_B else 0

            trip = db.query(TranzyTrips).filter(TranzyTrips.trip_id == trip_id).first()
            route = db.query(TranzyRoutes).filter(TranzyRoutes.route_id == trip.route_id).first()

            coords = CoordinateSchema(
                latitude_A=stop_A.stop_lat,
                longitude_A=stop_A.stop_lon,
                latitude_B=stop_B.stop_lat,
                longitude_B=stop_B.stop_lon
            )

            results.append({
                "trip_id": trip.trip_id,
                "route_id": route.route_id,
                "route_short_name": route.route_short_name,
                "route_long_name": route.route_long_name,
                "stop_sequence_A": seq_A,
                "stop_sequence_B": seq_B,
                "direction": direction,
                "distance": self.get_route_between_locations(coords)["distance_meters"],
            })

        return results

    # ------------------------------- Generic
    def save_entity(self, entity: [T], db: Session):
        db.add(entity)
        db.commit()
        return entity

    def delete_all(self, entity: [T], db: Session):
        db.query(entity).delete()
        db.commit()
        return entity
