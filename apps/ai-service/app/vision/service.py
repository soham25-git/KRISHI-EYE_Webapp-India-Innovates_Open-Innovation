"""
KRISHI-EYE Vision Analysis Service

ONNX inference pipeline for plant disease detection using:
- potato_classifier_mobilenetv2.onnx: Disease classification
- lesion_segmentation_unet.onnx: Pixel-level lesion segmentation
- yolov8-seg.onnx: Object detection + instance segmentation

Pipeline: Image → Classify → Segment lesions → Annotate → Advisory
"""

import os
import io
import base64
import logging
import numpy as np
from uuid import uuid4
from typing import Optional, List, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

# Models directory (relative to repo root)
MODELS_DIR = Path(__file__).parent.parent.parent.parent / "Vision Models"

# Disease class labels for potato classifier
POTATO_CLASSES = ["Early_Blight", "Healthy", "Late_Blight"]

# Advisory mapping for detected diseases
DISEASE_ADVISORY: Dict[str, Dict[str, str]] = {
    "Early_Blight": {
        "situation": "Early blight (Alternaria solani) detected on leaf surface. Characterized by concentric ring-like lesions.",
        "recommendation": "Apply Mancozeb 75 WP @ 0.25% or Chlorothalonil 75 WP @ 0.2% as foliar spray.",
        "action": "Spray at 10-15 day intervals covering both leaf surfaces. Remove severely infected leaves.",
        "safety_note": "Always confirm with your local KVK before applying chemicals. Wear proper PPE (mask, gloves, boots). Observe pre-harvest interval."
    },
    "Late_Blight": {
        "situation": "Late blight (Phytophthora infestans) detected. This is a fast-spreading disease requiring urgent intervention.",
        "recommendation": "Apply Metalaxyl + Mancozeb (Ridomil Gold MZ 68 WP) @ 0.25% or Cymoxanil + Mancozeb @ 0.3%.",
        "action": "Spray immediately. Repeat every 7 days in wet conditions. Avoid overhead irrigation.",
        "safety_note": "Late blight can destroy an entire field quickly. If infection is severe (>30% canopy), consult an agronomist at your nearest KVK. Wear full PPE."
    },
    "Healthy": {
        "situation": "No disease detected. The leaf appears healthy based on visual analysis.",
        "recommendation": "Continue regular monitoring and preventive care. Maintain balanced nutrition.",
        "action": "Monitor field every 5-7 days for early signs of disease. Maintain crop hygiene.",
        "safety_note": "Preventive fungicide sprays may still be advisable during high-humidity periods. Consult your KVK for region-specific schedules."
    }
}


