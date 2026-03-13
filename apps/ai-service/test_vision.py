import asyncio
import os
import json
from pathlib import Path

async def test():
    # Fix imports and paths
    os.chdir(Path(__file__).parent)
    from app.vision.service import vision_service
    
    # Override MODELS_DIR for the test script because we are running from inside apps/ai-service
    vision_service.MODELS_DIR = Path("../../Vision Models").resolve()
    
    img_path = Path('../../Vision Models/test_images/healthy_leaf.jpg')
    if not img_path.exists():
        # Fallback to creating a dummy RGB image for testing pipeline flow
        from PIL import Image
        import io
        img = Image.new('RGB', (800, 600), color = 'green')
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG")
        data = buffer.getvalue()
    else:
        with open(img_path, 'rb') as f: 
            data = f.read()
            
    print(f'Calling analyze using models from: {vision_service.MODELS_DIR}')
    res = await vision_service.analyze(data, 'test.jpg')
    
    safe_res = {k:v for k,v in res.items() if k != 'annotated_image'}
    safe_res['annotated_image_exists'] = bool(res.get('annotated_image'))
    print(json.dumps(safe_res, indent=2))

if __name__ == "__main__":
    asyncio.run(test())
