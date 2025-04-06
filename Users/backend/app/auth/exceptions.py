from fastapi import HTTPException

class WrongRoleException(HTTPException):
    def __init__(self):
        super().__init__(status_code=403, detail="You can't access this information with this type of account!")

class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="User not found!")

class BadgeNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Badge not found!")

class BadgeAlreadyAwardedException(HTTPException):
    def __init__(self):
        super().__init__(status_code=409, detail="Badge already awarded to user!")