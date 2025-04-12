from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.auth.exceptions import (WrongRoleException, UserNotFoundException,
                                 BadgeNotFoundException, BadgeAlreadyAwardedException, RouteNotFoundException)
from fastapi import logger


def wrong_role_exception_handler(request: Request, exc: WrongRoleException):
    logger.logger.error(f"WrongRoleException: {exc}")
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def user_not_found_exception_handler(request: Request, exc: UserNotFoundException):
    logger.logger.error(f"UserNotFoundException: {exc}")
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def badge_not_found_exception_handler(request: Request, exc: BadgeNotFoundException):
    logger.logger.error(f"BadgeNotFoundException: {exc}")
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def badge_already_awarded_exception_handler(request: Request, exc: BadgeAlreadyAwardedException):
    logger.logger.error(f"BadgeAlreadyAwardedException: {exc}")
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})

def route_not_found_exception_handler(request: Request, exc: RouteNotFoundException):
    logger.logger.error(f"RouteNotFoundException: {exc}")
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]
    message = first_error["msg"]
    return JSONResponse(status_code=400, content={"message": message})


def register_auth_exception_handlers(app: FastAPI):
    exception_handlers = {
        WrongRoleException: wrong_role_exception_handler,
        RequestValidationError: validation_exception_handler,
        UserNotFoundException: user_not_found_exception_handler,
        BadgeNotFoundException: badge_not_found_exception_handler,
        BadgeAlreadyAwardedException: badge_already_awarded_exception_handler,
        RouteNotFoundException: route_not_found_exception_handler
    }

    for exc, handler in exception_handlers.items():
        app.add_exception_handler(exc, handler)
