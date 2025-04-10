from sqlalchemy.orm import Session
from app.auth.schemas import UserSchema, AuthorityRegisterSchema
from .models import Users, VerificationCodes
from passlib.context import CryptContext

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
from app.auth.exceptions import (UserNotFoundException, UserAlreadyExistsException, InvalidCredentialsException,
                                 VerificationCodeAlreadyUsedException, InvalidVerificationCodeException,
                                 )
from app.auth.jwt.jwt_handler import signJWT


def authenticate_user(email: str, password: str, role: int, db):
    if not find_user_by_email(email, db):
        raise UserNotFoundException()
    user = find_user_by_email(email, db)

    if not bcrypt_context.verify(password, user.hashed_password):
        raise InvalidCredentialsException()

    if user.role != role:
        raise InvalidCredentialsException()

    return signJWT(user.email, user.id, role)


def register_account(user: UserSchema, user_role: int, db: Session):
    if find_user_by_email(user.email, db):
        raise UserAlreadyExistsException()
    saved_user = create_user(user, user_role, db)
    return signJWT(saved_user.email, user_role)


def register_authority(user: AuthorityRegisterSchema, authority_role: int, db: Session):
    if find_user_by_email(user.email, db):
        raise UserAlreadyExistsException()

    if not db.query(VerificationCodes).filter(VerificationCodes.email == user.email).first():
        raise UserNotFoundException()

    verification_code = db.query(VerificationCodes).filter(VerificationCodes.email == user.email).first()

    if verification_code.is_used:
        raise VerificationCodeAlreadyUsedException()

    if verification_code.code != user.code:
        raise InvalidVerificationCodeException()

    saved_user = create_user(user, authority_role, db)
    update_verification_code(verification_code, db)

    return signJWT(saved_user.email, authority_role)


def find_user_by_email(email: str, db: Session):
    return db.query(Users).filter(Users.email == email).first()


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


def update_verification_code(verification_code: VerificationCodes, db: Session):
    verification_code.is_used = True
    db.commit()
