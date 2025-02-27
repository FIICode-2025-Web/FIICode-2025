from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.router import auth_router
from app.auth.handlers import register_auth_exception_handlers

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
register_auth_exception_handlers(app)


@app.get("/", dependencies=[Depends(jwtBearer())], tags=["test"])
def greet():
    return {"Hello": "World"}
