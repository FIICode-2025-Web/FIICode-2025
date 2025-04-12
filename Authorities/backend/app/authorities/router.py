from typing import Annotated
from sqlalchemy.orm import Session
from app.database import get_db

from fastapi import Body, Depends, APIRouter
from app.authorities.schemas import PostVerificationCodeSchema
from app.authorities.service import AuthorityService

authorities_routes = APIRouter(prefix="/api/v1/authorities", tags=["authorities"])

db_dependency = Annotated[Session, Depends(get_db)]

authority_service = AuthorityService()


@authorities_routes.post("/generate-code")
def generate_code(db: db_dependency, verification_generator: PostVerificationCodeSchema = Body(default=None)):
    return authority_service.create_code(verification_generator.email, db)

@authorities_routes.get("/user/{user_id}")
def get_user_by_id(user_id: int, db: db_dependency):
    return authority_service.get_user_by_id(user_id, db)
