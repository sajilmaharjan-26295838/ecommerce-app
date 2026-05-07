from fastapi import APIRouter
from database import db

router = APIRouter()

def fix_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/users")
async def get_all_users():
    users = await db.users.find().to_list(100)
    for u in users:
        fix_id(u)
        u.pop("password", None)
    return users

@router.get("/carts")
async def get_all_carts():
    carts = await db.carts.find().to_list(100)
    return [fix_id(c) for c in carts]