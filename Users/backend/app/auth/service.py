from sqlalchemy.orm import Session
from .models import Users
from passlib.context import CryptContext

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def find_user_by_email(email: str, db: Session):
    return db.query(Users).filter(Users.email == email).first()

