from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.sql.sqltypes import TIMESTAMP

from app.database import Base


class NoiseRecord(Base):
    __tablename__ = "noise_record"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    user_id = Column(Integer)
    decibel = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(TIMESTAMP(timezone=True))
