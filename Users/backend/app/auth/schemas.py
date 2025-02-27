from pydantic import BaseModel, Field, EmailStr


class UserSchema(BaseModel):
    name: str = Field(default=None)
    email: EmailStr = Field(default=None)
    password: str = Field(default=None)
    role: int = Field(default=1)

    class Config:
        the_schema = {
            "user_demo": {
                "name": "George",
                "email": "george@yahoo.com",
                "password": "123",
                "role": 1
            }

        }
