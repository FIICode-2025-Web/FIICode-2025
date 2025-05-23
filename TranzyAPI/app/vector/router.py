from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.vector.schemas import RouteTasksRequest
from app.vector.vector_service import VectorService

vector_router = APIRouter(prefix="/api/v1/vector", tags=["vector"])

db_dependency = Annotated[Session, Depends(get_db)]

vector_service = VectorService()

@vector_router.post(
    "/route-tasks",
)
def suggest_route_tasks(
    req: RouteTasksRequest,
):
    result = vector_service.fetch_pipeline(text=req.text)
    return result or {"events": [], "routes": []}
