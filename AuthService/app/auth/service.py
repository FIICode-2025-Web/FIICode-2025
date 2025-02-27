from sqlalchemy.orm import Session
from app.auth.schemas import UserSchema
from .models import Users
from passlib.context import CryptContext

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
from app.auth.exceptions import UserNotFoundException, UserAlreadyExistsException, InvalidCredentialsException
from app.auth.jwt.jwt_handler import signJWT


def authenticate_user(email: str, password: str, role: int, db):
    if not find_user_by_email(email, db):
        raise UserNotFoundException()
    user = find_user_by_email(email, db)

    if not bcrypt_context.verify(password, user.hashed_password):
        raise InvalidCredentialsException()

    if user.role != role:
        raise InvalidCredentialsException()

    return signJWT(user.email, role)


def register_account(user: UserSchema, user_role: int, db: Session):
    if find_user_by_email(user.email, db):
        raise UserAlreadyExistsException()
    saved_user = create_user(user, user_role, db)
    return signJWT(saved_user.email, user_role)


def find_user_by_email(email: str, db: Session):
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise UserNotFoundException()
    return user


def create_user(user: UserSchema, role: int, db: Session):
    create_user_model = Users(
        username=user.name,
        email=user.email,
        hashed_password=bcrypt_context.hash(user.password),
        role=role
    )
    saved_user = save_user(create_user_model, db)
    return saved_user


def save_user(user: Users, db: Session):
    db.add(user)
    db.commit()
    return user
