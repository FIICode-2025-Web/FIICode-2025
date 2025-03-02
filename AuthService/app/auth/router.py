from typing import Annotated

from fastapi import Body, Depends, APIRouter
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.auth.schemas import UserSchema, UserLoginSchema, GetUserSchema, AuthorityRegisterSchema
from app.database import get_db
from .service import authenticate_user, register_account,register_authority, find_user_by_email
from app.auth.jwt.jwt_dependency import get_current_user
auth_router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
db_dependency = Annotated[Session, Depends(get_db)]

authority_role: int = 0
user_role: int = 1


@auth_router.post("/user/signup")
def user_signup(db: db_dependency, user: UserSchema = Body(default=None)):
    return register_account(user, user_role, db)


@auth_router.post("/user/login")
def user_login(db: db_dependency, user: UserLoginSchema = Body(default=None)):
    return authenticate_user(user.email, user.password, user_role, db)


@auth_router.post("/authority/signup")
def authority_signup(db: db_dependency, user: AuthorityRegisterSchema = Body(default=None)):
    return register_authority(user, authority_role, db)


@auth_router.post("/authority/login")
def authority_login(db: db_dependency, user: UserLoginSchema = Body(default=None)):
    return authenticate_user(user.email, user.password, authority_role, db)


@auth_router.post("/account")
def get_account_info(db: db_dependency, user_data=Depends(get_current_user)):
    user = find_user_by_email(user_data["email"], db)

    get_user = GetUserSchema(id=user.id, email=user.email, role=user.role)

    return get_user
