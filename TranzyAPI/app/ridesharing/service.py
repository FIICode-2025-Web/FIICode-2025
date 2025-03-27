from sqlalchemy.orm import Session

from app.ridesharing.models import RideSharingCars
from app.ridesharing.schemas import CarRequest
from app.tranzy.models import TranzyStops
import random
from math import radians, sin, cos, acos
from decouple import config
import datetime
import sys

CENTRAL_LAT = 47.146797
CENTRAL_LON = 27.61115017
OPENROUTESERVICEKEY = config("open_route_service_key")

CAR_MODELS = ["Dacia Spring", "Toyota Prius", "Renault Zoe", "Tesla Model 3", "Volkswagen ID.3",
              "Hyundai Kona Electric",
              "Kia Niro", "Nissan Leaf", "BMW i3", "Peugeot e-208", "Opel Corsa-e", "Mazda MX-30", "Mini Electric",
              "Honda e", "Fiat 500 Electric", "Skoda Enyaq iV", "Polestar 2", "Audi e-tron", "Mercedes EQC"]

DRIVER_NAMES = ["Alex", "Andreea", "Mihai", "Cristina", "Ionut", "Maria", "George", "Ana", "Vlad", "Andrei", "Diana"
                                                                                                             "Gabriel",
                "Elena", "Adrian", "Marius", "Raluca", "Cristian", "Irina", "Florin", "Alina"]


class RideSharingService:
    def get_cars(self, db: Session):
        cars = []

        test_cars = db.query(RideSharingCars).first()

        if test_cars:
            if test_cars.time_created:
                if datetime.datetime.now().timestamp() - float(test_cars.time_created) < 60:
                    return db.query(RideSharingCars).all()

        self.delete_all(db)

        all_stops = db.query(TranzyStops).all()

        selected_stops = []
        max_attempts = 100

        while len(selected_stops) < 30 and max_attempts > 0:
            sample = random.sample(all_stops, 60)
            filtered = [stop for stop in sample
                        if self.calculate_distance(CENTRAL_LAT, CENTRAL_LON, stop.stop_lat, stop.stop_lon) < 3]

            for stop in filtered:
                if stop not in selected_stops and len(selected_stops) < 30:
                    selected_stops.append(stop)
            max_attempts -= 1

        for i, stop in enumerate(selected_stops):
            car = {
                "id": i,
                "latitude": stop.stop_lat,
                "longitude": stop.stop_lon,
                "driver_name": random.choice(DRIVER_NAMES),
                "car_model": random.choice(CAR_MODELS),
                "plate_number": f"IS-{random.randint(1, 99)}-XYZ",
                "is_available": random.choice([True, False]),
                "seats": random.choice([3, 4]),
                "is_electric": random.choice([True, False]),
                "rating": round(random.uniform(3.8, 5.0), 1),
                "time_created": datetime.datetime.now().timestamp()
            }
            cars.append(car)
            self.save_entity(RideSharingCars(**car), db)
        return cars

    def get_closest_car(self, db: Session, car_request: CarRequest):
        cars = db.query(RideSharingCars).all()
        min_distance = sys.float_info.max
        found_car = None
        for car in cars:
            distance = self.calculate_distance(car_request.user_latitude, car_request.user_longitute, car.latitude,
                                               car.longitude)
            if distance < min_distance:
                min_distance = distance
                found_car = car
        return found_car

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        lon1 = radians(lon1)
        lon2 = radians(lon2)
        lat1 = radians(lat1)
        lat2 = radians(lat2)
        R = 6371.01
        return R * acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon1 - lon2))


    def save_entity(self, car, db: Session):
        db.add(car)
        db.commit()

    def delete_all(self, db: Session):
        db.query(RideSharingCars).delete()
        db.commit()
