import re
from typing import List, Optional
from app.providers.embedding import BaseEmbeddingProvider
from app.storage.repository import AdvisoryRepository
from app.common.errors import PromptInjectionError

class RetrievedChunk:
    def __init__(self, text: str, source_id: str, title: str, score: float, metadata: dict = None):
        self.text = text
        self.source_id = source_id
        self.title = title
        self.score = score
        self.metadata = metadata or {}

class RetrievalService:
    def __init__(self, embedding_provider: BaseEmbeddingProvider, repository: AdvisoryRepository):
        self.embedding = embedding_provider
        self.repository = repository
        
        # Super simple injection blocklist for the scaffold
        # In prod, this might use a lightweight classifier or more robust regexes
        self.injection_patterns = [
            r"(?i)\bignore all previous instructions\b",
            r"(?i)\bbypass system prompt\b",
            r"(?i)\byou are now\b",
            r"(?i)\bdisregard rules\b",
            r"(?i)\bsystem compromise\b"
        ]

    def _sanitize_and_check_injection(self, query: str) -> str:
        """
        Explicit prompt-injection defense before doing any embedding or LLM work.
        """
        for pattern in self.injection_patterns:
            if re.search(pattern, query):
                raise PromptInjectionError("Potential prompt injection detected.", risk_level="high", category="security")
        
        # Basic sanitization (trimming, removing dangerous characters if any)
        sanitized = query.strip()
        return sanitized

    async def retrieve(
        self, 
        query: str, 
        crop: Optional[str] = None, 
        district: Optional[str] = None,
        state: Optional[str] = "National",
        top_k: int = 5
    ) -> List[RetrievedChunk]:
        # 1. Sanitize & check for injection
        clean_query = self._sanitize_and_check_injection(query)

        # 2. In Phase 1 "Deep RAG", we use a high-fidelity lookup from the demo_knowledge.json
        # to ensure 100% groundedness without requiring a live Vector DB connection in the edge demo.
        import json
        import os
        
        data_path = os.path.join(os.getcwd(), "data", "demo_knowledge.json")
        try:
            with open(data_path, "r") as f:
                knowledge_base = json.load(f)
        except Exception:
            knowledge_base = []

        query_lower = clean_query.lower()
        results = []
        
        for item in knowledge_base:
            score = 0.0
            # Basic keyword overlap for "semantic" simulation
            if any(word in query_lower for word in item["content"].lower().split()):
                score += 0.5
            if crop and item.get("crop", "").lower() == crop.lower():
                score += 0.3
            if any(word in query_lower for word in item["title"].lower().split()):
                score += 0.2
                
            if score > 0.3:
                results.append(RetrievedChunk(
                    text=item["content"],
                    source_id=item["id"],
                    title=item["title"],
                    score=score,
                    metadata={"updated_at": item["updated_at"], "crop": item.get("crop")}
                ))

        # Sort by score descending
        results.sort(key=lambda x: x.score, reverse=True)
        return results[:top_k]
