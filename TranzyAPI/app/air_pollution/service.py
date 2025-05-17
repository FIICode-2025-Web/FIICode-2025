import json
from datetime import datetime, timedelta, timezone
import requests
from decouple import config
from sqlalchemy.orm import Session

from app.air_pollution.models import AirPollutionCache

AIR_KEY = config("aqi_key")
ZONES = [
    'A124528', 'A115744', 'A124498', 'A124222', 'A76708',
    'A227611', 'A124267', 'A124273', 'A124357', 'A124366',
    'A124327', 'A124489', 'A74905', 'A124225', 'A124324'
]

class AirPollutionService:
    CACHE_TTL = timedelta(minutes=10)

    def get_air_pollution_levels(self, db: Session):
        # use timezone‐aware now
        now = datetime.now(timezone.utc)

        cache = (
            db.query(AirPollutionCache)
              .order_by(AirPollutionCache.fetched_at.desc())
              .first()
        )
        if cache and (now - cache.fetched_at) < self.CACHE_TTL:
            return json.loads(cache.data)

        pollution_zones = []
        for zone in ZONES:
            try:
                resp = requests.get(
                    f"https://api.waqi.info/feed/{zone}?token={AIR_KEY}",
                    timeout=5
                )
                payload = resp.json()
                if payload.get("status") != "ok":
                    continue

                city = payload["data"]["city"]
                aqi = payload["data"]["aqi"]
                pollution_zones.append({
                    "zone_id": zone,
                    "zone_name": city["name"],
                    "location": {"lat": city["geo"][0], "lon": city["geo"][1]},
                    "aqi": aqi,
                })
            except Exception:
                continue

        serialized = json.dumps(pollution_zones)
        # clear out old cache
        db.query(AirPollutionCache).delete()
        # insert fresh cache with UTC timestamp
        new_cache = AirPollutionCache(
            data=serialized,
            fetched_at=now
        )
        db.add(new_cache)
        db.commit()

        return pollution_zones
