from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import decodeJWT


class jwtBearer(HTTPBearer):
    def __init__(self, auth_Error: bool = True):
        super(jwtBearer, self).__init__(auto_error=auth_Error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(jwtBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid or Expired Token!")
            token = credentials.credentials
            isTokenValid = self.verify_jwt(token)
            if not isTokenValid:
                raise HTTPException(status_code=403, detail="Invalid or Expired Token!")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid or Expired Token!")

    def verify_jwt(self, jwttoken: str):
        isTokenValid: bool = False
        payload = decodeJWT(jwttoken)
        if payload:
            isTokenValid = True
        return isTokenValid
