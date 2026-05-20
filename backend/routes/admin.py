from fastapi import APIRouter, Depends
from database import db
from deps import require_admin

router = APIRouter()

def fix_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/users")
async def get_all_users(_=Depends(require_admin)):
    users = await db.users.find().to_list(100)
    result = []
    for u in users:
        u = fix_id(u)
        u.pop("password", None)
        result.append(u)
    return result

@router.get("/carts")
async def get_all_carts(_=Depends(require_admin)):
    carts = await db.carts.find().to_list(100)
    return [fix_id(c) for c in carts]