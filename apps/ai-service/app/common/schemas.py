from enum import Enum
from pydantic import BaseModel, ConfigDict
from copy import deepcopy
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID

class SafetyCategory(str, Enum):
    HIGH = "high"       # dosage, toxic exposure, severe outbreak, government compliance
    MEDIUM = "medium"   # likely disease/pest guidance with evidence
    LOW = "low"         # informational, directory, general crop education
    SAFE = "safe"       # pure chit-chat or standard greeting

class RiskLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class SupportedLanguage(str, Enum):
    EN = "en"
    HI = "hi"
    MR = "mr"
    TE = "te"
    # add as needed

class SourceReference(BaseModel):
    source_id: UUID
    title: str
    source_type: str
    url: Optional[str] = None
    published_at: Optional[datetime] = None
    updated_date: Optional[str] = None  # Normalized for Trust UI frontend
    relevance_score: float

class ConfidenceScore(BaseModel):
    score: float
    factors: list[str] = []
    is_sufficient: bool = True

class QueryEntities(BaseModel):
    crop: Optional[str] = None
    geography: Optional[str] = None
    intent: str = "info"  # "info" or "treatment"
    pest_or_disease_context: Optional[str] = None
    treatment_intent: bool = False
    is_location_specific: bool = False
