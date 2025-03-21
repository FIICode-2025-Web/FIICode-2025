from app.database import Base
from sqlalchemy import Column, Integer, Float, Boolean, String


class Scooters(Base):
    __tablename__ = 'scooters'

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    battery_level = Column(Integer)
    is_reserved = Column(Boolean)
    time_created = Column(String)
