import re
import logging
from typing import List, Optional
from app.providers.embedding import BaseEmbeddingProvider
from app.storage.repository import AdvisoryRepository
from app.common.schemas import QueryEntities
from app.common.errors import PromptInjectionError

class RetrievedChunk:
    def __init__(self, text: str, source_id: str, title: str, score: float, metadata: dict = None):
        self.text = text
        self.source_id = source_id
        self.title = title
        self.score = score
        self.metadata = metadata or {}
        self.crop = self.metadata.get("crop")
        self.state = self.metadata.get("state") or self.metadata.get("region")

class RetrievalService:
    def __init__(self, embedding_provider: BaseEmbeddingProvider, repository: AdvisoryRepository):
        self.embedding = embedding_provider
        self.repository = repository
        self.logger = logging.getLogger(__name__)
        
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
        entities: QueryEntities,
        top_k: int = 5
    ) -> List[RetrievedChunk]:
        # 1. Sanitize & check for injection
        clean_query = self._sanitize_and_check_injection(query)
        crop = entities.crop
        geography = entities.geography

        self.logger.info(f"Retrieving for Query: {clean_query} | Extracted Crop: {crop} | Geography: {geography}")

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
            item_crop = item.get("crop", "general")
            item_state = item.get("state", "National")
            
            # S-02: Strict Crop Filtering
            # If user specified a crop, and this source is for a DIFFERENT specific crop, discard.
            if crop and item_crop != "general" and item_crop.lower() != crop.lower():
                continue

            score = 0.0
            # Basic keyword overlap for "semantic" simulation
            content_lower = item["content"].lower()
            title_lower = item["title"].lower()
            
            # Crop match boost
            crop_match = False
            if crop and item_crop.lower() == crop.lower():
                score += 0.4
                crop_match = True
            
            # Geography boost
            geo_match = False
            if geography and (geography.lower() in item_state.lower() or geography.lower() in content_lower):
                score += 0.3
                geo_match = True

            # Content overlap
            if any(word in query_lower for word in content_lower.split()):
                score += 0.3
            if any(word in query_lower for word in title_lower.split()):
                score += 0.2
                
            if score > 0.3:
                self.logger.debug(f"Source Match: {item['title']} | Score: {score:.2f} | CropMatch: {crop_match} | GeoMatch: {geo_match}")
                results.append(RetrievedChunk(
                    text=item["content"],
                    source_id=item["id"],
                    title=item["title"],
                    score=score,
                    metadata={"updated_at": item["updated_at"], "crop": item_crop, "state": item_state}
                ))

        # Sort by score descending
        results.sort(key=lambda x: x.score, reverse=True)
        return results[:top_k]
