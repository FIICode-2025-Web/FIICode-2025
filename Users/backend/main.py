from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.auth.handlers import register_auth_exception_handlers
from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.router import auth_router
from app.feedback.router import feedback_router
from app.report.router import report_router
from app.notification.router import notification_router
from app.gamification.router import gamification_router
import app.auth.models as models
from app.database import engine

app = FastAPI()

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
app.include_router(auth_router,dependencies=[Depends(jwtBearer())])
app.include_router(feedback_router,dependencies=[Depends(jwtBearer())])
app.include_router(report_router,dependencies=[Depends(jwtBearer())])
app.include_router(gamification_router,dependencies=[Depends(jwtBearer())])
app.include_router(notification_router)
register_auth_exception_handlers(app)

models.Base.metadata.create_all(bind=engine)



@app.get("/", tags=["test"])
def greet():
    return {"Hello": "World"}

if __name__ == "__main__":
    config = uvicorn.Config("main:app", port=8002)
    server = uvicorn.Server(config)
    server.run()