from datetime import datetime

from app.auth.jwt.jwt_handler import decodeJWT
from app.report.models import Report
from app.report.schemas import ReportSchema


class ReportService:
    def get_reports(self, db):
        return db.query(Report).all()