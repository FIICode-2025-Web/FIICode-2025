from datetime import datetime

from app.auth.jwt.jwt_handler import decodeJWT
from app.report.models import Report
from app.report.schemas import ReportSchema


class ReportService:
    def add_report(self, report_entry: ReportSchema, db, token: str):
        payload = decodeJWT(token)
        user_id = payload["id"]
        report = Report(
            user_id=user_id,
            title=report_entry.title,
            message=report_entry.message,
            route=report_entry.route,
            isReviewed=False,
            datePosted=datetime.now(),
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    def get_reports_by_user(self, db, token: str):
        payload = decodeJWT(token)
        user = payload["id"]
        return db.query(Report).filter(Report.user_id == user).all()