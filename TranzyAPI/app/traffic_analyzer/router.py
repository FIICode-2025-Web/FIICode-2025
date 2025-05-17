from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.traffic_analyzer.yolo import detect_counts
from app.traffic_analyzer.models import TrafficSnapshot
import shutil, tempfile, os
from typing import Annotated
import math
import datetime


from app.traffic_analyzer.models import TrafficSnapshot

traffic_router = APIRouter(prefix="/api/v1/traffic", tags=["traffic"])
db_dependency = Annotated[Session, Depends(get_db)]


@traffic_router.post("/congestion")
async def congestion(
        db: db_dependency,
        file: UploadFile = File(...),
        lat: float = Form(...),
        lon: float = Form(...),
):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        img_path = tmp.name

    try:
        vehicle_count, person_count = detect_counts(img_path)
        if vehicle_count < 5:
            veh = "low"
        elif vehicle_count < 15:
            veh = "medium"
        else:
            veh = "high"

        if person_count < 10:
            ped = "low"
        elif person_count < 30:
            ped = "medium"
        else:
            ped = "high"

        nearby = (
            db.query(TrafficSnapshot)
            .all()
        )
        for snap in nearby:
            if haversine(lat, lon, snap.lat, snap.lon) < 100:
                snap.vehicle_count = vehicle_count
                snap.person_count = person_count
                snap.veh_level = veh
                snap.ped_level = ped
                snap.timestamp = datetime.datetime.utcnow()
                db.commit()
                db.refresh(snap)
                os.remove(img_path)
                return {
                    "merged": True,
                    "snapshot": snap,
                }

        new_snap = TrafficSnapshot(
            image_path=img_path,
            lat=lat, lon=lon,
            vehicle_count=vehicle_count,
            person_count=person_count,
            veh_level=veh,
            ped_level=ped,
            timestamp = datetime.datetime.utcnow()
        )
        db.add(new_snap)
        db.commit()
        db.refresh(new_snap)
        return {"merged": False, "snapshot": new_snap}
    except Exception as e:
        raise HTTPException(500, str(e))

@traffic_router.get("/snapshots")
def list_snapshots(db: Session = Depends(get_db)):
    snaps = db.query(TrafficSnapshot).all()
    return snaps

def haversine(lat1, lon1, lat2, lon2):
    R = 6371e3
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)
    a = math.sin(Δφ / 2) ** 2 + math.cos(φ1) * math.cos(φ2) * math.sin(Δλ / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
