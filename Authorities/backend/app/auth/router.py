from typing import Annotated

from fastapi import Depends, APIRouter
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db

auth_router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
db_dependency = Annotated[Session, Depends(get_db)]

@auth_router.get("/")
def greet2():
    return {"Hello": "World"}
