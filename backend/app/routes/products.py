from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.voice import ApiResponse
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=ApiResponse)
def get_products(
    query: Optional[str] = Query(None, description="Search term for product name or category"),
    category: Optional[str] = Query(None, description="Category filter"),
    status: Optional[str] = Query(None, description="Status filter (Healthy | Low Stock | Out of Stock)")
):
    try:
        products = inventory_service.get_all_products(query=query, category=category, status=status)
        if status:
            products = [p for p in products if p["status"].lower() == status.lower()]
        return ApiResponse(success=True, message=f"Retrieved {len(products)} products", data=products)
    except Exception as e:
        return ApiResponse(success=False, message="Failed to fetch products", error={"message": str(e)})

@router.get("/{product_id}", response_model=ApiResponse)
def get_product(product_id: str):
    product = inventory_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ApiResponse(success=True, message="Product retrieved", data=product)

@router.post("", response_model=ApiResponse, status_code=201)
def create_product(payload: ProductCreate):
    try:
        new_prod = inventory_service.create_product(payload.model_dump())
        return ApiResponse(success=True, message=f"Product '{new_prod['name']}' created successfully", data=new_prod)
    except ValueError as ve:
        return ApiResponse(success=False, message=str(ve), error={"code": "DUPLICATE_PRODUCT", "message": str(ve)})
    except Exception as e:
        return ApiResponse(success=False, message="Failed to create product", error={"message": str(e)})

@router.patch("/{product_id}", response_model=ApiResponse)
def update_product(product_id: str, payload: ProductUpdate):
    try:
        updated = inventory_service.update_product(product_id, payload.model_dump(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail="Product not found")
        return ApiResponse(success=True, message=f"Product '{updated['name']}' updated successfully", data=updated)
    except Exception as e:
        return ApiResponse(success=False, message="Failed to update product", error={"message": str(e)})

@router.delete("/{product_id}", response_model=ApiResponse)
def delete_product(product_id: str):
    success = inventory_service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return ApiResponse(success=True, message="Product deleted successfully", data={"id": product_id})
