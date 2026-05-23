from fastapi import APIRouter, Depends, HTTPException
from database import db
from deps import require_admin
from bson import ObjectId

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

@router.patch("/users/{user_id}/toggle-status")
async def toggle_user_status(user_id: str, payload: dict = Depends(require_admin)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Prevent admin from deactivating their own account
    if user["email"] == payload["email"]:
        raise HTTPException(status_code=400, detail="You cannot change your own account status")
    new_status = not user.get("is_active", True)
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_active": new_status}})
    return {"msg": f"User {'activated' if new_status else 'deactivated'} successfully", "is_active": new_status}

@router.get("/carts")
async def get_all_carts(_=Depends(require_admin)):
    # Only return carts whose user_id matches an existing user (no orphaned carts)
    users = await db.users.find({}, {"email": 1}).to_list(100)
    valid_emails = {u["email"] for u in users}
    carts = await db.carts.find({"user_id": {"$in": list(valid_emails)}}).to_list(100)
    return [fix_id(c) for c in carts]