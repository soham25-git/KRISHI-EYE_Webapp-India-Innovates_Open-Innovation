from typing import List, Optional
from uuid import uuid4
from app.api.schemas import AdvisoryRequest, AdvisoryResponse, ActionCard
from app.common.schemas import SourceReference
from app.providers.llm import BaseLLMProvider
from app.retrieval.service import RetrievedChunk
from app.config import settings
from app.common.logging import log_advisory_decision

class AnswerService:
    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm = llm_provider

    def _generate_followup_if_missing_context(self, request: AdvisoryRequest) -> Optional[AdvisoryResponse]:
        """
        If the user asks a localized question (e.g. 'what pesticide to use?') but 
        has no crop or district on their profile or request, we should ask them.
        This is a simple scaffold implementation.
        """
        # Very naive check: if they mention "pesticide" or "disease" but we don't know the crop
        question_lower = request.question.lower()
        needs_context = any(w in question_lower for w in ["pesticide", "disease", "spray", "fertilizer"])
        
        if needs_context and not request.crop:
            return AdvisoryResponse(
                answer_id=uuid4(),
                answer="To give you the best advice, could you tell me which crop you are asking about?",
                detailed_explanation=None,
                confidence=1.0, # Complete confidence in asking a follow up
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

        # 4. Call LLM (In demo/Phase 1 we simulate the LLM result based on context for reliability)
        if settings.environment == "development" or settings.llm_provider == "placeholder":
            source_content = chunks[0].text
            answer_text = f"Based on {chunks[0].title} [1], for your query about \"{request.question}\", the guidelines state: {source_content} "
            if len(chunks) > 1:
                answer_text += f"\n\nAdditionally, {chunks[1].title} [2] provides further context on related agronomic practices."
        else:
            llm_resp = await self.llm.generate(user_prompt, system_prompt=system_prompt)
            answer_text = llm_resp.text
        
        # 4. Compute confidence (stubbed logic)
        confidence = self._compute_confidence(chunks)
        
        # 5. Abstention Check
        abstained = False
        abstained_reason = None
        answer_text = llm_resp.text
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
