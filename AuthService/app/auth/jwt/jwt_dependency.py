from fastapi import Depends, HTTPException, Request
from app.auth.jwt.jwt_bearer import jwtBearer
from app.auth.jwt.jwt_handler import decodeJWT

async def get_current_user(request: Request, token: str = Depends(jwtBearer())):
    payload = decodeJWT(token)
    if not payload:
        raise HTTPException(status_code=403, detail="Invalid or Expired Token!")
    return payload