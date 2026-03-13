from fastapi import APIRouter, Depends, Header, HTTPException
from typing import Any, Optional
from uuid import UUID
from app.api.schemas import AdvisoryRequest, AdvisoryResponse, FeedbackRequest, EscalationRequest, IngestRequest

router = APIRouter()

async def verify_internal_auth(
    x_user_id: Optional[str] = Header(None),
    x_farm_id: Optional[str] = Header(None)
):
    """
    Validates that the NestJS api-proxy has forwarded the user context.
    The api-proxy is the trust boundary for Auth.
    """
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header from proxy")
    return {"user_id": x_user_id, "farm_id": x_farm_id}

@router.post("/advisory/ask", response_model=AdvisoryResponse)
async def ask_advisory(
    request: AdvisoryRequest,
    context: dict = Depends(verify_internal_auth)
):
    """Main advisory endpoint with grounded RAG."""
    from app.providers.embedding import PlaceholderEmbeddingProvider
    from app.storage.repository import AdvisoryRepository
    from app.retrieval.service import RetrievalService
    from app.answer.service import AnswerService
    from app.providers.llm import PlaceholderLLMProvider
    from app.common.schemas import QueryEntities

    # Dependency injection
    repo = AdvisoryRepository()
    retriever = RetrievalService(PlaceholderEmbeddingProvider(), repo)
    answer_service = AnswerService(PlaceholderLLMProvider())

    # 1. Extract Query Entities
    entities = answer_service._extract_entities(request)

    # 2. Retrieve grounded evidence
    chunks = await retriever.retrieve(
        query=request.question,
        entities=entities
    )

    # 3. Risk classification
    risk_level = "low"
    high_risk_keywords = ["dose", "chemical", "toxic", "emergency", "poison"]
    if any(k in request.question.lower() for k in high_risk_keywords):
        risk_level = "high"

    # 4. Generate grounded advisory with validation guard
    response = await answer_service.generate_advisory(
        request=request,
        chunks=chunks,
        risk_level=risk_level,
        entities=entities
    )

    return response

@router.post("/advisory/feedback")
async def submit_feedback(
    request: FeedbackRequest,
    context: dict = Depends(verify_internal_auth)
):
    """Submit helpfulness feedback for an answer."""
    raise HTTPException(status_code=501, detail="Not implemented")

@router.post("/advisory/escalate")
async def escalate_question(
    request: EscalationRequest,
    context: dict = Depends(verify_internal_auth)
):
    """Escalate a low-confidence answer to human support."""
    raise HTTPException(status_code=501, detail="Not implemented")

@router.get("/advisory/history")
async def get_advisory_history(
    context: dict = Depends(verify_internal_auth)
):
    """Retrieve user's advisory interaction history."""
    raise HTTPException(status_code=501, detail="Not implemented")

@router.get("/advisory/sources/{source_id}")
async def get_source_detail(
    source_id: UUID,
    context: dict = Depends(verify_internal_auth)
):
    """Get metadata and content chunks for a specific knowledge source."""
    raise HTTPException(status_code=501, detail="Not implemented")

@router.post("/admin/ingest", tags=["Admin"])
async def trigger_ingest(
    request: IngestRequest,
    context: dict = Depends(verify_internal_auth)
):
    """Trigger the ingestion pipeline for a specific knowledge source."""
    raise HTTPException(status_code=501, detail="Not implemented")
