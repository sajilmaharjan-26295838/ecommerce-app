from fastapi import APIRouter, HTTPException, Depends
from database import db
from bson import ObjectId
from deps import require_auth

router = APIRouter()

def fix_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/{user_id}")
async def get_cart(user_id: str, _=Depends(require_auth)):
    cart = await db.carts.find_one({"user_id": user_id})
    if not cart:
        return {"user_id": user_id, "items": []}
    return fix_id(cart)

@router.post("/{user_id}/add")
async def add_to_cart(user_id: str, item: dict, payload: dict = Depends(require_auth)):
    if payload.get("role") == "admin":
        raise HTTPException(status_code=403, detail="Admins cannot add items to cart")
    cart = await db.carts.find_one({"user_id": user_id})
    if not cart:
        await db.carts.insert_one({"user_id": user_id, "items": [item]})
    else:
        existing = next((i for i in cart["items"] if i["product_id"] == item["product_id"]), None)
        if existing:
            await db.carts.update_one(
                {"user_id": user_id, "items.product_id": item["product_id"]},
                {"$inc": {"items.$.quantity": item["quantity"]}}
            )
        else:
            await db.carts.update_one(
                {"user_id": user_id},
                {"$push": {"items": item}}
            )
    return {"msg": "Item added to cart"}

@router.put("/{user_id}/update/{product_id}")
async def update_quantity(user_id: str, product_id: str, data: dict, _=Depends(require_auth)):
    quantity = int(data.get("quantity", 1))
    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")
    await db.carts.update_one(
        {"user_id": user_id, "items.product_id": product_id},
        {"$set": {"items.$.quantity": quantity}}
    )
    return {"msg": "Quantity updated"}

@router.delete("/{user_id}/remove/{product_id}")
async def remove_from_cart(user_id: str, product_id: str, _=Depends(require_auth)):
    await db.carts.update_one(
        {"user_id": user_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    return {"msg": "Item removed"}

@router.delete("/{user_id}/clear")
async def clear_cart(user_id: str, _=Depends(require_auth)):
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": {"items": []}}
    )
    return {"msg": "Cart cleared"}
        