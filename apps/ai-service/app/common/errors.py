from fastapi import HTTPException

class AdvisoryError(Exception):
    """Base exception for AI Advisory service"""
    pass

class LowConfidenceError(AdvisoryError):
    def __init__(self, message: str, score: float, abstained_reason: str):
        self.message = message
        self.score = score
        self.abstained_reason = abstained_reason
        super().__init__(self.message)

class ModerationError(AdvisoryError):
    def __init__(self, message: str, risk_level: str, category: str):
        self.message = message
        self.risk_level = risk_level
        self.category = category
        super().__init__(self.message)

class ProviderError(AdvisoryError):
    """Raised when an external LLM, Reranker, or Embedding provider fails."""
    pass

class PromptInjectionError(ModerationError):
    """Raised when explicit prompt injection patterns are detected."""
    pass

def add_exception_handlers(app):
    # This will be registered in main.py if needed, 
    # to convert these domain errors into the appropriate FastAPI HTTPExceptions
    @app.exception_handler(ProviderError)
    async def provider_error_handler(request, exc):
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=502, content={"detail": str(exc), "code": "PROVIDER_ERROR"})
