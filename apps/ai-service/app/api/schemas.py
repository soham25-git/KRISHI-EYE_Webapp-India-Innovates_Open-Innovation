from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime
from app.common.schemas import SourceReference
from app.common.security import sanitize_prompt_input

class AdvisoryRequest(BaseModel):
    question: str
    user_id: UUID
    farm_id: Optional[UUID] = None
    language: str = "en"
    crop: Optional[str] = None
    district: Optional[str] = None
    session_id: Optional[UUID] = None

    @field_validator("question")
    @classmethod
    def sanitize_question(cls, v: str) -> str:
        return sanitize_prompt_input(v)

class ActionCard(BaseModel):
    type: str  # e.g., "call_help", "save_advice", "ask_followup", "escalate"
    label: str
    payload: Optional[dict[str, Any]] = None

class AdvisoryResponse(BaseModel):
    answer_id: UUID
    answer: str
    detailed_explanation: Optional[str] = None
    confidence: float
    risk_level: str
    sources: List[SourceReference] = Field(default_factory=list)
    action_cards: List[ActionCard] = Field(default_factory=list)
    abstained: bool
    abstained_reason: Optional[str] = None # Why we abstained
    language: str
    warnings: List[str] = Field(default_factory=list)
    escalated: bool
    
    # Versioning
    prompt_version: str
    knowledge_version: str

class FeedbackRequest(BaseModel):
    answer_id: UUID
    user_id: UUID
    helpful: bool
    comment: Optional[str] = None

class EscalationRequest(BaseModel):
    answer_id: UUID
    user_id: UUID
    reason: Optional[str] = None

class IngestRequest(BaseModel):
    source_id: UUID
    force: bool = False
