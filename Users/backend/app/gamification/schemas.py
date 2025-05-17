from pydantic import BaseModel, Field


class BadgeSchema(BaseModel):
    id: int = Field(int)
    name: str = Field(str)
    identification_name:str = Field(str)
    type:str = Field(str)
    condition_type:str = Field(str)
    condition_value: int = Field(int)
    description: str = Field(str)
    value: int = Field(int)

class GetBadgeSchema(BaseModel):
    user_id: int = Field(int)
    badge_info: BadgeSchema = Field(BadgeSchema)

