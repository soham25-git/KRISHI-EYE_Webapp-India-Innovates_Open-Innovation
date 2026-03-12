from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    environment: str = "development"
    log_level: str = "INFO"
    
    port: int = 8000
    allowed_origins: List[str] = ["*"]
    
    database_url: str = "sqlite:///./test.db"
    vector_db_url: str = "sqlite:///./test_vector.db"
    
    # Providers
    embedding_provider: str = "placeholder"
    embedding_model: str = "placeholder-emb-v1"
    embedding_api_key: str = ""
    
    llm_provider: str = "placeholder"
    llm_model: str = "placeholder-llm-v1"
    llm_api_key: str = ""
    
    rerank_provider: str = "placeholder"
    rerank_model: str = "placeholder-rerank-v1"
    rerank_api_key: str = ""
    
    # Advisory Thresholds
    confidence_threshold: float = 0.7
    abstention_threshold: float = 0.4
    
    # Versions
    prompt_version: str = "v1.0.0"
    knowledge_version: str = "v1.0.0"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
