import time
import jwt
from decouple import config

JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")


def token_response(token: str):
    return {
        "token": token
    }


def signJWT(email: str, id: int, user_role: int):
    payload = {
        "email": email,
        "id": id,
        "role": user_role,
        "expiry": time.time() + 3600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)


def decodeJWT(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decode_token if decode_token["expiry"] >= time.time() else None
    except:
        return {}
