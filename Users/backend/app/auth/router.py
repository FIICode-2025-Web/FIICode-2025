from typing import Annotated

from fastapi import Body, Depends, APIRouter
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.auth.jwt.jwt_handler import signJWT
from app.auth.schemas import UserSchema, UserLoginSchema
from app.auth.exceptions import UserNotFoundException, UserAlreadyExistsException, InvalidCredentialsException
from app.database import get_db
from .models import Users
from .service import find_user_by_email, create_user, authenticate_user

auth_router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
db_dependency = Annotated[Session, Depends(get_db)]


@auth_router.post("/signup")
def user_signup(db: db_dependency, user: UserSchema = Body(default=None)):
    if find_user_by_email(user.email, db):
        raise UserAlreadyExistsException()
    saved_user = create_user(user, db)
    return signJWT(saved_user.email)


@auth_router.post("/login")
def user_login(db: db_dependency, user: UserLoginSchema = Body(default=None)):
    if not find_user_by_email(user.email, db):
        raise UserNotFoundException()
    user = authenticate_user(user.email, user.password, db)
    if not user:
        raise InvalidCredentialsException()
    return signJWT(user.email)
