from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.router import auth_router
from app.auth.handlers import register_auth_exception_handlers
from app.ridesharing.router import ridesharing_router
from app.tranzy.router import tranzy_router
from app.scooter.router import scooter_router
from app.ride_history.router import history
from app.air_pollution.router import air_router
from app.database import engine, Base

app = FastAPI(dependencies=[Depends(jwtBearer())])

origins = [
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(tranzy_router)
app.include_router(scooter_router)
app.include_router(ridesharing_router)
app.include_router(history)
app.include_router(air_router)
register_auth_exception_handlers(app)

Base.metadata.create_all(bind=engine)


@app.get("/", tags=["test"])
def greet():
    return {"Hello": "World"}


if __name__ == "__main__":
    config = uvicorn.Config("main:app", port=8003)
    server = uvicorn.Server(config)
    server.run()
