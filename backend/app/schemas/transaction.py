from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    productId: str
    productName: str
    action: str  # ADD | REMOVE
    quantity: float
    unit: str
    previousQuantity: float
    newQuantity: float
    source: str = "VOICE"  # VOICE | MANUAL
    transcript: Optional[str] = None
    requestId: Optional[str] = None

class TransactionResponse(TransactionCreate):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True
