from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.jwt.jwt_bearer import jwtBearer
from app.database import get_db
from app.noise_record.schemas import NoiseRecordRead, NoiseRecordCreate, NoiseZone
from app.noise_record.service import NoiseRecordService

noise_router = APIRouter(prefix="/api/v1/noise", tags=["noise_record"])
db_dependency = Annotated[Session, Depends(get_db)]
auth = Annotated[str, Depends(jwtBearer())]

service = NoiseRecordService()


@noise_router.post("/", )
def post_noise(
        noiseRecord: NoiseRecordCreate,
        db: db_dependency,
        token: str = Depends(jwtBearer()),
):
    return service.upload_noise(noiseRecord, db, token)


@noise_router.get(
    "/",
    response_model=List[NoiseRecordRead],
    summary="List your noise recordings"
)
def get_noises(
        db: db_dependency,
        token: str = Depends(jwtBearer()),
):
    return service.list_noises(db, token)


@noise_router.get("/zones", response_model=List[NoiseZone])
def get_noise_zones(
        db: db_dependency,
):
    return service.list_noise_zones_global(db)
