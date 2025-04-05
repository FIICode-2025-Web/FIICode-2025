from app.database import Base
from sqlalchemy import Column, Integer, Float, Boolean, String, DateTime


class RideHistory(Base):
    __tablename__ = 'ride_history'

    id = Column(Integer, primary_key=True, index=True)
    ride = Column(String)
    user_id = Column(String)
    km_travelled = Column(Float)
    duration = Column(Float)
    cost = Column(Float)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
