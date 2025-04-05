from pydantic import BaseModel, Field
import datetime


class ReportSchema(BaseModel):
    title: str = Field(str)
    message: str = Field(str)
    route: str = Field(str)
    isReviewed: bool = Field(bool)
    datePosted: datetime.datetime = Field(datetime.datetime)
