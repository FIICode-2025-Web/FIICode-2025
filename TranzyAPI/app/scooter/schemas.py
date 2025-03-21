from pydantic import BaseModel, Field, EmailStr, field_validator

class CoordinateSchema(BaseModel):
    latitude_A: float = Field(float)
    longitude_A: float = Field(float)
    latitude_B: float = Field(float)
    longitude_B: float = Field(float)