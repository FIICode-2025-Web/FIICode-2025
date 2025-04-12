from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import TypeVar

from app.auth.exceptions import RouteNotFoundException
from app.auth.jwt.jwt_handler import decodeJWT
from app.scooter.schemas import CoordinateSchema
from app.tranzy.models import TranzyShapes, TranzyRoutes, TranzyTrips, TranzyStops, TranzyStopTimes, FavoriteRoutes
from app.ride_history.models import RideHistory
from sqlalchemy import func
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

        coords = CoordinateSchema(
            latitude_A=stop_A.stop_lat,
            longitude_A=stop_A.stop_lon,
            latitude_B=stop_B.stop_lat,
            longitude_B=stop_B.stop_lon
        )

        distance = self.get_route_between_locations(coords)["distance_meters"]
        results = []
        for trip_id in common_trip_ids:
            seq_A = trips_A[trip_id]
            seq_B = trips_B[trip_id]

            direction = 1 if seq_A < seq_B else 0

            trip = db.query(TranzyTrips).filter(TranzyTrips.trip_id == trip_id).first()
            route = db.query(TranzyRoutes).filter(TranzyRoutes.route_id == trip.route_id).first()

            results.append({
                "trip_id": trip.trip_id,
                "route_id": route.route_id,
                "route_short_name": route.route_short_name,
                "route_long_name": route.route_long_name,
                "stop_sequence_A": seq_A,
                "stop_sequence_B": seq_B,
                "direction": direction,
                "distance": distance,
            })

        return results

    # ------------------------------- Favorite Routes
    def get_favorite_routes(self, token: str, db: Session):
        payload = decodeJWT(token)
        user_id = payload["id"]
        return db.query(FavoriteRoutes).filter(FavoriteRoutes.user_id == user_id).all()

    def add_favorite_route(self, route_id: int, token: str, db: Session):
        payload = decodeJWT(token)
        user_id = payload["id"]

        existing_favorite = db.query(FavoriteRoutes).filter(
            FavoriteRoutes.user_id == user_id,
            FavoriteRoutes.route_id == route_id
        ).first()

        if existing_favorite:
            return existing_favorite

        route = db.query(TranzyRoutes).filter(TranzyRoutes.route_id == route_id).first()

        if not route:
            raise RouteNotFoundException()

        favorite_route = FavoriteRoutes(
            user_id=user_id,
            route_id=route_id,
            route_short_name=route.route_short_name,
            route_long_name=route.route_long_name,
        )
        db.add(favorite_route)
        db.commit()
        db.refresh(favorite_route)
        return favorite_route

    def delete_favorite_route(self, route_id: int, token: str, db: Session):
        payload = decodeJWT(token)
        user_id = payload["id"]

        existing_favorite = db.query(FavoriteRoutes).filter(
            FavoriteRoutes.user_id == user_id,
            FavoriteRoutes.route_id == route_id
        ).first()

        if not existing_favorite:
            return None

        db.delete(existing_favorite)
        db.commit()
        return existing_favorite

        # ------------------------------- User data

    def get_user_data(self, token: str, db: Session):
        payload = decodeJWT(token)
        user_id = payload["id"]

        user_data = {
            "public_transport": {
                "trips": 0,
                "distance_km": 0.0,
                "duration_hours": 0.0,
                "total_cost": 0.0
            },
            "scooter": {
                "trips": 0,
                "distance_km": 0.0,
                "duration_hours": 0.0,
                "total_cost": 0.0
            },
            "ridesharing": {
                "trips": 0,
                "distance_km": 0.0,
                "duration_hours": 0.0,
                "total_cost": 0.0
            }
        }

        results = db.query(
            RideHistory.type,
            func.count(RideHistory.id).label("trips"),
            func.sum(RideHistory.km_travelled).label("total_distance"),
            func.sum(RideHistory.duration).label("total_duration"),
            func.sum(RideHistory.cost).label("total_cost")
        ).filter(RideHistory.user_id == user_id).group_by(RideHistory.type).all()

        for transport_type, trips, total_distance, total_duration, total_cost in results:
            if transport_type in user_data:
                user_data[transport_type] = {
                    "trips": trips,
                    "distance_km": round(total_distance or 0, 2),
                    "duration_hours": round((total_duration or 0) / 60, 2),
                    "total_cost": round(total_cost or 0, 2)
                }

        return user_data

    # ------------------------------- Generic
    def save_entity(self, entity: [T], db: Session):
        db.add(entity)
        db.commit()
        return entity

    def delete_all(self, entity: [T], db: Session):
        db.query(entity).delete()
        db.commit()
        return entity
