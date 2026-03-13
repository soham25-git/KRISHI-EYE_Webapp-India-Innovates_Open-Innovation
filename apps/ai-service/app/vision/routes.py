"""Vision analysis API routes."""

from fastapi import APIRouter, File, UploadFile, HTTPException
from app.vision.service import vision_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/vision", tags=["Vision Analysis"])

# Allowed MIME types and max file size
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze a plant leaf image for disease detection.
    
    Accepts JPEG, PNG, or WebP images up to 10MB.
    Returns classification, segmentation overlay, and advisory.
    """
    # 1. Readiness Check
    health = vision_service.check_health()
    if health["status"] != "ready":
        # 503 for deployment/dependency issues, 500 for other readiness failures
        status_code = 503 if health["status"] in ["unavailable_deps", "missing_onnxruntime", "unavailable_models"] else 500
        raise HTTPException(
            status_code=status_code,
            detail=health["error"] or "Vision AI service is currently unavailable."
        )

    # 2. Validate MIME type
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {content_type}. Accepted: JPEG, PNG, WebP."
        )

    # 3. Read and validate size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, # Payload Too Large
            detail=f"File too large ({len(image_bytes) // 1024 // 1024}MB). Maximum: 10MB."
        )

    if len(image_bytes) < 100:
        raise HTTPException(
            status_code=400,
            detail="File appears empty or corrupted."
        )

    logger.info(f"Analyzing image: {file.filename} ({len(image_bytes)} bytes, {content_type})")

    try:
        result = await vision_service.analyze(image_bytes, filename=file.filename or "")
        
        # Ensure we don't return 200 for internal error status
        if result.get("status") == "error":
             raise HTTPException(status_code=500, detail=result.get("message", "Inference failure"))
             
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vision analysis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Image analysis failed. Please try again with a different image."
        )
