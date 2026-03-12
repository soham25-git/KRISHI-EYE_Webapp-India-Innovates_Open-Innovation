import pytest
from uuid import uuid4
from app.answer.service import AnswerService
from app.providers.llm import PlaceholderLLMProvider
from app.api.schemas import AdvisoryRequest
from app.retrieval.service import RetrievedChunk

@pytest.mark.asyncio
async def test_answer_generation():
    service = AnswerService(PlaceholderLLMProvider())
    req = AdvisoryRequest(question="When do I harvest?", user_id=uuid4(), crop="wheat")
    chunks = [RetrievedChunk(text="Harvest in May.", source_id=str(uuid4()), title="Guide", score=0.9)]
    
    response = await service.generate_advisory(req, chunks, risk_level="low")
    
    assert response.confidence > 0.6
    assert response.abstained is False
    assert len(response.sources) == 1

@pytest.mark.asyncio
async def test_answer_missing_context_followup():
    service = AnswerService(PlaceholderLLMProvider())
    # Asks about pesticide without specifying a crop
    req = AdvisoryRequest(question="What pesticide should I use?", user_id=uuid4())
    chunks = []
    
    response = await service.generate_advisory(req, chunks, risk_level="medium")
    
    assert "which crop" in response.answer.lower()
    assert response.action_cards[0].type == "ask_followup"
