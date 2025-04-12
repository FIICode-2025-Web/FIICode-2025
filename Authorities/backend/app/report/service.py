from app.report.models import Report


class ReportService:
    def get_reports(self, db):
        return db.query(Report).all()

    def review_report(self, report_id: int, db):
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return None
        report.isReviewed = True
        db.commit()
        db.refresh(report)
        return report
