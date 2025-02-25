from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from app.auth.exceptions import UserNotFoundException, UserAlreadyExistsException, InvalidCredentialsException
from fastapi.exceptions import RequestValidationError


def user_not_found_exception_handler(request: Request, exc: UserNotFoundException):
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def user_already_exists_exception_handler(request: Request, exc: UserAlreadyExistsException):
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})

class BasicResponse(BaseModel):
    message: List[str]
    status: bool

def invalid_credentials_exception_handler(request: Request, exc: InvalidCredentialsException):
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]
    message = first_error["msg"]
    return JSONResponse(status_code=400, content={"message": message})


def register_auth_exception_handlers(app: FastAPI):
    exception_handlers = {
        UserNotFoundException: user_not_found_exception_handler,
        UserAlreadyExistsException: user_already_exists_exception_handler,
        InvalidCredentialsException: invalid_credentials_exception_handler,
        RequestValidationError: validation_exception_handler
    }

    for exc, handler in exception_handlers.items():
        app.add_exception_handler(exc, handler)
