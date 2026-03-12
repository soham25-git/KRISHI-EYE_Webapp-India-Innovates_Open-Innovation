from fastapi import Depends
from app.config import settings
from app.storage.repository import AdvisoryRepository, get_repository
from app.providers.llm import BaseLLMProvider, get_llm_provider

# Will import additional providers here as they are created
# from app.providers.embedding import BaseEmbeddingProvider, get_embedding_provider
# from app.providers.rerank import BaseReranker, get_reranker

def get_llm() -> BaseLLMProvider:
    return get_llm_provider(settings.llm_provider, settings.llm_model, settings.llm_api_key)

# The following functions will be implemented as services are built
# def get_embedding() -> BaseEmbeddingProvider:
#    return get_embedding_provider(...)
#
# def get_reranker() -> BaseReranker:
#    return get_reranker_provider(...)
