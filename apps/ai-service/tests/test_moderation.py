import pytest
from app.moderation.service import ModerationService
from app.common.schemas import RiskLevel, SafetyCategory

def test_high_risk_classification():
    service = ModerationService()
    level, category = service.classify_risk("What is the correct dosage for toxic pesticides?")
    assert level == RiskLevel.HIGH
    assert category == SafetyCategory.HIGH

def test_low_risk_classification():
    service = ModerationService()
    level, category = service.classify_risk("When is the best time to harvest wheat?")
    assert level == RiskLevel.LOW
    assert category == SafetyCategory.LOW
    
def test_escalation_logic():
    service = ModerationService()
    # High risk but low confidence
    assert service.should_escalate(RiskLevel.HIGH, 0.7) is True
    # High risk but high confidence
    assert service.should_escalate(RiskLevel.HIGH, 0.95) is False
    # Low risk but terrible confidence
    assert service.should_escalate(RiskLevel.LOW, 0.2) is True
