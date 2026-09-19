import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional, Tuple
from app.database.mongodb import get_db_store
from app.utils.units import normalize_unit, are_units_compatible

class InventoryService:
    def __init__(self):
        self.db = get_db_store()

    def _calculate_status(self, quantity: float, threshold: float) -> str:
        if quantity == 0:
            return "Out of Stock"
        elif quantity <= threshold:
            return "Low Stock"
        return "Healthy"

    def get_all_products(self, query: Optional[str] = None, category: Optional[str] = None, status: Optional[str] = None) -> List[dict]:
        products = list(self.db.products.values())

        if query:
            q_lower = query.lower().strip()
            products = [p for p in products if q_lower in p["name"].lower() or q_lower in p["category"].lower()]

        if category and category != "All":
            products = [p for p in products if p.get("category", "").lower() == category.lower()]

        res = []
        for p in products:
            p_copy = dict(p)
            p_copy["id"] = p["_id"]
            p_copy["status"] = self._calculate_status(p_copy["quantity"], p_copy["lowStockThreshold"])
            res.append(p_copy)

        status_priority = {"Out of Stock": 0, "Low Stock": 1, "Healthy": 2}
        res.sort(key=lambda x: (status_priority.get(x["status"], 3), x["name"]))
        return res

    def get_product_by_id(self, product_id: str) -> Optional[dict]:
        p = self.db.products.get(product_id)
        if not p:
            return None
        p_copy = dict(p)
        p_copy["id"] = p["_id"]
        p_copy["status"] = self._calculate_status(p_copy["quantity"], p_copy["lowStockThreshold"])
        return p_copy

    def find_product_by_name(self, name: str) -> Optional[dict]:
        if not name:
            return None
        target = name.lower().strip()
        
        # 1. Exact name match
        for p in self.db.products.values():
            if p["normalizedName"] == target:
                return self.get_product_by_id(p["_id"])

        # 2. Exact word token match (e.g., target token "rice" exactly matches product "rice")
        for p in self.db.products.values():
            p_name = p["normalizedName"]
            if target == p_name:
                return self.get_product_by_id(p["_id"])

        # 3. Substring match
        for p in self.db.products.values():
            p_name = p["normalizedName"]
            if target in p_name:
                return self.get_product_by_id(p["_id"])

        # 4. Word overlap match (excluding generic terms)
        stopwords = {"super", "item", "pack", "brand", "good", "gold"}
        target_words = {w for w in target.split() if w not in stopwords}
        if target_words:
            for p in self.db.products.values():
                p_words = {w for w in p["normalizedName"].split() if w not in stopwords}
                if target_words.issubset(p_words) or p_words.issubset(target_words):
                    return self.get_product_by_id(p["_id"])

        return None

    def create_product(self, product_data: dict) -> dict:
        now = datetime.now(timezone.utc)
        pid = str(uuid.uuid4())
        norm_name = product_data["name"].lower().strip()

        # Check existing exact match
        for p in self.db.products.values():
            if p["normalizedName"] == norm_name:
                raise ValueError(f"Product '{product_data['name']}' already exists.")

        new_prod = {
            "_id": pid,
            "name": product_data["name"].strip(),
            "normalizedName": norm_name,
            "unit": normalize_unit(product_data.get("unit", "pcs")),
            "quantity": float(product_data.get("quantity", 0)),
            "lowStockThreshold": float(product_data.get("lowStockThreshold", 5)),
            "price": float(product_data.get("price", 0.0)),
            "category": product_data.get("category", "General"),
            "createdAt": now,
            "updatedAt": now
        }
        self.db.products[pid] = new_prod
        return self.get_product_by_id(pid)

    def update_product(self, product_id: str, update_data: dict) -> Optional[dict]:
        p = self.db.products.get(product_id)
        if not p:
            return None

        now = datetime.now(timezone.utc)
        for field in ["name", "unit", "quantity", "lowStockThreshold", "price", "category"]:
            if field in update_data and update_data[field] is not None:
                if field == "name":
                    p["name"] = update_data["name"].strip()
                    p["normalizedName"] = p["name"].lower()
                elif field == "unit":
                    p["unit"] = normalize_unit(update_data["unit"])
                elif field in ["quantity", "lowStockThreshold", "price"]:
                    p[field] = float(update_data[field])
                else:
                    p[field] = update_data[field]

        p["updatedAt"] = now
        return self.get_product_by_id(product_id)

    def delete_product(self, product_id: str) -> bool:
        if product_id in self.db.products:
            del self.db.products[product_id]
            return True
        return False

    def mutate_stock(
        self,
        action: str,
        quantity: float,
        product_id: Optional[str] = None,
        product_name: Optional[str] = None,
        unit: Optional[str] = None,
        request_id: Optional[str] = None,
        source: str = "VOICE",
        transcript: Optional[str] = None
    ) -> dict:
        if request_id and request_id in self.db.request_ids:
            raise ValueError(f"Duplicate request ID '{request_id}' ignored.")

        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero.")

        target_product = None
        if product_id:
            target_product = self.get_product_by_id(product_id)
        elif product_name:
            target_product = self.find_product_by_name(product_name)

        if not target_product:
            if action.upper().strip() == "ADD" and product_name:
                target_product = self.create_product({
                    "name": product_name.strip(),
                    "unit": unit or "pcs",
                    "quantity": 0,
                    "category": "General"
                })
            else:
                raise ValueError(f"Product '{product_name or product_id}' not found in inventory. Please add it first.")

        actual_unit = normalize_unit(unit) if unit else target_product["unit"]

        action = action.upper().strip()
        if action not in ["ADD", "REMOVE"]:
            raise ValueError("Action must be either ADD or REMOVE.")

        prev_qty = target_product["quantity"]

        if action == "REMOVE" and prev_qty < quantity:
            raise ValueError(
                f"Insufficient stock! Available: {prev_qty} {target_product['unit']}, requested removal: {quantity} {actual_unit}."
            )

        new_qty = prev_qty + quantity if action == "ADD" else prev_qty - quantity

        now = datetime.now(timezone.utc)
        raw_p = self.db.products[target_product["id"]]
        raw_p["quantity"] = new_qty
        raw_p["updatedAt"] = now

        tx_id = str(uuid.uuid4())
        tx_record = {
            "_id": tx_id,
            "productId": target_product["id"],
            "productName": target_product["name"],
            "action": action,
            "quantity": quantity,
            "unit": actual_unit,
            "previousQuantity": prev_qty,
            "newQuantity": new_qty,
            "source": source,
            "transcript": transcript or f"{action} {quantity} {actual_unit} of {target_product['name']}",
            "requestId": request_id or tx_id,
            "createdAt": now
        }
        self.db.transactions.insert(0, tx_record)
        if request_id:
            self.db.request_ids.add(request_id)

        updated_p = self.get_product_by_id(target_product["id"])
        
        status_message = (
            f"Successfully added {quantity} {actual_unit} of {target_product['name']}. Current stock: {new_qty} {target_product['unit']}."
            if action == "ADD"
            else f"Successfully removed {quantity} {actual_unit} of {target_product['name']}. Current stock: {new_qty} {target_product['unit']}."
        )

        return {
            "product": updated_p,
            "transaction": tx_record,
            "message": status_message
        }

    def get_low_stock_products(self) -> List[dict]:
        all_p = self.get_all_products()
        return [p for p in all_p if p["status"] in ["Low Stock", "Out of Stock"]]

    def get_transactions(self, limit: int = 20) -> List[dict]:
        res = []
        for t in self.db.transactions[:limit]:
            t_copy = dict(t)
            t_copy["id"] = t["_id"]
            res.append(t_copy)
        return res

    def get_dashboard_stats(self) -> dict:
        all_p = self.get_all_products()
        total_products = len(all_p)
        low_stock_count = sum(1 for p in all_p if p["status"] == "Low Stock")
        out_of_stock_count = sum(1 for p in all_p if p["status"] == "Out of Stock")
        today_movements = len(self.db.transactions)

        return {
            "totalProducts": total_products,
            "lowStockCount": low_stock_count,
            "outOfStockCount": out_of_stock_count,
            "todayMovements": today_movements,
            "lowStockItems": self.get_low_stock_products()[:5],
            "recentTransactions": self.get_transactions(5)
        }

    def reseed_database(self):
        self.db.reset_seed()
        return self.get_dashboard_stats()

inventory_service = InventoryService()
