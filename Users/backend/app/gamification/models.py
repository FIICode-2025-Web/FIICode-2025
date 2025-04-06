from app.database import Base
from sqlalchemy import Column, Integer, DateTime, String


class UserBadges(Base):
    __tablename__ = 'user_badges'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    badge_id = Column(Integer)
    earned_at = Column(DateTime)


class Badges(Base):
    __tablename__ = 'badges'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    identification_name = Column(String)
    type = Column(String)
    condition_type = Column(String)
    condition_value = Column(Integer)
