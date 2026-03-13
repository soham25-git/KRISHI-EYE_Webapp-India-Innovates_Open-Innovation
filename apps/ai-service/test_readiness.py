import asyncio
import os
import json
from pathlib import Path
import sys

# Add apps/ai-service to sys.path
sys.path.append(str(Path(__file__).parent))

async def test_readiness():
    print("--- Testing Vision Service Readiness ---")
    from app.vision.service import vision_service
    health = vision_service.check_health()
    print(f"Health Status: {health['status']}")
    print(f"Error: {health['error']}")
    print(f"Models: {json.dumps(health['models'], indent=2)}")
    
    # Test internal error handling
    print("\n--- Testing Analyze Error Handling (Mocking Inference Failure) ---")
    # We'll use a corrupted image or mock an exception
    try:
        result = await vision_service.analyze(b"corrupted_data", filename="test.jpg")
        print(f"Analysis Status: {result.get('status')}")
        print(f"Message: {result.get('message')}")
    except Exception as e:
        print(f"Caught Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_readiness())
