import pytest
from app.api.schemas import AdvisoryRequest
from app.answer.service import AnswerService
from app.retrieval.service import RetrievalService
from app.providers.llm import PlaceholderLLMProvider
from app.providers.embedding import PlaceholderEmbeddingProvider
from app.storage.repository import AdvisoryRepository
from uuid import uuid4

@pytest.fixture
def services():
    repo = AdvisoryRepository()
    retriever = RetrievalService(PlaceholderEmbeddingProvider(), repo)
    answer_service = AnswerService(PlaceholderLLMProvider())
    return retriever, answer_service

@pytest.mark.asyncio
async def test_sugarcane_maharashtra_abstention(services):
    retriever, answer_service = services
    request = AdvisoryRequest(
        question="sugarcane related infections in Maharashtra",
        user_id=uuid4(),
        language="en"
    )
    
    entities = answer_service._extract_entities(request)
    assert entities.crop == "Sugarcane"
    assert entities.geography == "Maharashtra"
    
    chunks = await retriever.retrieve(request.question, entities)
    # Sugarcane is not in the demo_knowledge.json, so it should be filtered or empty
    response = await answer_service.generate_advisory(request, chunks, "low", entities)
    
    assert response.abstained is True
    assert response.abstained_reason == "CROP_MISMATCH"
    assert "sugarcane" in response.answer.lower()
    assert "Maharashtra" in response.answer
    assert "red rot" in response.answer # Suggested follow-up text

@pytest.mark.asyncio
async def test_wheat_pesticides_grounded(services):
    retriever, answer_service = services
    request = AdvisoryRequest(
        question="What are the best wheat pesticides?",
        user_id=uuid4(),
        language="en"
    )
    
    entities = answer_service._extract_entities(request)
    assert entities.crop == "Wheat"
    
    chunks = await retriever.retrieve(request.question, entities)
    assert len(chunks) > 0
    assert chunks[0].crop == "wheat"
    
    response = await answer_service.generate_advisory(request, chunks, "low", entities)
    assert response.abstained is False
    assert "Wheat" in response.answer
    assert "[1]" in response.answer

@pytest.mark.asyncio
async def test_cotton_pink_bollworm_unsupported_abstention(services):
    # Cotton is not in demo_knowledge.json
    retriever, answer_service = services
    request = AdvisoryRequest(
        question="How to control cotton pink bollworm?",
        user_id=uuid4(),
        language="en"
    )
    
    entities = answer_service._extract_entities(request)
    chunks = await retriever.retrieve(request.question, entities)
    response = await answer_service.generate_advisory(request, chunks, "low", entities)
    
    assert response.abstained is True
    assert response.abstained_reason == "CROP_MISMATCH"

@pytest.mark.asyncio
async def test_maize_fall_armyworm_unsupported_abstention(services):
    # Maize is not in demo_knowledge.json
    retriever, answer_service = services
    request = AdvisoryRequest(
        question="maize fall armyworm treatment",
        user_id=uuid4(),
        language="en"
    )
    
    entities = answer_service._extract_entities(request)
    chunks = await retriever.retrieve(request.question, entities)
    response = await answer_service.generate_advisory(request, chunks, "low", entities)
    
    assert response.abstained is True

@pytest.mark.asyncio
async def test_location_specific_no_source(services):
    # Query for Kerala rice (KB has National rice)
    retriever, answer_service = services
    request = AdvisoryRequest(
        question="rice blast in Kerala",
        user_id=uuid4(),
        language="en"
    )
    
    entities = answer_service._extract_entities(request)
    assert entities.geography == "Kerala"
    
    chunks = await retriever.retrieve(request.question, entities)
    response = await answer_service.generate_advisory(request, chunks, "low", entities)
    
    # KB has National rice blast, so it should answer but maybe warn?
    # Our logic says we abstain if crop mismatch, but rice matches.
    assert response.abstained is False
    assert any("Kerala" in w for w in response.warnings)

@pytest.mark.asyncio
async def test_regression_no_cross_crop(services):
    # Sugarcane query should NEVER have wheat sources
    retriever, answer_service = services
    request = AdvisoryRequest(
        question="sugarcane diseases",
        user_id=uuid4(),
        language="en"
    )
    
    entities = answer_service._extract_entities(request)
    chunks = await retriever.retrieve(request.question, entities)
    
    # Verify chunks do not contain wheat
    for c in chunks:
        assert c.crop != "wheat"
    
    response = await answer_service.generate_advisory(request, chunks, "low", entities)
    assert response.abstained is True
    assert "wheat" not in response.answer.lower()
