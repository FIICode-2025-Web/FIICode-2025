from app.database import Base
from sqlalchemy import Column, Integer, Float, Boolean, String


class Badges(Base):
    __tablename__ = 'badges'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    identification_name = Column(String)
    type = Column(String)
    condition_type = Column(String)
    condition_value = Column(Integer)
    description = Column(String)
    value = Column(Integer)