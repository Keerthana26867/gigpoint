from fastapi import APIRouter
from app.schemas.voice import VoiceParseRequest, ApiResponse
from app.services.parser_service import parser_service
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/api/voice", tags=["Voice AI Engine"])

@router.post("/parse", response_model=ApiResponse)
def parse_voice_transcript(payload: VoiceParseRequest):
    try:
        parsed_intent = parser_service.parse_transcript(payload.transcript)
        return ApiResponse(
            success=True,
            message="Transcript successfully parsed by Voice AI Engine",
            data=parsed_intent
        )
    except Exception as e:
        return ApiResponse(
            success=False,
            message="Failed to parse transcript",
            error={"code": "PARSE_ERROR", "message": str(e)}
        )

@router.post("/command", response_model=ApiResponse)
def process_voice_command(payload: VoiceParseRequest):
    """End-to-end handler for voice requests."""
    try:
        parsed = parser_service.parse_transcript(payload.transcript)
        intent = parsed.get("intent")

        if intent in ["STOCK_QUERY", "LOW_STOCK_QUERY", "REORDER_QUERY"]:
            prod_name = parsed.get("product")
            if intent == "LOW_STOCK_QUERY" or intent == "REORDER_QUERY":
                items = inventory_service.get_low_stock_products()
                if not items:
                    answer = "All your inventory levels are healthy! No items need reordering right now."
                else:
                    item_str = ", ".join([f"{item['name']} ({item['quantity']} {item['unit']})" for item in items[:5]])
                    answer = f"You have {len(items)} item(s) low on stock: {item_str}."
                return ApiResponse(
                    success=True,
                    message="Voice query answered",
                    data={
                        "type": "QUERY_RESPONSE",
                        "parsedIntent": parsed,
                        "answer": answer,
                        "audioResponseText": answer
                    }
                )
            elif prod_name:
                prod = inventory_service.find_product_by_name(prod_name)
                if prod:
                    answer = f"You currently have {prod['quantity']} {prod['unit']} of {prod['name']}."
                else:
                    answer = f"Product '{prod_name}' was not found in your inventory."
                return ApiResponse(
                    success=True,
                    message="Voice query answered",
                    data={
                        "type": "QUERY_RESPONSE",
                        "parsedIntent": parsed,
                        "answer": answer,
                        "audioResponseText": answer
                    }
                )
            else:
                all_p = inventory_service.get_all_products()
                answer = f"You have {len(all_p)} products in your inventory."
                return ApiResponse(
                    success=True,
                    message="Voice query answered",
                    data={
                        "type": "QUERY_RESPONSE",
                        "parsedIntent": parsed,
                        "answer": answer,
                        "audioResponseText": answer
                    }
                )

        elif intent == "STOCK_MUTATION":
            # Return confirmation payload for shopkeeper review
            return ApiResponse(
                success=True,
                message="Intent parsed. Please confirm the inventory update.",
                data={
                    "type": "CONFIRMATION_REQUIRED",
                    "parsedIntent": parsed,
                    "confirmationText": f"{'Add' if parsed.get('action') == 'ADD' else 'Remove'} {parsed.get('quantity')} {parsed.get('unit')} of {parsed.get('product')}?"
                }
            )

        else:
            return ApiResponse(
                success=False,
                message=parsed.get("clarificationMessage") or "Could not recognize command.",
                data={"type": "CLARIFICATION_REQUIRED", "parsedIntent": parsed}
            )

    except Exception as e:
        return ApiResponse(
            success=False,
            message="Error processing voice command",
            error={"code": "VOICE_COMMAND_ERROR", "message": str(e)}
        )
