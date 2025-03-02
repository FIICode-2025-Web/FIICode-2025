from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean

class VerificationCodes(Base):
    __tablename__ = 'verification_codes'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    code = Column(String)
    is_used = Column(Boolean)
    created_at = Column(String)