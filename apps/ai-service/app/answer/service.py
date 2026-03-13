import re
from typing import List, Optional
from uuid import uuid4
from app.api.schemas import AdvisoryRequest, AdvisoryResponse, ActionCard
from app.common.schemas import SourceReference, QueryEntities
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

KNOWN_GEOGRAPHIES = [
    "maharashtra", "punjab", "haryana", "uttar pradesh", "up", "rajasthan",
    "gujarat", "karnataka", "tamil nadu", "andhra pradesh", "telangana",
    "madhya pradesh", "mp", "bihar", "west bengal", "odisha", "kerala",
    "assam", "himachal pradesh", "vidarbha", "marathwada"
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

    def _extract_entities(self, request: AdvisoryRequest) -> QueryEntities:
        """Extract crop, geography, and intent from question and request."""
        q_lower = request.question.lower()
        
        # 1. Crop Extraction
        crop = request.crop or self._extract_crop_from_question(request.question)
        
        # 2. Geography Extraction
        geography = request.district or None
        if not geography:
            for geo in KNOWN_GEOGRAPHIES:
                if re.search(rf'\b{re.escape(geo)}\b', q_lower):
                    geography = geo.capitalize()
                    break
        
        # 3. Intent & Context
        is_treatment = any(w in q_lower for w in ["pesticide", "fungicide", "spray", "dose", "control", "treatment", "medicine", "apply", "remedy"])
        is_disease = any(w in q_lower for w in ["infection", "disease", "rust", "rot", "blight", "spot", "pest", "worm", "aphid", "blast", "smut"])
        
        return QueryEntities(
            crop=crop,
            geography=geography,
            intent="treatment" if is_treatment else "info",
            pest_or_disease_context=request.question if is_disease else None,
            treatment_intent=is_treatment,
            is_location_specific=geography is not None
        )

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

    async def generate_advisory(self, request: AdvisoryRequest, chunks: List[RetrievedChunk], risk_level: str, entities: QueryEntities) -> AdvisoryResponse:
        
        # 1. Follow-up intercept
        followup = self._generate_followup_if_missing_context(request)
        if followup:
            log_advisory_decision(request.question, followup.answer, followup.confidence, risk_level, abstained=False)
            return followup

        crop = entities.crop
        geography = entities.geography

        # 2. Check for empty retrieval or Crop Mismatch (Abstention)
        # S-03: Final Validation Guard
        # If user specified a crop, at least one top chunk MUST be for that crop.
        crop_matched_sources = [c for c in chunks if c.crop and crop and c.crop.lower() == crop.lower()]
        
        abstained = False
        abstained_reason = None
        warnings = []
        action_cards = []

        if crop and not crop_matched_sources:
            # If we retrieved chunks but none match the specific crop requested
            # OR if we retrieved nothing but the user asked about a crop
            abstained = True
            abstained_reason = "CROP_MISMATCH"
        elif not chunks:
            abstained = True
            abstained_reason = "No relevant knowledge chunks found."
        
        # Location-specific warning
        if not abstained and entities.is_location_specific:
            geo_matched = any(geography.lower() in (c.state or "").lower() for c in chunks)
            if not geo_matched:
                # If no regional source found, we warn the user
                warnings.append(f"No specific guidance found for {geography}. General recommendations applied.")

        if abstained:
            answer_text = f"I couldn’t find grounded guidance for {crop or 'your crop'} {f'in {geography}' if geography else ''} from the current knowledge base."
            if abstained_reason == "CROP_MISMATCH":
                answer_text += f"\n\nYou can continue by sharing the specific symptom you are seeing, such as red rot, smut, wilt, leaf spots, or pest damage."
            
            return AdvisoryResponse(
                answer_id=uuid4(),
                answer=answer_text,
                detailed_explanation=None,
                confidence=0.1,
                risk_level=risk_level,
                sources=[],
                action_cards=[ActionCard(type="ask_followup", label="Share Symptoms", payload={})],
                abstained=True,
                abstained_reason=abstained_reason,
                language=request.language,
                warnings=warnings + ["Non-grounded response prevented."],
                escalated=False,
                prompt_version=settings.prompt_version,
                knowledge_version=settings.knowledge_version
            )

        # 3. Prepare Context
        context_text = "\n\n".join([f"[{i+1}] {c.text}" for i, c in enumerate(chunks)])
        
        system_prompt = (
            "You are KRISHI-AI, a precision agricultural advisor for Indian farmers. "
            f"The user is asking about {crop or 'this crop'}. "
            "Your advice MUST be strictly derived from the provided context. "
            "Cite sources as [1], [2], etc. inside your response. "
            "If the context doesn't contain a specific chemical dose, DO NOT guess it. "
            "Do not give advice for other crops if the user did not ask for them."
        )
        user_prompt = f"Context:\n{context_text}\n\nQuestion: {request.question}"

        # 4. Call LLM (In demo/Phase 1 we simulate structured answer from context)
        if settings.environment == "development" or settings.llm_provider == "placeholder":
            # For demo, use the first matching chunk if possible
            pref_chunk = crop_matched_sources[0] if crop_matched_sources else chunks[0]
            source_content = pref_chunk.text
            detected_crop = crop or "your crop"
            
            answer_text = (
                f"**Agricultural Advisory**\n"
                f"Regarding your query on {detected_crop}: Based on {pref_chunk.title} [1], here is the verified guidance.\n\n"
                f"**Recommendation**\n"
                f"{source_content}\n\n"
            )
            answer_text += (
                f"**Safety Check**\n"
                f"Treatment timing: {pref_chunk.metadata.get('updated_at', 'Current')}. "
                f"Consult your local KVK before chemical application. Wear PPE."
            )
        else:
            llm_resp = await self.llm.generate(user_prompt, system_prompt=system_prompt)
            answer_text = llm_resp.text
        
        # 4. Compute confidence
        confidence = self._compute_confidence(chunks)
        
        # Formulate Response
        response = AdvisoryResponse(
            answer_id=uuid4(),
            answer=answer_text,
            detailed_explanation=None,
            confidence=confidence,
            risk_level=risk_level,
            sources=[
                SourceReference(
                    source_id=uuid4(),
                    title=c.title,
                    source_type="advisory",
                    relevance_score=c.score,
                    updated_date=c.metadata.get("updated_at")
                ) for c in chunks
            ],
            action_cards=action_cards,
            abstained=False,
            abstained_reason=None,
            language=request.language,
            warnings=warnings,
            escalated=False,
            prompt_version=settings.prompt_version,
            knowledge_version=settings.knowledge_version
        )
        
        # Log decision
        log_advisory_decision(request.question, response.answer, response.confidence, risk_level, False)
        
        return response
