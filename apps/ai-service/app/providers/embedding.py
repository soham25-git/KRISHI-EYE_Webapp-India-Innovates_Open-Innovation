from abc import ABC, abstractmethod
from typing import List

class BaseEmbeddingProvider(ABC):
    @abstractmethod
    async def embed_text(self, text: str) -> List[float]:
        pass

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        pass

class PlaceholderEmbeddingProvider(BaseEmbeddingProvider):
    async def embed_text(self, text: str) -> List[float]:
        return [0.0] * 1536 # fake 1536-dim vector

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [[0.0] * 1536 for _ in texts]

def get_embedding_provider(provider_name: str, model_name: str, api_key: str) -> BaseEmbeddingProvider:
    if provider_name == "openai":
        raise NotImplementedError("OpenAI embeddings not yet implemented")
    return PlaceholderEmbeddingProvider()
