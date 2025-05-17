from pydantic import BaseModel
from datetime import datetime


class NoiseRecordCreate(BaseModel):
    decibel: float
    latitude: float
    longitude: float
    file_name: str


class NoiseRecordRead(BaseModel):
    id: int
    decibel: float
    latitude: float
    longitude: float
    file_name: str
    timestamp: datetime

class NoiseZone(BaseModel):
    zone_id: int
    center_lat: float
    center_lon: float
    avg_decibel: float
    max_decibel: float
    max_file_name: str
    record_count: int
    timestamp: datetime

class CoverageResponse(BaseModel):
    covered: bool