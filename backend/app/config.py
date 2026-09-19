import os
from typing import List

class Settings:
    PROJECT_NAME: str = "VoiceStock AI - Inventory Management"
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "voicestock_db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("LLM_API_KEY", ""))
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-flash")
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "browser")  # browser | cloud | local
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

settings = Settings()
