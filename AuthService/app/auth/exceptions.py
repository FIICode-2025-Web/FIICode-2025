from fastapi import HTTPException


class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail=f"User not found!")


class UserAlreadyExistsException(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail=f"User already exists!")


class InvalidCredentialsException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail=f"Invalid login details!")


class InvalidVerificationCodeException(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Invalid code")


class VerificationCodeAlreadyUsedException(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Code for this email already used")
