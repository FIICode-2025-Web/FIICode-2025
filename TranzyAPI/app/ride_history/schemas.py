from pydantic import BaseModel, Field
import datetime
from enum import Enum


class RideType(Enum):
    PUBLIC_TRANSPORT = "public_transport"
    RIDESHARING = "ridesharing"
    SCOOTER = "scooter"


class HistorySchema(BaseModel):
    # type: RideType = Field(RideType)
    type: str = Field(str)
    km_travelled: float = Field(float)
    duration: float = Field(float)
    cost: float = Field(float)
    start_time: datetime.datetime = Field(datetime.datetime)
    end_time: datetime.datetime = Field(datetime.datetime)


class RideHistoryResponseSchema(BaseModel):
    id: int = Field(int)
    type: str = Field(str)
    user_id: int = Field(int)
    km_travelled: float = Field(float)
    duration: float = Field(float)
    cost: float = Field(float)
    start_time: datetime.datetime = Field(datetime.datetime)
    end_time: datetime.datetime = Field(datetime.datetime)
