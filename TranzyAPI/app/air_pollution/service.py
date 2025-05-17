from typing import TypeVar

import requests
from decouple import config
from passlib.context import CryptContext
from typing import List, Dict
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

T = TypeVar('T')
AIR_KEY = config("tranzy_key")


zones_list = ['A124528','A115744','A124498','A124222','A76708','A227611','A124267','A124273','A124357',
              'A124366','124327','A124489','A74905','A124225', 'A124324']

class AirPollutionService:
    def get_air_pollution_levels(self) -> List[Dict]:
        pollution_zones = []

        for zone in zones_list:
            try:
                response = requests.get(f"https://api.waqi.info/feed/{zone}?token=f593a26ea46d1a06b349ee4acff7d4bdee09de84")

                data = response.json()

                if data["status"] != "ok":
                    continue

                city = data["data"]["city"]
                aqi = data["data"]["aqi"]

                pollution_zones.append({
                    "zone_id": zone,
                    "zone_name": city["name"],
                    "location": {
                        "lat": city["geo"][0],
                        "lon": city["geo"][1],
                    },
                    "aqi": aqi
                })
            except Exception as e:
                print(f"Eroare la fetch pentru zona {zone}: {e}")
                continue

        return pollution_zones