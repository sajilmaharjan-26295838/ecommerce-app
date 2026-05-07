from fastapi import APIRouter, HTTPException
from database import db
from passlib.context import CryptContext
from jose import jwt
import os, datetime
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET = "mysecretkey123"

@router.post("/register")
async def register(data: dict):
    existing = await db.users.find_one({"email": data["email"]})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    data["password"] = pwd.hash(data["password"])
    if "role" not in data:
        data["role"] = "user"
    await db.users.insert_one(data)
    return {"msg": "Registered successfully"}

@router.post("/login")
async def login(data: dict):
    user = await db.users.find_one({"email": data["email"]})
    if not user or not pwd.verify(data["password"], user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode(
        {
            "sub": str(user["_id"]),
            "role": user["role"],
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        SECRET,
        algorithm="HS256"
    )
    return {"token": token, "role": user["role"]}