from fastapi import APIRouter, Query
from app.schemas.voice import ApiResponse
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("", response_model=ApiResponse)
def get_transactions(limit: int = Query(20, ge=1, le=100)):
    txs = inventory_service.get_transactions(limit=limit)
    return ApiResponse(
        success=True,
        message=f"Retrieved {len(txs)} recent transactions",
        data=txs
    )
