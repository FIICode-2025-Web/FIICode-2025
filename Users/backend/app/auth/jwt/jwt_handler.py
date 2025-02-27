import time

import jwt
from decouple import config

from app.auth.exceptions import WrongRoleException

JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")


def decodeJWT(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if decode_token["role"] == 0:
            raise WrongRoleException()

        return decode_token if decode_token["expiry"] >= time.time() else None
    except:
        return {}
