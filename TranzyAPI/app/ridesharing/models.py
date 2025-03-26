from app.database import Base
from sqlalchemy import Column, Integer, Float, Boolean, String


class RideSharingCars(Base):
    __tablename__ = 'ridesharing_cars'

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    driver_name = Column(String)
    car_model = Column(String)
    plate_number = Column(String)
    is_available = Column(Boolean)
    seats = Column(Integer)
    is_electric = Column(Boolean)
    rating = Column(Float)
    time_created = Column(String)
