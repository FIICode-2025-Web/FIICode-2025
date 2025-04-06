from pydantic import BaseModel, Field


class NotificationSchema(BaseModel):
    message = str = Field(str)