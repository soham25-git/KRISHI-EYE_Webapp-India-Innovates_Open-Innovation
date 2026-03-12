import re
from typing import Tuple
from app.common.schemas import SafetyCategory, RiskLevel
from app.moderation.categories import RISK_PATTERNS
from app.api.schemas import AdvisoryRequest

class ModerationService:
    def classify_risk(self, text: str) -> Tuple[RiskLevel, SafetyCategory]:
        """
        Scan text for risk patterns to assign a RiskLevel and Category.
        Returns the highest applicable risk.
        """
        # Simple regex matcher for scaffolding
        for pattern in RISK_PATTERNS[SafetyCategory.HIGH]:
            if re.search(pattern, text):
                return RiskLevel.HIGH, SafetyCategory.HIGH
                
        for pattern in RISK_PATTERNS[SafetyCategory.MEDIUM]:
            if re.search(pattern, text):
                return RiskLevel.MEDIUM, SafetyCategory.MEDIUM
                
        for pattern in RISK_PATTERNS[SafetyCategory.LOW]:
            if re.search(pattern, text):
                return RiskLevel.LOW, SafetyCategory.LOW
                
        return RiskLevel.LOW, SafetyCategory.SAFE

    def should_escalate(self, risk_level: RiskLevel, confidence: float) -> bool:
        """
        Business logic: Always escalate HIGH risk queries if confidence isn't perfect,
        or any queries with very low confidence.
        """
        if risk_level == RiskLevel.HIGH and confidence < 0.9:
            return True
        if confidence < 0.4:
            return True
        return False
