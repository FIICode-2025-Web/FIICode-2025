from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.authorities.exceptions import CodeAlreadyGenerated, AccountAlreadyCreated


def code_already_generated_exception_handler(request: Request, exc: CodeAlreadyGenerated):
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})

def account_already_created_exception_handler(request: Request, exc: AccountAlreadyCreated):
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})

def register_auth_exception_handlers(app: FastAPI):
    exception_handlers = {
        CodeAlreadyGenerated: code_already_generated_exception_handler,
        AccountAlreadyCreated: account_already_created_exception_handler
    }

    for exc, handler in exception_handlers.items():
        app.add_exception_handler(exc, handler)
