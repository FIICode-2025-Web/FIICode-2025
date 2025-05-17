from pydantic import BaseModel, Field

class RouteTasksRequest(BaseModel):
    text: str

