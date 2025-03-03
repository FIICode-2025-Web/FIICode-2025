from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.auth.exceptions import WrongRoleException
from fastapi import logger


def wrong_role_exception_handler(request: Request, exc: WrongRoleException):
    logger.logger.error(f"WrongRoleException: {exc}")
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]
    message = first_error["msg"]
    return JSONResponse(status_code=400, content={"message": message})


def register_auth_exception_handlers(app: FastAPI):
    exception_handlers = {
        WrongRoleException: wrong_role_exception_handler,
        RequestValidationError: validation_exception_handler
    }

    for exc, handler in exception_handlers.items():
        app.add_exception_handler(exc, handler)
