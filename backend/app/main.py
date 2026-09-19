from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import products, inventory, voice, transactions
from app.schemas.voice import ApiResponse

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Voice-Based Inventory Management Backend API for Small Businesses",
    version="1.0.0"
)

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(voice.router)
app.include_router(transactions.router)

@app.get("/api/health", response_model=ApiResponse)
def health_check():
    return ApiResponse(
        success=True,
        message="VoiceStock AI Backend is healthy and operational",
        data={
            "status": "online",
            "stt_provider": settings.STT_PROVIDER,
            "llm_configured": bool(settings.GEMINI_API_KEY)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
