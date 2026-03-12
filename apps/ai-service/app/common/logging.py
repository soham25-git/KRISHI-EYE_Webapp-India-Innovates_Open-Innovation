import logging
from app.config import settings

logger = logging.getLogger(__name__)

def log_advisory_decision(
    question: str,
    answer: str,
    confidence: float,
    risk_level: str,
    abstained: bool,
    abstained_reason: str = None
):
    """
    Structured log for advisory decisions, including model versions
    and explicit abstention reasoning.
    """
    log_payload = {
        "event": "advisory_decision",
        "question_preview": question[:200], # truncated for privacy
        "confidence": confidence,
        "risk_level": risk_level,
        "abstained": abstained,
        "abstained_reason": abstained_reason,
        "environment": settings.environment,
        "prompt_version": settings.prompt_version,
        "knowledge_version": settings.knowledge_version,
        "llm_provider": settings.llm_provider,
        "llm_model": settings.llm_model
    }
    
    # In a prod environment, you'd serialize this as JSON to stdout
    # for Datadog / CloudWatch to pick up. 
    logger.info(f"Advisory decision: {log_payload}")
