from datetime import datetime
import math

from sqlalchemy.orm import Session

from app.auth.jwt.jwt_bearer import decodeJWT
from app.noise_record.models import NoiseRecord
from app.noise_record.schemas import NoiseRecordCreate, NoiseRecordRead, NoiseZone


def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)
    a = math.sin(Δφ/2)**2 + math.cos(φ1)*math.cos(φ2)*math.sin(Δλ/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

class NoiseRecordService:
    def upload_noise(self, noiseRecord: NoiseRecordCreate,
                     db: Session, token: str) -> NoiseRecord:
        user_id = decodeJWT(token)["id"]
        rec = NoiseRecord(
            user_id=user_id,
            decibel=noiseRecord.decibel,
            latitude=noiseRecord.latitude,
            longitude=noiseRecord.longitude,
            timestamp=datetime.utcnow(),
            file_name=noiseRecord.file_name
        )
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return rec

    def list_noises(self, db: Session, token: str):
        user_id = decodeJWT(token)["id"]
        return db.query(NoiseRecord).filter(NoiseRecord.user_id == user_id).all()

    def list_noise_zones_global(self,db:Session, radius_m: float = 100.0):
        recs = db.query(NoiseRecord).all()

        clusters: list[list[NoiseRecordRead]] = []
        for rec in recs:
            placed = False
            for cluster in clusters:
                latc = sum(r.latitude for r in cluster) / len(cluster)
                lonc = sum(r.longitude for r in cluster) / len(cluster)
                if haversine(rec.latitude, rec.longitude, latc, lonc) <= radius_m:
                    cluster.append(rec)
                    placed = True
                    break
            if not placed:
                clusters.append([rec])
        zones: list[NoiseZone] = []
        for idx, cluster in enumerate(clusters, start=1):
            avg_lat = sum(r.latitude for r in cluster) / len(cluster)
            avg_lon = sum(r.longitude for r in cluster) / len(cluster)
            avg_db  = sum(r.decibel  for r in cluster) / len(cluster)
            maxi    = max(cluster, key=lambda r: r.decibel)

            zones.append(NoiseZone(
                zone_id     = idx,
                center_lat  = round(avg_lat,6),
                center_lon  = round(avg_lon,6),
                avg_decibel = round(avg_db,2),
                max_decibel = round(maxi.decibel,2),
                max_file_name = maxi.file_name,
                record_count  = len(cluster),
                timestamp     = maxi.timestamp
            ))

        return zones