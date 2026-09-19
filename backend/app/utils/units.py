"""
Trade Unit Normalizer for Indian Small Business Context (English, Hinglish & Telugu)
"""

UNIT_SYNONYMS = {
    # Pieces
    "pcs": "pcs",
    "pc": "pcs",
    "piece": "pcs",
    "pieces": "pcs",
    "numpcs": "pcs",
    "nos": "pcs",
    "no": "pcs",
    "పిసిలు": "pcs",
    "పిసి": "pcs",
    "ముక్కలు": "pcs",
    
    # Weight - KG
    "kg": "kg",
    "kgs": "kg",
    "kilo": "kg",
    "kilos": "kg",
    "kilogram": "kg",
    "kilograms": "kg",
    "కిలోలు": "kg",
    "కిలో": "kg",
    "కేజీ": "kg",
    "కేజీలు": "kg",
    
    # Weight - Grams
    "gram": "grams",
    "grams": "grams",
    "gm": "grams",
    "gms": "grams",
    "g": "grams",
    "గ్రాములు": "grams",
    "గ్రాము": "grams",
    
    # Bags / Bori / Mootalu
    "bag": "bags",
    "bags": "bags",
    "bori": "bags",
    "boriya": "bags",
    "boriyan": "bags",
    "kattam": "bags",
    "మూటలు": "bags",
    "మూట": "bags",
    "సంచులు": "bags",
    "సంచు": "bags",
    "మూటల": "bags",
    
    # Cartons / Boxes / Peti
    "carton": "cartons",
    "cartons": "cartons",
    "box": "boxes",
    "boxes": "boxes",
    "peti": "cartons",
    "petti": "cartons",
    "dabba": "boxes",
    "dibba": "boxes",
    "కార్టన్లు": "cartons",
    "కార్టన్": "cartons",
    "పెట్టెలు": "boxes",
    "పెట్టె": "boxes",
    "డబ్బాలు": "boxes",

    # Dozens
    "dozen": "dozens",
    "dozens": "dozens",
    "darjan": "dozens",
    "darzen": "dozens",
    "డజన్లు": "dozens",
    "డజన్": "dozens",

    # Liquids - Litres
    "litre": "litres",
    "litres": "litres",
    "liter": "litres",
    "liters": "litres",
    "ltr": "litres",
    "ltrs": "litres",
    "l": "litres",
    "లీటర్లు": "litres",
    "లీటరు": "litres",
    "లీటర్": "litres",

    # Quintals
    "quintal": "quintals",
    "quintals": "quintals",
    "క్వింటాళ్ళు": "quintals",
    "క్వింటాల్": "quintals",

    # Packets
    "packet": "packets",
    "packets": "packets",
    "pkt": "packets",
    "pkts": "packets",
    "pack": "packets",
    "packs": "packets",
    "pouch": "packets",
    "pouches": "packets",
    "ప్యాకెట్లు": "packets",
    "ప్యాకెట్": "packets",

    # Bottles
    "bottle": "bottles",
    "bottles": "bottles",
    "బాటిళ్ళు": "bottles",
    "బాటిల్": "bottles",
    "సీసాలు": "bottles",
}

DEFAULT_UNITS = ["pcs", "kg", "grams", "bags", "cartons", "boxes", "dozens", "litres", "quintals", "packets", "bottles"]


def normalize_unit(unit_str: str) -> str:
    """Normalize user input or AI extracted unit to standard trade unit string."""
    if not unit_str:
        return "pcs"
    
    cleaned = unit_str.strip().lower()
    return UNIT_SYNONYMS.get(cleaned, cleaned)


def are_units_compatible(unit1: str, unit2: str) -> bool:
    """Check if two units are compatible or equivalent."""
    norm1 = normalize_unit(unit1)
    norm2 = normalize_unit(unit2)
    if norm1 == norm2:
        return True
    
    flex_groups = [
        {"cartons", "boxes"},
        {"pcs", "packets"},
        {"litres", "bottles"}
    ]
    for group in flex_groups:
        if norm1 in group and norm2 in group:
            return True
            
    return False
