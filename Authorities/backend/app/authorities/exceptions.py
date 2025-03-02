from fastapi import HTTPException

class CodeAlreadyGenerated(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Code for this email already exists")

class AccountAlreadyCreated(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Account already created")
