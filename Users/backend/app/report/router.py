from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt.jwt_bearer import jwtBearer
from app.report.schemas import ReportSchema
from app.report.service import ReportService

report_router = APIRouter(prefix="/api/v1/report", tags=["report"])

db_dependency = Annotated[Session, Depends(get_db)]

report_service = ReportService()


@report_router.post("/")
def post_ride_history(report_entry: ReportSchema, db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    return report_service.add_report(report_entry, db, token)

@report_router.get("/")
def get_reports_by_user(db: db_dependency, token: Annotated[str, Depends(jwtBearer())]):
    return report_service.get_reports_by_user(db, token)
