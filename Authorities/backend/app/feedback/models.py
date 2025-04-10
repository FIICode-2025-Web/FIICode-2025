from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime


class Feedback(Base):
    __tablename__ = 'feedbacks'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    title = Column(String)
    message = Column(String)
    isReviewed = Column(Boolean)
    datePosted = Column(DateTime)
