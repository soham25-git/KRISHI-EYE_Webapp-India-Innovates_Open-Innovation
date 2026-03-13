import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from fastapi import HTTPException
from app.vision.service import VisionAnalysisService
from app.vision.routes import analyze_image

@pytest.fixture
def vision_service():
    service = VisionAnalysisService()
    service._initialized = True # Skip real initialization
    return service

@pytest.mark.asyncio
async def test_missing_onnxruntime_503():
    with patch("app.vision.routes.vision_service") as mock_service:
        mock_service.check_health.return_value = {
            "status": "missing_onnxruntime",
            "error": "Missing vision dependency: onnxruntime",
            "missing_onnxruntime": True
        }
        
        mock_file = MagicMock()
        mock_file.filename = "test.jpg"
        mock_file.content_type = "image/jpeg"
        mock_file.read = AsyncMock(return_value=b"A" * 200)
        
        with pytest.raises(HTTPException) as excinfo:
            await analyze_image(mock_file)
        
        assert excinfo.value.status_code == 503, f"Expected 503, got {excinfo.value.status_code}. Detail: {excinfo.value.detail}"
        assert "onnxruntime" in excinfo.value.detail

@pytest.mark.asyncio
async def test_missing_model_503():
    with patch("app.vision.routes.vision_service") as mock_service:
        mock_service.check_health.return_value = {
            "status": "unavailable_models",
            "error": "Critical vision models could not be loaded",
            "missing_onnxruntime": False
        }
        
        mock_file = MagicMock()
        mock_file.filename = "test.jpg"
        mock_file.content_type = "image/jpeg"
        mock_file.read = AsyncMock(return_value=b"A" * 200)
        
        with pytest.raises(HTTPException) as excinfo:
            await analyze_image(mock_file)
        
        assert excinfo.value.status_code == 503, f"Expected 503, got {excinfo.value.status_code}. Detail: {excinfo.value.detail}"
        assert "models" in excinfo.value.detail

@pytest.mark.asyncio
async def test_inference_failure_500():
    with patch("app.vision.routes.vision_service") as mock_service:
        mock_service.check_health.return_value = {"status": "ready"}
        # Mock provide a result with status: error to trigger the 500 in the route
        mock_service.analyze.side_effect = Exception("Runtime inference error")
        
        mock_file = MagicMock()
        mock_file.filename = "test.jpg"
        mock_file.content_type = "image/jpeg"
        mock_file.read = AsyncMock(return_value=b"A" * 200)
        
        with pytest.raises(HTTPException) as excinfo:
            await analyze_image(mock_file)
        
        assert excinfo.value.status_code == 500, f"Expected 500, got {excinfo.value.status_code}. Detail: {excinfo.value.detail}"
        assert "failed" in excinfo.value.detail.lower() or "runtime" in excinfo.value.detail.lower()

def test_service_health_logic():
    service = VisionAnalysisService()
    service._missing_onnxruntime = True
    health = service.check_health()
    assert health["status"] == "missing_onnxruntime"
    assert health["missing_onnxruntime"] is True
