from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.config import settings

class SpeechProvider(ABC):
    @abstractmethod
    def transcribe_audio(self, audio_bytes: bytes, language: str = "en-IN") -> str:
        """Transcribe raw audio bytes into text."""
        pass

class BrowserSpeechProvider(SpeechProvider):
    """Browser native SpeechRecognition API provider (Default & zero latency)."""
    def transcribe_audio(self, audio_bytes: bytes, language: str = "en-IN") -> str:
        # Browser handles STT client-side, text transcript is passed directly
        return ""

class CloudSpeechProvider(SpeechProvider):
    """Cloud ASR provider implementation placeholder."""
    def transcribe_audio(self, audio_bytes: bytes, language: str = "en-IN") -> str:
        # Placeholder for Cloud ASR integration (Whisper Cloud / Google Cloud Speech)
        return "10 bags rice add karo"

class LocalSpeechProvider(SpeechProvider):
    """Local ASR provider implementation placeholder (e.g. Faster-Whisper local)."""
    def transcribe_audio(self, audio_bytes: bytes, language: str = "en-IN") -> str:
        return "5 carton biscuits hata do"

def get_speech_provider() -> SpeechProvider:
    provider = settings.STT_PROVIDER.lower()
    if provider == "cloud":
        return CloudSpeechProvider()
    elif provider == "local":
        return LocalSpeechProvider()
    return BrowserSpeechProvider()
