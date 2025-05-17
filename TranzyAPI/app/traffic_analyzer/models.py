from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.sql.sqltypes import TIMESTAMP

from app.database import Base


class TrafficSnapshot(Base):
    __tablename__ = "traffic_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    vehicle_count = Column(Integer, nullable=False)
    person_count = Column(Integer, nullable=False)
    veh_level = Column(String, nullable=False)
    ped_level = Column(String, nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True))
