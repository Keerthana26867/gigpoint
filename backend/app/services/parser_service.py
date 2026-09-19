import re
import json
import logging
from typing import Dict, Any, Optional
from app.config import settings
from app.utils.units import normalize_unit, UNIT_SYNONYMS
from app.services.inventory_service import inventory_service

logger = logging.getLogger("voicestock.parser")

class ParserService:
    """Multilingual AI & Rule-based NLP Intent Parser for Indian Small Business Inventory."""

    def parse_transcript(self, transcript: str) -> Dict[str, Any]:
        cleaned_transcript = transcript.strip()
        if not cleaned_transcript:
            return {
                "intent": "UNKNOWN",
                "action": None,
                "product": None,
                "quantity": None,
                "unit": None,
                "needsClarification": True,
                "clarificationMessage": "Sorry, I didn't hear any speech. Please try speaking again.",
                "rawTranscript": transcript
            }

        if settings.GEMINI_API_KEY:
            try:
                parsed = self._parse_with_gemini(cleaned_transcript)
                if parsed and parsed.get("intent") != "UNKNOWN":
                    return self._enrich_and_validate_parsed_result(parsed, cleaned_transcript)
            except Exception as e:
                logger.warning(f"Gemini API parse failed or unavailable, falling back to hybrid rule parser: {e}")

        parsed_rule = self._parse_with_rules(cleaned_transcript)
        return self._enrich_and_validate_parsed_result(parsed_rule, cleaned_transcript)

    def _parse_with_rules(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower().strip()

        # Basic mapping for Telugu script to English/Romanized for the rule parser
        telugu_script_map = {
            "రైస్": "rice", "బియ్యం": "rice",
            "పాలు": "milk",
            "గోధుమ": "wheat",
            "పంచదార": "sugar",
            "బిస్కెట్లు": "biscuits",
            "ఎన్ని": "how many", "ఎంత": "how much",
            "ఉన్నాయి": "are there", "ఉంది": "is there",
            "బ్యాగ్స్": "bags", "ప్యాకెట్లు": "packets", "కార్టన్": "carton", "కిలోలు": "kg",
            "జోడించు": "add", "కలుపు": "add", "వెయ్యి": "add",
            "తీసివేయి": "remove", "తగ్గించు": "remove", "అమ్ము": "sell",
            "స్టాక్": "stock", "తక్కువ": "low stock", "అయిపోయింది": "out of stock"
        }
        for te, en in telugu_script_map.items():
            text_lower = text_lower.replace(te, en)


        # 1. Low stock or reorder queries
        if any(kw in text_lower for kw in ["low stock", "kam stock", "stock kam", "reorder", "kya khatam", "kya kam", "which products are low", "products are low", "low products", "thakkuva stock", "aipothundi", "aipoindi"]):
            return {
                "intent": "LOW_STOCK_QUERY",
                "action": None,
                "product": None,
                "quantity": None,
                "unit": None,
                "needsClarification": False,
                "clarificationMessage": None,
                "rawTranscript": text
            }

        # 2. General stock list queries
        if any(kw in text_lower for kw in ["show stock", "all stock", "sara stock", "list stock", "sab stock", "inventory show", "stock chupinchu", "antha stock"]):
            return {
                "intent": "STOCK_QUERY",
                "action": None,
                "product": None,
                "quantity": None,
                "unit": None,
                "needsClarification": False,
                "clarificationMessage": None,
                "rawTranscript": text
            }

        # 3. Stock mutation keywords
        add_keywords = ["add", "jodo", "dalo", "le aao", "buy", "stock in", "laaya", "laaye", "bhejo", "plus", "kalupu", "vei", "chey", "techuko", "teeskura"]
        remove_keywords = ["hata", "hatao", "hatado", "remove", "becha", "sell", "minus", "nikalo", "nikal", "kam karo", "diya", "theesi", "theesey", "ammu", "theesivey", "tagginchu"]

        is_add = any(kw in text_lower for kw in add_keywords)
        is_remove = any(kw in text_lower for kw in remove_keywords)

        # 4. Quantity extraction
        qty_match = re.search(r'\b(\d+(?:\.\d+)?)\b', text_lower)
        extracted_qty = float(qty_match.group(1)) if qty_match else None

        # 5. Unit extraction
        extracted_unit = None
        for syn, std in UNIT_SYNONYMS.items():
            if re.search(r'\b' + re.escape(syn) + r'\b', text_lower):
                extracted_unit = std
                break

        # 6. Specific Stock Query
        is_query = any(kw in text_lower for kw in ["kitne", "kitna", "how much", "how many", "kya status", "batao", "check", "enni", "entha", "status enti", "cheppu"]) and not (is_add or is_remove)

        action = None
        if is_add and not is_remove:
            action = "ADD"
        elif is_remove and not is_add:
            action = "REMOVE"

        matched_product = self._match_product_from_text(text_lower)
        product_name = matched_product["name"] if matched_product else self._extract_fallback_product(text_lower)

        if is_query:
            return {
                "intent": "STOCK_QUERY",
                "action": None,
                "product": product_name,
                "matchedProductId": matched_product["id"] if matched_product else None,
                "quantity": None,
                "unit": extracted_unit,
                "needsClarification": False,
                "clarificationMessage": None,
                "rawTranscript": text
            }

        if action:
            intent_type = "STOCK_MUTATION"
            needs_clarification = False
            msg = None

            if not extracted_qty:
                needs_clarification = True
                msg = f"Please specify the quantity to {action.lower()} for {product_name or 'the product'}."

            return {
                "intent": intent_type,
                "action": action,
                "product": product_name,
                "matchedProductId": matched_product["id"] if matched_product else None,
                "quantity": extracted_qty,
                "unit": extracted_unit or (matched_product["unit"] if matched_product else "pcs"),
                "needsClarification": needs_clarification,
                "clarificationMessage": msg,
                "rawTranscript": text
            }

        if matched_product:
            return {
                "intent": "STOCK_QUERY",
                "action": None,
                "product": matched_product["name"],
                "matchedProductId": matched_product["id"],
                "quantity": None,
                "unit": matched_product["unit"],
                "needsClarification": False,
                "clarificationMessage": None,
                "rawTranscript": text
            }

        return {
            "intent": "UNKNOWN",
            "action": None,
            "product": None,
            "quantity": None,
            "unit": None,
            "needsClarification": True,
            "clarificationMessage": f"Could not understand request: '{text}'. Try saying '10 bags rice add karo' or 'Rice enni bags unnayi?'",
            "rawTranscript": text
        }

    def _match_product_from_text(self, text_lower: str) -> Optional[dict]:
        all_products = inventory_service.get_all_products()
        
        # First priority: Check exact word match in text (e.g., "rice" in "10 bags rice add karo")
        words_in_text = set(re.findall(r'\b[a-z0-9\-\']+\b', text_lower))
        for p in all_products:
            if p["normalizedName"] in words_in_text:
                return p

        # Second priority: Multi-word exact string match sorted by length
        all_products.sort(key=lambda p: len(p["name"]), reverse=True)
        for p in all_products:
            norm = p["normalizedName"]
            if norm in text_lower:
                return p
            
        # Third priority: Word token intersection
        for p in all_products:
            p_tokens = set(p["normalizedName"].split())
            if p_tokens.intersection(words_in_text):
                return p

        return None

    def _extract_fallback_product(self, text_lower: str) -> Optional[str]:
        words = text_lower.split()
        stopwords = {"add", "karo", "hata", "do", "hatao", "jodo", "kitne", "kitna", "hain", "hai", "ke", "ka", "ki", "mein", "stock", "bags", "carton", "cartons", "kg", "litres", "pcs", "piece", "pieces", "please", "item", "chey", "enni", "entha", "unnayi", "undi", "kavali", "kavala"}
        filtered = [w for w in words if not w.isdigit() and w not in stopwords]
        if filtered:
            return " ".join(filtered).title()
        return None

    def _parse_with_gemini(self, text: str) -> Optional[dict]:
        import httpx
        prompt = f"""
You are an expert NLP parser for an Indian shopkeeper inventory application.
Parse the following user spoken text: "{text}"

Output ONLY a valid JSON object matching this schema:
{{
  "intent": "STOCK_MUTATION" | "STOCK_QUERY" | "LOW_STOCK_QUERY" | "REORDER_QUERY" | "UNKNOWN",
  "action": "ADD" | "REMOVE" | null,
  "product": string or null,
  "quantity": number or null,
  "unit": string or null
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.LLM_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        with httpx.Client(timeout=5.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_output = data["candidates"][0]["content"]["parts"][0]["text"]
                clean_json = raw_output.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_json)
        return None

    def _enrich_and_validate_parsed_result(self, parsed: dict, text: str) -> dict:
        matched_prod = None
        if parsed.get("product"):
            matched_prod = inventory_service.find_product_by_name(parsed["product"])
            if matched_prod:
                parsed["matchedProductId"] = matched_prod["id"]
                parsed["product"] = matched_prod["name"]

        if parsed.get("unit"):
            parsed["unit"] = normalize_unit(parsed["unit"])
        elif matched_prod:
            parsed["unit"] = matched_prod["unit"]

        parsed["rawTranscript"] = text
        return parsed

parser_service = ParserService()
