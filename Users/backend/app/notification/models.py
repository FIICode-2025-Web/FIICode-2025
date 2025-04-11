from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    message = Column(String)
    datePosted = Column(DateTime)
    is_read = Column(Boolean)
    type = Column(String)
