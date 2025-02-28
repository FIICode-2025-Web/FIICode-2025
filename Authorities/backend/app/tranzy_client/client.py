import requests
from decouple import config
from app.tranzy_client.service import TranzyService
from sqlalchemy.orm import Session
from app.tranzy_client.models import TranzyRoutes, TranzyStops, TranzyTrips, TranzyShapes

TRANZY_KEY = config("tranzy_key")

tranzy_service = TranzyService()

class TranzyClient:

    def get_tranzy_vehicles(self):
        response = requests.get("https://api.tranzy.ai/v1/opendata/vehicles",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        return response.json()

    def get_tranzy_routes(self,db: Session):
        response = requests.get("https://api.tranzy.ai/v1/opendata/routes",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        tranzy_service.delete_all(TranzyRoutes, db)
        for route in response.json():
            route_model = TranzyRoutes(
                route_id=route.get("route_id"),
                agency_id=route.get("agency_id"),
                route_short_name=route.get("route_short_name"),
                route_long_name=route.get("route_long_name"),
                route_color=route.get("route_color"),
                route_type=route.get("route_type"),
                route_desc=route.get("route_desc")
            )
            tranzy_service.save_entity(route_model, db)
        return response.json()

    def get_tranzy_stops(self,db: Session):
        response = requests.get("https://api.tranzy.ai/v1/opendata/stops",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        tranzy_service.delete_all(TranzyRoutes, db)
        for stop in response.json():
            stop_model = TranzyStops(
                stop_id=stop.get("stop_id"),
                stop_name=stop.get("stop_name"),
                stop_desc=stop.get("stop_desc"),
                stop_lat=stop.get("stop_lat"),
                stop_lon=stop.get("stop_lon"),
                location_type=stop.get("location_type"),
                stop_code=stop.get("stop_code")
            )
            tranzy_service.save_entity(stop_model, db)
        return response.json()

    def get_tranzy_trips(self,db: Session):
        response = requests.get("https://api.tranzy.ai/v1/opendata/trips",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        tranzy_service.delete_all(TranzyRoutes, db)
        for trip in response.json():
            trip_model = TranzyTrips(
                trip_id=trip.get("trip_id"),
                route_id=trip.get("route_id"),
                trip_headsign=trip.get("trip_headsign"),
                direction_id=trip.get("direction_id"),
                block_id=trip.get("block_id"),
                shape_id=trip.get("shape_id")
            )
            tranzy_service.save_entity(trip_model, db)
        return response.json()

    def get_tranzy_shapes(self, db: Session):
        response = requests.get("https://api.tranzy.ai/v1/opendata/shapes",
                                headers={"X-API-KEY": TRANZY_KEY, "X-Agency-Id": "1"}
                                )
        tranzy_service.delete_all(TranzyRoutes, db)
        for (index, shape) in enumerate(response.json()):
            shape_model = TranzyShapes(
                id=index,
                shape_id=shape.get("shape_id"),
                shape_pt_lat=shape.get("shape_pt_lat"),
                shape_pt_lon=shape.get("shape_pt_lon"),
                shape_pt_sequence=shape.get("shape_pt_sequence")
            )
            tranzy_service.save_entity(shape_model, db)
        return response.json()
