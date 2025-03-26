from fastapi import HTTPException

class WrongRoleException(HTTPException):
    def __init__(self):
        super().__init__(status_code=403, detail="You can't access this information with this type of account!")