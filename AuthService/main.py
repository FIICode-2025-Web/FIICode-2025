from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.auth.handlers import register_auth_exception_handlers
from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.router import auth_router
import app.auth.models as models
from app.database import engine

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

models.Base.metadata.create_all(bind=engine)



@app.get("/", dependencies=[Depends(jwtBearer())], tags=["test"])
def greet():
    return {"Hello": "World"}
