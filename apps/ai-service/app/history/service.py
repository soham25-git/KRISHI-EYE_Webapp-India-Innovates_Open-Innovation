from typing import List
from uuid import UUID
from app.storage.repository import AdvisoryRepository

class HistoryService:
    def __init__(self, repository: AdvisoryRepository):
        self.repository = repository
        
    async def get_advisory_history(self, user_id: UUID, limit: int = 20) -> List[dict]:
        """
        Business logic for fetching and formatting history.
        The DB returns raw rows, HistoryService formats them for the API.
        """
        raw_history = await self.repository.get_history(user_id=user_id, limit=limit)
        
        # In a real implementation we would convert the raw dicts into AdvisoryResponse snippets
        return raw_history
        
    async def log_feedback(self, answer_id: UUID, user_id: UUID, helpful: bool, comment: str = None):
        """Pass feedback down to repository."""
        await self.repository.log_feedback(answer_id, user_id, helpful, comment)

    async def escalate(self, answer_id: UUID, user_id: UUID, reason: str = None):
        """Pass escalation down to repository."""
        await self.repository.escalate_question(answer_id, user_id, reason)
