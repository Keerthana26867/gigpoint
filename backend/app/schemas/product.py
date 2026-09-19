from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., example="Rice")
    unit: str = Field(..., example="bags")
    quantity: float = Field(default=0, ge=0)
    lowStockThreshold: float = Field(default=5, ge=0)
    price: Optional[float] = Field(default=0.0, ge=0)
    category: Optional[str] = Field(default="General")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[float] = Field(default=None, ge=0)
    lowStockThreshold: Optional[float] = Field(default=None, ge=0)
    price: Optional[float] = Field(default=None, ge=0)
    category: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    normalizedName: str
    status: str  # Healthy | Low Stock | Out of Stock
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
