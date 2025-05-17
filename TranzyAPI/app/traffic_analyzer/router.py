from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.traffic_analyzer.yolo import detect_counts
from app.traffic_analyzer.models import TrafficSnapshot
from typing import Annotated
import shutil, tempfile, os, math, datetime, io, base64

from PIL import Image

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

    merged = False
    snapshot = None

    try:
        vehicle_count, person_count, results = detect_counts(img_path)

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

        for snap in db.query(TrafficSnapshot).all():
            if haversine(lat, lon, snap.lat, snap.lon) < 100:
                snap.vehicle_count = vehicle_count
                snap.person_count  = person_count
                snap.veh_level     = veh
                snap.ped_level     = ped
                snap.timestamp     = datetime.datetime.utcnow()
                db.commit()
                db.refresh(snap)
                snapshot = snap
                merged = True
                break

        if snapshot is None:
            snapshot = TrafficSnapshot(
                image_path    = img_path,
                lat           = lat,
                lon           = lon,
                vehicle_count = vehicle_count,
                person_count  = person_count,
                veh_level     = veh,
                ped_level     = ped,
                timestamp     = datetime.datetime.utcnow()
            )
            db.add(snapshot)
            db.commit()
            db.refresh(snapshot)

        annotated_array = results.plot()  # numpy.ndarray
        annotated_img   = Image.fromarray(annotated_array)

        buf = io.BytesIO()
        annotated_img.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()

        return {
            "merged": merged,
            "snapshot": {
                "id":            snapshot.id,
                "lat":           snapshot.lat,
                "lon":           snapshot.lon,
                "vehicle_count": snapshot.vehicle_count,
                "person_count":  snapshot.person_count,
                "veh_level":     snapshot.veh_level,
                "ped_level":     snapshot.ped_level,
                "timestamp":     snapshot.timestamp.isoformat(),
            },
            "annotated_image_base64": b64
        }

    except Exception as e:
        raise HTTPException(500, f"Eroare procesare imagine: {e}")
    finally:
        if merged:
            try:
                os.remove(img_path)
            except:
                pass


@traffic_router.get("/snapshots")
def list_snapshots(db: Session = Depends(get_db)):
    return db.query(TrafficSnapshot).all()


def haversine(lat1, lon1, lat2, lon2):
    R = 6371e3
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    labda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(labda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
