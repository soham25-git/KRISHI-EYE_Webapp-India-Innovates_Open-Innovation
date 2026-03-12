from abc import ABC, abstractmethod
from typing import Optional, List
from pydantic import BaseModel

class LLMResponse(BaseModel):
    text: str
    tokens_used: int = 0
    finish_reason: str = "stop"

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.0) -> LLMResponse:
        pass

class PlaceholderLLMProvider(BaseLLMProvider):
    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.0) -> LLMResponse:
        return LLMResponse(text="This is a stubbed response from the PlaceholderLLMProvider.", tokens_used=10)

def get_llm_provider(provider_name: str, model_name: str, api_key: str) -> BaseLLMProvider:
    if provider_name == "openai":
        # return OpenAIProvider(...)
        raise NotImplementedError("OpenAI provider not yet implemented")
    return PlaceholderLLMProvider()
