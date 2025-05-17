from pydantic import BaseModel, Field

class RouteTasksRequest(BaseModel):
    departure_place: str
    arrival_place:   str
    departure_time:  str

