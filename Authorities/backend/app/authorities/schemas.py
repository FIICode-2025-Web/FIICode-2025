from pydantic import BaseModel, Field, EmailStr, field_validator
import re


class PostVerificationCodeSchema(BaseModel):
    email: EmailStr = Field(default=None)

    class Config:
        the_schema = {
            "user_demo": {
                "email": "george@yahoo.com"
            }
        }
