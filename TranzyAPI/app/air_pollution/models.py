# app/air_pollution/models.py

from sqlalchemy import Column, Integer, DateTime, Text
from sqlalchemy.sql import func

from app.database import Base


class AirPollutionCache(Base):
    __tablename__ = "air_pollution_cache"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Text, nullable=False)
    fetched_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),  # use the DB’s UTC now
        nullable=False
    )
