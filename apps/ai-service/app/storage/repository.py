from typing import Any, List, Optional
from uuid import UUID

class AdvisoryRepository:
    """Repository interface for DB access."""
    
    async def save_advisory_log(self, user_id: UUID, question: str, response: dict) -> UUID:
        """Stores the question, answer, confidence, sources, and abstention status."""
        pass

    async def get_history(self, user_id: UUID, limit: int = 20) -> List[dict]:
        """Retrieves history for the user."""
        return []

    async def log_feedback(self, answer_id: UUID, user_id: UUID, helpful: bool, comment: Optional[str] = None):
        """Saves user feedback for an answer."""
        pass
        
    async def escalate_question(self, answer_id: UUID, user_id: UUID, reason: Optional[str] = None):
        """Marks a question as escalated to human support."""
        pass

def get_repository() -> AdvisoryRepository:
    """Dependency injector for the repository layer."""
    return AdvisoryRepository()
