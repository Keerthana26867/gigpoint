from pydantic import BaseModel, Field
from typing import Optional, List, Any

class VoiceParseRequest(BaseModel):
    transcript: str = Field(..., example="10 bags rice add karo")
    language: Optional[str] = "en-IN"

class ParsedIntent(BaseModel):
    intent: str  # STOCK_MUTATION | STOCK_QUERY | LOW_STOCK_QUERY | REORDER_QUERY | UNKNOWN
    action: Optional[str] = None  # ADD | REMOVE | null
    product: Optional[str] = None
    matchedProductId: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    price: Optional[float] = None
    needsClarification: bool = False
    clarificationMessage: Optional[str] = None
    rawTranscript: str

class InventoryMutationRequest(BaseModel):
    action: str  # ADD | REMOVE
    productId: Optional[str] = None
    productName: Optional[str] = None
    quantity: float = Field(..., gt=0)
    unit: Optional[str] = None
    price: Optional[float] = None
    requestId: Optional[str] = None
    source: str = "VOICE"
    transcript: Optional[str] = None

class InventoryQueryRequest(BaseModel):
    queryType: str  # QUANTITY_QUERY | LOW_STOCK | ALL_STOCK | REORDER
    productName: Optional[str] = None

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    error: Optional[dict] = None
