import re
from typing import List, Optional
from uuid import uuid4
from app.api.schemas import AdvisoryRequest, AdvisoryResponse, ActionCard
from app.common.schemas import SourceReference
from app.providers.llm import BaseLLMProvider
from app.retrieval.service import RetrievedChunk
from app.config import settings
from app.common.logging import log_advisory_decision

# Common Indian crops for auto-extraction from question text
KNOWN_CROPS = [
    "wheat", "rice", "paddy", "cotton", "sugarcane", "maize", "corn",
    "potato", "tomato", "onion", "soybean", "mustard", "groundnut",
    "chilli", "pepper", "brinjal", "eggplant", "okra", "bhindi",
    "mango", "banana", "grape", "pomegranate", "citrus", "lemon",
    "tea", "coffee", "jute", "turmeric", "ginger", "garlic",
    "chickpea", "chana", "lentil", "dal", "pigeon pea", "arhar",
    "bajra", "jowar", "ragi", "millet", "barley", "sunflower",
    "cauliflower", "cabbage", "spinach", "palak", "pea", "beans",
]

class AnswerService:
    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm = llm_provider

    @staticmethod
    def _extract_crop_from_question(question: str) -> Optional[str]:
        """Try to extract a crop name from the question text."""
        q_lower = question.lower()
        for crop in KNOWN_CROPS:
            # Match whole-word only to avoid false positives
            if re.search(rf'\b{re.escape(crop)}\b', q_lower):
                return crop.capitalize()
        return None

    def _generate_followup_if_missing_context(self, request: AdvisoryRequest) -> Optional[AdvisoryResponse]:
        """
        Ask for crop only if it's genuinely missing from both the request metadata
        AND the question text itself.
        """
        question_lower = request.question.lower()
        needs_context = any(w in question_lower for w in ["pesticide", "disease", "spray", "fertilizer"])
        
        if not needs_context:
            return None

        # Check if crop is already provided or can be extracted from question  
        crop = request.crop or self._extract_crop_from_question(request.question)
        if crop:
            return None  # Crop is known, no need to ask
        
        return AdvisoryResponse(
            answer_id=uuid4(),
            answer="To give you the most accurate advice, could you tell me which crop you are asking about? For example: wheat, rice, potato, tomato, etc.",
            detailed_explanation=None,
            confidence=1.0,
            risk_level="low",
            sources=[],
            action_cards=[ActionCard(type="ask_followup", label="Reply with Crop", payload={"required": "crop"})],
            abstained=False,
            language=request.language,
            warnings=[],
            escalated=False,
            prompt_version=settings.prompt_version,
            knowledge_version=settings.knowledge_version
        )
        return None

    def _compute_confidence(self, chunks: List[RetrievedChunk], llm_raw_score: float = 0.8) -> float:
        """Combine retrieval scores and LLM certainty to get final confidence."""
        if not chunks:
            return 0.1
        avg_chunk_score = sum(c.score for c in chunks) / len(chunks)
        return (avg_chunk_score * 0.6) + (llm_raw_score * 0.4)

    async def generate_advisory(self, request: AdvisoryRequest, chunks: List[RetrievedChunk], risk_level: str) -> AdvisoryResponse:
        
        # 1. Follow-up intercept
        followup = self._generate_followup_if_missing_context(request)
        if followup:
            log_advisory_decision(request.question, followup.answer, followup.confidence, risk_level, abstained=False)
            return followup

        # 2. Check for empty retrieval (Abstention)
        if not chunks:
            return AdvisoryResponse(
                answer_id=uuid4(),
                answer="I don't have enough grounded information in my knowledge base to answer this accurately. To ensure the health of your crops, please consult a verified KVK expert.",
                detailed_explanation=None,
                confidence=0.1,
                risk_level=risk_level,
                sources=[],
                action_cards=[ActionCard(type="escalate", label="Contact Support", payload={})],
                abstained=True,
                abstained_reason="No relevant knowledge chunks found.",
                language=request.language,
                warnings=["Non-grounded response prevented."],
                escalated=False,
                prompt_version=settings.prompt_version,
                knowledge_version=settings.knowledge_version
            )

        # 3. Prepare Context
        context_text = "\n\n".join([f"[{i+1}] {c.text}" for i, c in enumerate(chunks)])
        
        system_prompt = (
            "You are KRISHI-AI, a precision agricultural advisor for Indian farmers. "
            "Your advice MUST be strictly derived from the provided context. "
            "Cite sources as [1], [2], etc. inside your response. "
            "If the context doesn't contain a specific chemical dose, DO NOT guess it. "
            "Keep the tone professional, helpful, and focused on sustainable practices."
        )
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {request.question}"

        # 4. Call LLM (In demo/Phase 1 we simulate structured answer from context)
        if settings.environment == "development" or settings.llm_provider == "placeholder":
            source_content = chunks[0].text
            detected_crop = request.crop or self._extract_crop_from_question(request.question) or "your crop"
            
            answer_text = (
                f"**Situation**\n"
                f"You asked about \"{request.question}\" regarding {detected_crop}. "
                f"Based on {chunks[0].title} [1], here is the relevant guidance.\n\n"
                f"**Recommendation**\n"
                f"{source_content}\n\n"
            )
            if len(chunks) > 1:
                answer_text += (
                    f"**Action**\n"
                    f"Additionally, {chunks[1].title} [2] provides the following actionable steps "
                    f"for managing this in your field.\n\n"
                )
            answer_text += (
                f"**Safety Note**\n"
                f"Always verify chemical recommendations with your local KVK before application. "
                f"Wear proper protective equipment when spraying. If the condition persists or worsens, "
                f"consult a certified agronomist."
            )
        else:
            llm_resp = await self.llm.generate(user_prompt, system_prompt=system_prompt)
            answer_text = llm_resp.text
        
        # 4. Compute confidence (stubbed logic)
        confidence = self._compute_confidence(chunks)
        
        # 5. Abstention Check
        abstained = False
        abstained_reason = None
        action_cards = []
        
        if confidence < settings.abstention_threshold:
            abstained = True
            abstained_reason = f"Confidence {confidence:.2f} is below threshold {settings.abstention_threshold}."
            answer_text = "I'm not completely certain about the answer based on the current guidelines. To be safe, please consult an expert."
            action_cards.append(ActionCard(type="escalate", label="Contact Support", payload={}))

        # Formulate Response
        response = AdvisoryResponse(
            answer_id=uuid4(),
            answer=answer_text,
            detailed_explanation=None,
            confidence=confidence,
            risk_level=risk_level,
            sources=[
                SourceReference(
                    source_id=uuid4(), # fake for scaffold
                    title=c.title,
                    source_type="advisory",
                    relevance_score=c.score,
                    updated_date=c.metadata.get("updated_at")
                ) for c in chunks
            ],
            action_cards=action_cards,
            abstained=abstained,
            abstained_reason=abstained_reason,
            language=request.language,
            warnings=[],
            escalated=False,
            prompt_version=settings.prompt_version,
            knowledge_version=settings.knowledge_version
        )
        
        # Log decision
        log_advisory_decision(request.question, response.answer, response.confidence, risk_level, abstained, abstained_reason)
        
        return response
