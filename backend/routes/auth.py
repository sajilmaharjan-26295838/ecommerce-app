from fastapi import APIRouter, HTTPException, Depends
from database import db
from passlib.context import CryptContext
from jose import jwt
import os, datetime
from dotenv import load_dotenv
from deps import require_auth

load_dotenv()

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET = os.getenv("JWT_SECRET", "mysecretkey123")

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

@router.get("/profile")
async def get_profile(payload: dict = Depends(require_auth)):
    user = await db.users.find_one({"email": payload["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"name": user["name"], "email": user["email"], "role": user["role"]}

@router.put("/profile")
async def update_profile(data: dict, payload: dict = Depends(require_auth)):
    user = await db.users.find_one({"email": payload["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    updates = {}

    if "name" in data and data["name"].strip():
        updates["name"] = data["name"].strip()

    if "new_password" in data and data["new_password"]:
        if not data.get("current_password"):
            raise HTTPException(status_code=400, detail="Current password is required")
        if not pwd.verify(data["current_password"], user["password"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        updates["password"] = pwd.hash(data["new_password"])

    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update")

    await db.users.update_one({"email": payload["email"]}, {"$set": updates})
    return {"msg": "Profile updated successfully"}