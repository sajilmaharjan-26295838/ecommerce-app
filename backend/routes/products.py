from fastapi import APIRouter, HTTPException, Depends
from database import db
from bson import ObjectId
from deps import require_admin

router = APIRouter()

def fix_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/")
async def get_products():
    products = await db.products.find().to_list(100)
    return [fix_id(p) for p in products]

@router.get("/{id}")
async def get_product(id: str):
    product = await db.products.find_one({"_id": ObjectId(id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return fix_id(product)

@router.post("/")
async def create_product(data: dict, _=Depends(require_admin)):
    if not data.get("name", "").strip():
        raise HTTPException(status_code=400, detail="Product name is required")
    if "price" in data:
        price = float(data["price"])
        if price < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")
        data["price"] = price
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}

@router.put("/{id}")
async def update_product(id: str, data: dict, _=Depends(require_admin)):
    if "price" in data:
        price = float(data["price"])
        if price < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")
        data["price"] = price
    await db.products.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"msg": "Product updated"}

@router.delete("/{id}")
async def delete_product(id: str, _=Depends(require_admin)):
    await db.products.delete_one({"_id": ObjectId(id)})
    return {"msg": "Product deleted"}
