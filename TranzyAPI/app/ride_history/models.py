from app.database import Base
from sqlalchemy import Column, Integer, Float, Boolean, String, DateTime
from sqlalchemy.sql.sqltypes import TIMESTAMP


class RideHistory(Base):
    __tablename__ = 'ride_history'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    ride_id = Column(Integer)
    user_id = Column(Integer)
    km_travelled = Column(Float)
    duration = Column(Float)
    cost = Column(Float)
    start_time = Column(TIMESTAMP(timezone=True))
    end_time = Column(TIMESTAMP(timezone=True))
