from sqlalchemy.orm import Session
from app.auth.schemas import UserSchema
from .models import Users
from passlib.context import CryptContext

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def find_user_by_email(email: str, db: Session):
    return db.query(Users).filter(Users.email == email).first()


def create_user(user: UserSchema, db: Session):
    create_user_model = Users(
        username=user.name,
        email=user.email,
        hashed_password=bcrypt_context.hash(user.password)
    )
    saved_user = save_user(create_user_model, db)
    return saved_user


def save_user(user: Users, db: Session):
    db.add(user)
    db.commit()
    return user


def authenticate_user(email: str, password: str, db):
    user = find_user_by_email(email, db)
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user
