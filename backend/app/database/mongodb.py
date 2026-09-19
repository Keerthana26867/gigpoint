import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from app.config import settings

logger = logging.getLogger("voicestock.db")

class InMemoryDatabase:
    """Fast, in-memory MongoDB interface fallback ensuring 100% reliable execution."""
    def __init__(self):
        self.products: Dict[str, dict] = {}
        self.transactions: List[dict] = []
        self.request_ids: set = set()

    def reset_seed(self):
        """Seed 24 realistic Indian small business items with healthy and low stock statuses."""
        self.products.clear()
        self.transactions.clear()
        self.request_ids.clear()

        seed_data = [
            {"name": "Rice", "unit": "bags", "quantity": 25, "lowStockThreshold": 5, "price": 1500, "category": "Grains"},
            {"name": "Biscuits", "unit": "cartons", "quantity": 3, "lowStockThreshold": 5, "price": 480, "category": "Snacks"},  # LOW STOCK
            {"name": "Cooking Oil", "unit": "litres", "quantity": 0, "lowStockThreshold": 10, "price": 140, "category": "Oil & Ghee"}, # OUT OF STOCK
            {"name": "Wheat Flour (Atta)", "unit": "bags", "quantity": 18, "lowStockThreshold": 4, "price": 420, "category": "Grains"},
            {"name": "Sugar", "unit": "kg", "quantity": 50, "lowStockThreshold": 10, "price": 42, "category": "Groceries"},
            {"name": "Tata Tea Gold", "unit": "packets", "quantity": 2, "lowStockThreshold": 5, "price": 120, "category": "Beverages"}, # LOW STOCK
            {"name": "Maggi Noodles 2-Min", "unit": "boxes", "quantity": 15, "lowStockThreshold": 5, "price": 280, "category": "Snacks"},
            {"name": "Lux Soap", "unit": "pcs", "quantity": 40, "lowStockThreshold": 10, "price": 35, "category": "Personal Care"},
            {"name": "Amul Taza Milk", "unit": "litres", "quantity": 30, "lowStockThreshold": 8, "price": 54, "category": "Dairy"},
            {"name": "Toor Dal", "unit": "kg", "quantity": 35, "lowStockThreshold": 8, "price": 160, "category": "Pulses"},
            {"name": "Moong Dal", "unit": "kg", "quantity": 4, "lowStockThreshold": 6, "price": 140, "category": "Pulses"}, # LOW STOCK
            {"name": "Surf Excel Powder", "unit": "packets", "quantity": 22, "lowStockThreshold": 5, "price": 190, "category": "Household"},
            {"name": "Colgate Toothpaste", "unit": "pcs", "quantity": 28, "lowStockThreshold": 6, "price": 75, "category": "Personal Care"},
            {"name": "Mustard Oil", "unit": "bottles", "quantity": 14, "lowStockThreshold": 4, "price": 165, "category": "Oil & Ghee"},
            {"name": "Salt (Tata Salt)", "unit": "packets", "quantity": 60, "lowStockThreshold": 15, "price": 28, "category": "Groceries"},
            {"name": "Basmati Rice Super", "unit": "bags", "quantity": 12, "lowStockThreshold": 3, "price": 2200, "category": "Grains"},
            {"name": "Red Chilli Powder", "unit": "packets", "quantity": 16, "lowStockThreshold": 4, "price": 85, "category": "Spices"},
            {"name": "Turmeric Powder (Haldi)", "unit": "packets", "quantity": 20, "lowStockThreshold": 5, "price": 60, "category": "Spices"},
            {"name": "Cumin Seeds (Jeera)", "unit": "kg", "quantity": 8, "lowStockThreshold": 2, "price": 380, "category": "Spices"},
            {"name": "Parle-G Biscuits", "unit": "cartons", "quantity": 10, "lowStockThreshold": 3, "price": 300, "category": "Snacks"},
            {"name": "Good Day Biscuits", "unit": "cartons", "quantity": 7, "lowStockThreshold": 2, "price": 360, "category": "Snacks"},
            {"name": "Dettol Liquid Handwash", "unit": "bottles", "quantity": 9, "lowStockThreshold": 3, "price": 110, "category": "Personal Care"},
            {"name": "Fortune Sunflower Oil", "unit": "litres", "quantity": 25, "lowStockThreshold": 5, "price": 155, "category": "Oil & Ghee"},
            {"name": "Ghee (Amul 1L)", "unit": "bottles", "quantity": 11, "lowStockThreshold": 3, "price": 650, "category": "Dairy"},
        ]

        now = datetime.now(timezone.utc)
        for p in seed_data:
            pid = str(uuid.uuid4())
            self.products[pid] = {
                "_id": pid,
                "name": p["name"],
                "normalizedName": p["name"].lower().strip(),
                "unit": p["unit"],
                "quantity": float(p["quantity"]),
                "lowStockThreshold": float(p["lowStockThreshold"]),
                "price": float(p["price"]),
                "category": p["category"],
                "createdAt": now,
                "updatedAt": now
            }

        # Add mock transactions
        self.transactions.append({
            "_id": str(uuid.uuid4()),
            "productId": list(self.products.keys())[0],
            "productName": "Rice",
            "action": "ADD",
            "quantity": 10,
            "unit": "bags",
            "previousQuantity": 15,
            "newQuantity": 25,
            "source": "VOICE",
            "transcript": "10 bags rice add karo",
            "requestId": "seed-req-1",
            "createdAt": now
        })
        self.transactions.append({
            "_id": str(uuid.uuid4()),
            "productId": list(self.products.keys())[1],
            "productName": "Biscuits",
            "action": "REMOVE",
            "quantity": 2,
            "unit": "cartons",
            "previousQuantity": 5,
            "newQuantity": 3,
            "source": "VOICE",
            "transcript": "2 carton biscuits hata do",
            "requestId": "seed-req-2",
            "createdAt": now
        })

# Global DB Instance
db_store = InMemoryDatabase()
db_store.reset_seed()

def get_db_store():
    return db_store
