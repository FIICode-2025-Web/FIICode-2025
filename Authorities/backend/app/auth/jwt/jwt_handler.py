import time
import jwt
from decouple import config

JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")


def decodeJWT(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if decode_token["role"] == 1:
            raise Exception("Invalid Token Authority")
        return decode_token if decode_token["expiry"] >= time.time() else None
    except:
        return {}
