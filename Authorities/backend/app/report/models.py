from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime


class Report(Base):
    __tablename__ = 'reports'

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String)
    title = Column(String)
    message = Column(String)
    route = Column(String)
    isReviewed = Column(Boolean)
    datePosted = Column(DateTime)
