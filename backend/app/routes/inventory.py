from fastapi import APIRouter, HTTPException
from typing import Optional
from app.schemas.voice import InventoryMutationRequest, InventoryQueryRequest, ApiResponse
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/api/inventory", tags=["Inventory Operations"])

@router.post("/mutate", response_model=ApiResponse)
def mutate_inventory(payload: InventoryMutationRequest):
    try:
        res = inventory_service.mutate_stock(
            action=payload.action,
            quantity=payload.quantity,
            product_id=payload.productId,
            product_name=payload.productName,
            unit=payload.unit,
            request_id=payload.requestId,
            source=payload.source,
            transcript=payload.transcript
        )
        return ApiResponse(
            success=True,
            message=res["message"],
            data=res
        )
    except ValueError as ve:
        err_msg = str(ve)
        err_code = "INSUFFICIENT_STOCK" if "Insufficient" in err_msg else "INVALID_MUTATION"
        return ApiResponse(
            success=False,
            message=err_msg,
            error={"code": err_code, "message": err_msg}
        )
    except Exception as e:
        return ApiResponse(
            success=False,
            message="Inventory operation failed",
            error={"code": "SERVER_ERROR", "message": str(e)}
        )

@router.get("/low-stock", response_model=ApiResponse)
def get_low_stock():
    items = inventory_service.get_low_stock_products()
    return ApiResponse(
        success=True,
        message=f"Found {len(items)} items requiring attention",
        data={"count": len(items), "items": items}
    )

@router.get("/stats", response_model=ApiResponse)
def get_stats():
    stats = inventory_service.get_dashboard_stats()
    return ApiResponse(success=True, message="Dashboard statistics retrieved", data=stats)

@router.post("/query", response_model=ApiResponse)
def query_inventory(payload: InventoryQueryRequest):
    try:
        q_type = payload.queryType.upper()
        if q_type == "LOW_STOCK" or q_type == "REORDER":
            items = inventory_service.get_low_stock_products()
            if not items:
                msg = "All inventory levels are healthy! No items need reordering."
            else:
                names = [f"{item['name']} ({item['quantity']} {item['unit']})" for item in items]
                msg = f"You have {len(items)} low stock item(s): " + ", ".join(names)
            return ApiResponse(success=True, message=msg, data={"items": items, "answer": msg})

        elif payload.productName:
            prod = inventory_service.find_product_by_name(payload.productName)
            if not prod:
                msg = f"Product '{payload.productName}' was not found in your inventory."
                return ApiResponse(success=False, message=msg, data={"product": None, "answer": msg})
            msg = f"You currently have {prod['quantity']} {prod['unit']} of {prod['name']} (Status: {prod['status']})."
            return ApiResponse(success=True, message=msg, data={"product": prod, "answer": msg})

        else:
            all_p = inventory_service.get_all_products()
            msg = f"Total catalog contains {len(all_p)} products."
            return ApiResponse(success=True, message=msg, data={"products": all_p, "answer": msg})

    except Exception as e:
        return ApiResponse(success=False, message="Failed to query inventory", error={"message": str(e)})

@router.post("/seed", response_model=ApiResponse)
def seed_database():
    stats = inventory_service.reseed_database()
    return ApiResponse(success=True, message="Database successfully re-seeded with 24 realistic demo items!", data=stats)
