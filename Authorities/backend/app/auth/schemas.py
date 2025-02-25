from pydantic import BaseModel, Field, EmailStr, field_validator
import re


class PostSchema(BaseModel):
    id: int = Field(default=None)
    title: str = Field(default=None)
    content: str = Field(default=None)

    class Config:
        schema_extra = {
            "post_demo": {
                "title": "some title about animals",
                "content": "some content about animals"
            }
        }


class UserSchema(BaseModel):
    name: str = Field(default=None)
    email: EmailStr = Field(default=None)
    password: str = Field(default=None)

    @field_validator("password")
    @classmethod
    def validate_password(cls, password):
        pattern = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        if not re.match(pattern, password):
            raise ValueError(
                "Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character.")
        return password

    class Config:
        the_schema = {
            "user_demo": {
                "name": "George",
                "email": "george@yahoo.com",
                "password": "123"
            }

        }


class UserLoginSchema(BaseModel):
    email: EmailStr = Field(default=None)
    password: str = Field(default=None)

    class Config:
        the_schema = {
            "user_demo": {
                "email": "george@yahoo.com",
                "password": "123"
            }

        }
