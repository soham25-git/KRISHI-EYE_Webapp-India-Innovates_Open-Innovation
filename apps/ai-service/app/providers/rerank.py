from abc import ABC, abstractmethod
from typing import List
from pydantic import BaseModel

class ScoredChunk(BaseModel):
    chunk_text: str
    metadata: dict
    relevance_score: float

class BaseRerankerProvider(ABC):
    @abstractmethod
    async def rerank(self, query: str, chunks: List[str], top_n: int = 5) -> List[ScoredChunk]:
        pass

class PlaceholderRerankerProvider(BaseRerankerProvider):
    async def rerank(self, query: str, chunks: List[str], top_n: int = 5) -> List[ScoredChunk]:
        """A naive reranker that assigns random scores for scaffolding purposes."""
        import random
        scored_chunks = []
        for c in chunks:
            scored_chunks.append(ScoredChunk(
                chunk_text=c,
                metadata={},
                relevance_score=random.uniform(0.0, 1.0)
            ))
        return sorted(scored_chunks, key=lambda x: x.relevance_score, reverse=True)[:top_n]

def get_reranker_provider(provider_name: str, model_name: str, api_key: str) -> BaseRerankerProvider:
    return PlaceholderRerankerProvider()
