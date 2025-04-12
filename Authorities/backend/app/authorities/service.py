import datetime

from sqlalchemy.orm import Session
from typing import TypeVar
from app.authorities.models import VerificationCodes
from datetime import datetime
import random
from app.authorities.exceptions import CodeAlreadyGenerated, AccountAlreadyCreated
from app.auth.models import Users
T = TypeVar('T')


class AuthorityService:

    def create_code(self, email: str, db: Session):
        if self.find_code_by_email(email, db):
            raise CodeAlreadyGenerated()

        if db.query(Users).filter(Users.email == email).first():
            raise AccountAlreadyCreated()

        verification_code = VerificationCodes(email=email,
                                              code=self.generate_code(),
                                              is_used=False,
                                              created_at=self.generate_time())
        return self.save_entity(verification_code, db)

    def get_user_by_id(self, user_id: int, db: Session):
        return db.query(Users).filter(Users.id == user_id).first()

    def save_entity(self, entity: [T], db: Session):
        db.add(entity)
        db.commit()
        db.refresh(entity)
        return entity

    def delete_all(self, entity: [T], db: Session):
        db.query(entity).delete()
        db.commit()
        return entity

    def find_code_by_email(self, email: str, db: Session):
        return db.query(VerificationCodes).filter(VerificationCodes.email == email).first()

    def generate_code(self):
        return str(random.randint(100000, 999999))

    def generate_time(self):
        return datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
