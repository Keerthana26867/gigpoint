import pytest
from app.services.inventory_service import inventory_service
from app.services.parser_service import parser_service
from app.utils.units import normalize_unit

def setup_function():
    inventory_service.reseed_database()

def test_unit_normalization():
    assert normalize_unit("pcs") == "pcs"
    assert normalize_unit("piece") == "pcs"
    assert normalize_unit("pieces") == "pcs"
    assert normalize_unit("kilos") == "kg"
    assert normalize_unit("kilogram") == "kg"
    assert normalize_unit("bori") == "bags"
    assert normalize_unit("carton") == "cartons"
    assert normalize_unit("litres") == "litres"

def test_add_stock():
    # Rice initial stock is 25
    rice = inventory_service.find_product_by_name("Rice")
    assert rice is not None
    initial_qty = rice["quantity"]

    res = inventory_service.mutate_stock(
        action="ADD",
        quantity=10,
        product_name="Rice",
        unit="bags"
    )
    assert res["product"]["quantity"] == initial_qty + 10

def test_remove_stock():
    # Biscuits initial stock is 3
    biscuits = inventory_service.find_product_by_name("Biscuits")
    assert biscuits is not None

    res = inventory_service.mutate_stock(
        action="REMOVE",
        quantity=2,
        product_name="Biscuits",
        unit="cartons"
    )
    assert res["product"]["quantity"] == 1

def test_negative_stock_prevention():
    with pytest.raises(ValueError, match="Insufficient stock"):
        inventory_service.mutate_stock(
            action="REMOVE",
            quantity=999,
            product_name="Rice",
            unit="bags"
        )

def test_unknown_product():
    with pytest.raises(ValueError, match="not found in inventory"):
        inventory_service.mutate_stock(
            action="ADD",
            quantity=5,
            product_name="Super Unknown Item 99",
            unit="pcs"
        )

def test_duplicate_request_prevention():
    req_id = "test-unique-req-123"
    inventory_service.mutate_stock(
        action="ADD",
        quantity=5,
        product_name="Sugar",
        unit="kg",
        request_id=req_id
    )
    with pytest.raises(ValueError, match="Duplicate request ID"):
        inventory_service.mutate_stock(
            action="ADD",
            quantity=5,
            product_name="Sugar",
            unit="kg",
            request_id=req_id
        )

def test_hinglish_parse_add():
    parsed = parser_service.parse_transcript("10 bags rice add karo")
    assert parsed["intent"] == "STOCK_MUTATION"
    assert parsed["action"] == "ADD"
    assert parsed["quantity"] == 10
    assert parsed["product"] == "Rice"
    assert parsed["unit"] == "bags"

def test_hinglish_parse_remove():
    parsed = parser_service.parse_transcript("5 carton biscuits hata do")
    assert parsed["intent"] == "STOCK_MUTATION"
    assert parsed["action"] == "REMOVE"
    assert parsed["quantity"] == 5
    assert parsed["product"] == "Biscuits"
    assert parsed["unit"] == "cartons"

def test_hinglish_parse_query():
    parsed = parser_service.parse_transcript("Rice ke kitne bags hain?")
    assert parsed["intent"] == "STOCK_QUERY"
    assert parsed["product"] == "Rice"

def test_low_stock_query_parse():
    parsed = parser_service.parse_transcript("Which products are low?")
    assert parsed["intent"] == "LOW_STOCK_QUERY"
