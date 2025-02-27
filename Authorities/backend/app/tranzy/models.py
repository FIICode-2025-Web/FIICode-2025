from app.database import Base
from sqlalchemy import Column, Integer, String, Float


class TranzyVehicles(Base):
    __tablename__ = 'tranzy_vehicles'

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(String)
    speed = Column(Integer)
    route_id = Column(Integer)
    trip_id = Column(Integer)
    vehicle_type = Column(Integer)
    bike_accessible = Column(String)
    wheelchair_accessible = Column(String)
