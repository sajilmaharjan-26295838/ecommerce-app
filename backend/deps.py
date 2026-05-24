from fastapi import Header, HTTPException
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()
SECRET = os.getenv("JWT_SECRET")
if not SECRET:
    raise RuntimeError("JWT_SECRET environment variable is not set")

# _decode is a private helper so require_auth and require_admin share one decoding path
def _decode(authorization: str) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        return jwt.decode(authorization.split(" ")[1], SECRET, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def require_auth(authorization: str = Header(None)) -> dict:
    return _decode(authorization)

def require_admin(authorization: str = Header(None)) -> dict:
    payload = _decode(authorization)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload
