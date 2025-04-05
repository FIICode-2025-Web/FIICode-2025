from pydantic import BaseModel, Field
import datetime


class FeedbackSchema(BaseModel):
    title: str = Field(str)
    message: str = Field(str)
    isReviewed: bool = Field(bool)
    datePosted: datetime.datetime = Field(datetime.datetime)
