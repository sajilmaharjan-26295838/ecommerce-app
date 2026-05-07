from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId

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
async def create_product(data: dict):
    result = await db.products.insert_one(data)
    return {"id": str(result.inserted_id)}

@router.put("/{id}")
async def update_product(id: str, data: dict):
    await db.products.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"msg": "Product updated"}

@router.delete("/{id}")
async def delete_product(id: str):
    await db.products.delete_one({"_id": ObjectId(id)})
    return {"msg": "Product deleted"}
