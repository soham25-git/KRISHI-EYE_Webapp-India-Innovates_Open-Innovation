from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from contextlib import asynccontextmanager
import logging

# Set up root logger for startup
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB pools, check provider connections
    logger.info("Starting AI Advisory Service...")
    yield
    # Shutdown: Clean up resources
    logger.info("Shutting down AI Advisory Service...")

app = FastAPI(
    title="AI Advisory Service",
    description="Grounded agricultural advisory service with swappable providers and explicitly safe fallback mechanisms.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure api routes are mounted (we will import them after they are created)
from app.api.routes import router as api_router
app.include_router(api_router)

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint mapping to orchestrator and CI requirements."""
    return {"status": "ok", "environment": settings.environment}
