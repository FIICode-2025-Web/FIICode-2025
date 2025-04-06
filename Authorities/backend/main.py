from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.router import auth_router
from app.auth.handlers import register_auth_exception_handlers
import app.tranzy_client.models as models
import app.authorities.models as authorities_models
from app.tranzy_client.router import tranzy_client_router
from app.authorities.router import authorities_routes
from app.tranzy.router import tranzy_router
from app.feedback.router import feedback_router
from app.report.router import report_router
from app.notification.router import notification_router
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
app.include_router(tranzy_client_router)
app.include_router(tranzy_router)
app.include_router(authorities_routes)
app.include_router(feedback_router)
app.include_router(report_router)
app.include_router(notification_router)
register_auth_exception_handlers(app)

Base.metadata.create_all(bind=engine)


@app.get("/", tags=["test"])
def greet():
    return {"Hello": "World"}


if __name__ == "__main__":
    config = uvicorn.Config("main:app", port=8001)
    server = uvicorn.Server(config)
    server.run()