class VisionAnalysisService:
    """ONNX-based plant disease detection and annotation service."""

    def __init__(self):
        self.classifier_session = None
        self.segmentation_session = None
        self.detector_session = None
        self._initialized = False
        self._init_error: Optional[str] = None

    def _lazy_init(self):
        """Lazy-load ONNX models on first use to avoid startup penalty."""
        if self._initialized:
            return

        try:
            import onnxruntime as ort

            classifier_path = MODELS_DIR / "potato_classifier_mobilenetv2.onnx"
            segmentation_path = MODELS_DIR / "lesion_segmentation_unet.onnx"
            detector_path = MODELS_DIR / "yolov8-seg.onnx"

            # Prefer CPU for reliability; GPU can be enabled via provider config
            providers = ['CPUExecutionProvider']

            if classifier_path.exists():
                self.classifier_session = ort.InferenceSession(str(classifier_path), providers=providers)
                logger.info(f"Loaded classifier: {classifier_path.name}")
            else:
                logger.warning(f"Classifier model not found: {classifier_path}")

            if segmentation_path.exists():
                self.segmentation_session = ort.InferenceSession(str(segmentation_path), providers=providers)
                logger.info(f"Loaded segmentation: {segmentation_path.name}")
            else:
                logger.warning(f"Segmentation model not found: {segmentation_path}")

            if detector_path.exists():
                self.detector_session = ort.InferenceSession(str(detector_path), providers=providers)
                logger.info(f"Loaded detector: {detector_path.name}")
            else:
                logger.warning(f"Detector model not found: {detector_path}")

            self._initialized = True

        except ImportError:
            self._init_error = "onnxruntime is not installed. Install with: pip install onnxruntime"
            logger.error(self._init_error)
            self._initialized = True
        except Exception as e:
            self._init_error = f"Failed to initialize vision models: {str(e)}"
            logger.error(self._init_error, exc_info=True)
            self._initialized = True

    def _preprocess_for_classifier(self, image_bytes: bytes) -> np.ndarray:
        """Preprocess image for MobileNetV2 classifier (224x224, ImageNet normalization)."""
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224), Image.LANCZOS)
        arr = np.array(img, dtype=np.float32) / 255.0

        # ImageNet normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        arr = (arr - mean) / std

        # NCHW format
        arr = np.transpose(arr, (2, 0, 1))
        return np.expand_dims(arr, axis=0)

    def _preprocess_for_segmentation(self, image_bytes: bytes, target_size: int = 256) -> np.ndarray:
        """Preprocess image for UNet segmentation."""
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((target_size, target_size), Image.LANCZOS)
        arr = np.array(img, dtype=np.float32) / 255.0

        # NCHW format
        arr = np.transpose(arr, (2, 0, 1))
        return np.expand_dims(arr, axis=0)

    def _classify(self, image_bytes: bytes) -> Dict[str, Any]:
        """Run disease classification."""
        if not self.classifier_session:
            return {"class": "unknown", "confidence": 0.0, "error": "Classifier not loaded"}

        try:
            input_tensor = self._preprocess_for_classifier(image_bytes)
            input_name = self.classifier_session.get_inputs()[0].name
            outputs = self.classifier_session.run(None, {input_name: input_tensor})

            logits = outputs[0][0]
            # Softmax
            exp_logits = np.exp(logits - np.max(logits))
            probs = exp_logits / exp_logits.sum()

            class_idx = int(np.argmax(probs))
            confidence = float(probs[class_idx])
            class_name = POTATO_CLASSES[class_idx] if class_idx < len(POTATO_CLASSES) else f"Class_{class_idx}"

            return {"class": class_name, "confidence": confidence, "all_probs": {POTATO_CLASSES[i]: float(probs[i]) for i in range(min(len(POTATO_CLASSES), len(probs)))}}

        except Exception as e:
            logger.error(f"Classification failed: {e}", exc_info=True)
            return {"class": "unknown", "confidence": 0.0, "error": str(e)}

    def _segment_lesions(self, image_bytes: bytes) -> Dict[str, Any]:
        """Run lesion segmentation to get pixel-level mask."""
        if not self.segmentation_session:
            return {"mask": None, "area_percent": 0.0, "error": "Segmentation model not loaded"}

        try:
            # Determine model input shape dynamically
            model_input = self.segmentation_session.get_inputs()[0]
            input_shape = model_input.shape
            # Shape is typically [1, 3, H, W]
            target_h = input_shape[2] if isinstance(input_shape[2], int) else 256
            target_w = input_shape[3] if isinstance(input_shape[3], int) else 256

            input_tensor = self._preprocess_for_segmentation(image_bytes, target_size=target_h)
            outputs = self.segmentation_session.run(None, {model_input.name: input_tensor})

            mask = outputs[0][0]
            # If multi-channel, take argmax; if single channel, threshold
            if len(mask.shape) == 3 and mask.shape[0] > 1:
                binary_mask = np.argmax(mask, axis=0) > 0
            else:
                if len(mask.shape) == 3:
                    mask = mask[0]
                binary_mask = mask > 0.5

            area_percent = float(np.sum(binary_mask) / binary_mask.size * 100)
            return {"mask": binary_mask, "area_percent": round(area_percent, 1)}

        except Exception as e:
            logger.error(f"Segmentation failed: {e}", exc_info=True)
            return {"mask": None, "area_percent": 0.0, "error": str(e)}

    def _generate_annotated_image(self, image_bytes: bytes, mask: Optional[np.ndarray], disease_class: str) -> str:
        """Overlay segmentation mask onto original image and return base64."""
        from PIL import Image, ImageDraw, ImageFont

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original_size = img.size

        if mask is not None and disease_class != "Healthy":
            # Create overlay
            overlay = Image.new("RGBA", original_size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)

            # Resize mask to original image dimensions
            mask_resized = np.array(Image.fromarray(mask.astype(np.uint8) * 255).resize(original_size, Image.NEAREST))

            # Draw red overlay on lesion areas
            for y in range(original_size[1]):
                for x in range(original_size[0]):
                    if mask_resized[y, x] > 128:
                        draw.point((x, y), fill=(239, 68, 68, 100))  # Semi-transparent red

            img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

            # Add border and label
            draw = ImageDraw.Draw(img)
            label = f"⚠ {disease_class.replace('_', ' ')} Detected"
            draw.rectangle([(0, 0), (original_size[0], 36)], fill=(239, 68, 68))
            draw.text((10, 8), label, fill=(255, 255, 255))
        else:
            # Healthy: add a green border/label
            draw = ImageDraw.Draw(img)
            label = "✓ Healthy — No Disease Detected"
            draw.rectangle([(0, 0), (original_size[0], 36)], fill=(16, 185, 129))
            draw.text((10, 8), label, fill=(255, 255, 255))

        # Encode to base64
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=85)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    async def analyze(self, image_bytes: bytes, filename: str = "") -> Dict[str, Any]:
        """Full analysis pipeline: classify → segment → annotate → advise."""
        self._lazy_init()

        if self._init_error:
            return {
                "status": "error",
                "message": self._init_error,
                "confidence": 0.0
            }

        analysis_id = str(uuid4())

        # Step 1: Classify
        classification = self._classify(image_bytes)
        disease_class = classification.get("class", "unknown")
        confidence = classification.get("confidence", 0.0)

        # Step 2: Determine status
        if disease_class == "Healthy":
            status = "healthy"
        elif confidence < 0.5 or disease_class == "unknown":
            status = "uncertain"
        else:
            status = "infected"

        # Step 3: Segment lesions (only if infected)
        segmentation = {"mask": None, "area_percent": 0.0}
        if status == "infected":
            segmentation = self._segment_lesions(image_bytes)

        # Step 4: Generate annotated image
        annotated_b64 = ""
        try:
            annotated_b64 = self._generate_annotated_image(
                image_bytes, segmentation.get("mask"), disease_class
            )
        except Exception as e:
            logger.error(f"Annotation generation failed: {e}", exc_info=True)

        # Step 5: Build advisory
        advisory_data = DISEASE_ADVISORY.get(disease_class, DISEASE_ADVISORY.get("Healthy", {}))

        if status == "uncertain":
            advisory_data = {
                "situation": f"The analysis confidence is low ({confidence:.0%}). The model could not determine the plant condition with sufficient certainty.",
                "recommendation": "Please upload a clearer, well-lit image of a single leaf. Avoid shadows and background clutter.",
                "action": "If symptoms are visible, consult your nearest KVK or certified agronomist in person.",
                "safety_note": "Do NOT apply pesticides based on uncertain analysis. Expert verification is recommended."
            }

        # Build detections list
        detections = []
        if status == "infected":
            detections.append({
                "class": disease_class.replace("_", " "),
                "confidence": round(confidence, 3),
                "area_percent": segmentation.get("area_percent", 0.0)
            })

        return {
            "analysis_id": analysis_id,
            "status": status,
            "confidence": round(confidence, 3),
            "annotated_image": annotated_b64,
            "detections": detections,
            "classification": {
                "predicted_class": disease_class,
                "probabilities": classification.get("all_probs", {})
            },
            "advisory": advisory_data,
            "model_metadata": {
                "classifier": "potato_classifier_mobilenetv2",
                "segmentation": "lesion_segmentation_unet",
                "note": "Models trained on PlantVillage potato dataset. Results should be verified by agronomists."
            }
        }


# Singleton
vision_service = VisionAnalysisService()
