from app.tranzy.models import TranzyStops
from app.scooter.models import Scooters
import random
from sqlalchemy.orm import Session
from math import radians, sin, cos, acos
import datetime

CENTRAL_LAT = 47.146797
CENTRAL_LON = 27.61115017


class ScooterService:
    def get_scooters(self, db: Session):
        scooters = []

        test_scooters = db.query(Scooters).first()

        if test_scooters:
            if test_scooters.time_created:
                if datetime.datetime.now().timestamp() - float(test_scooters.time_created) < 60:
                    return db.query(Scooters).all()

        self.delete_all(db)

        all_stops = db.query(TranzyStops).all()

        selected_stops = []
        max_attempts = 100

        while len(selected_stops) < 100 and max_attempts > 0:
            sample = random.sample(all_stops, 150)
            filtered = [stop for stop in sample if self.calculate_distance(
                CENTRAL_LAT, CENTRAL_LON, stop.stop_lat, stop.stop_lon) < 3]

            for stop in filtered:
                if stop not in selected_stops and len(selected_stops) < 100:
                    selected_stops.append(stop)

            max_attempts -= 1

        for i, stop in enumerate(selected_stops):
            scooter = {
                "id": i,
                "latitude": stop.stop_lat,
                "longitude": stop.stop_lon,
                "battery_level": random.randint(0, 100),
                "is_reserved": random.choice([True, False]),
                "time_created": datetime.datetime.now().timestamp()
            }
            scooters.append(scooter)
            self.save_entity(Scooters(**scooter), db)


        return scooters

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        lon1 = radians(lon1)
        lon2 = radians(lon2)
        lat1 = radians(lat1)
        lat2 = radians(lat2)
        R = 6371.01
        return R * acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon1 - lon2))

    def delete_all(self, db: Session):
        db.query(Scooters).delete()
        db.commit()

    def save_entity(self, scooter, db: Session):
        db.add(scooter)
        db.commit()
