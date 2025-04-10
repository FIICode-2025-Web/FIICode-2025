from app.report.models import Report


class ReportService:
    def get_reports(self, db):
        return db.query(Report).all()