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


@report_router.get("/")
def get_reports(db: db_dependency):
    return report_service.get_reports(db)

@report_router.patch("/report_id")
def update_report(report_id: int, db: db_dependency):
    return report_service.review_report(report_id, db)

