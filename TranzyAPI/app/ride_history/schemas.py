from pydantic import BaseModel, Field
import datetime


class HistorySchema(BaseModel):
    ride: str = Field(str)
    km_travelled: float = Field(float)
    duration: float = Field(float)
    cost: float = Field(float)
    start_time: datetime.datetime = Field(datetime.datetime)
    end_time: datetime.datetime = Field(datetime.datetime)
