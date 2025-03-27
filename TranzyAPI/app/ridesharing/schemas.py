from pydantic import BaseModel, Field


class CarRequest(BaseModel):
    user_latitude: float = Field(default=None)
    user_longitute: float = Field(default=None)
