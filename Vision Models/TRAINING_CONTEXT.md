# TRAINING_CONTEXT.md

## Purpose
This document summarizes the latest available training-code context for the three vision models used in KRISHI-EYE so another coding model can build an inference/deployment pipeline that matches the training assumptions.

## Source training scripts
- `train.py` -> YOLOv8n-seg leaf segmentation training.
- `train-2.py` -> MobileNetV2 infection classifier training.
- `train-3.py` -> UNet lesion segmentation training.

## Shared assumptions
- All three scripts are written for Kaggle-based training.
- Random seed is set to 42 in each script.
- The models are being prepared for Hailo-8L + Raspberry Pi 5 deployment.
- ONNX export is done with static input shapes and opset 11.

## 1) YOLOv8n-seg leaf segmentation
### Goal
Train a lightweight instance-segmentation model to detect and segment potato leaves for downstream disease analysis.

### Framework and base model
- Library: Ultralytics YOLO.
- Base checkpoint: `yolov8n-seg.pt`.
- Data config path: `/kaggle/input/sigmapotato/data.yaml`.

### Training configuration
- Epochs: 100.
- Image size: 640.
- Batch size: 32.
- Workers: 4.
- Patience: 15.
- Device setting in script: `[0, 1]` if available.
- Project/name: `potato_yolov8_seg_optimized/experiment_optimized`.

### Optimization choices
- Optimizer: `AdamW`.
- Initial LR: `0.001`.
- Final LR fraction: `0.01`.
- Weight decay: `0.0005`.
- Dropout: `0.1`.
- AMP enabled.
- Pretrained enabled.

### Augmentation and loss-related settings
- Geometric augmentations: rotation, translation, scale, shear, perspective.
- Flips: both horizontal and vertical.
- Mosaic, mixup, and copy-paste are enabled.
- HSV augmentation is enabled.
- Label smoothing: `0.1`.
- Loss weights set in script include `cls=1.0`, `box=7.5`, and `dfl=1.5`.

### Output artifacts
- Best checkpoint expected at: `potato_yolov8_seg_optimized/experiment_optimized/weights/best.pt`.
- ONNX export is performed from the best checkpoint.
- Export settings: `format=onnx`, `imgsz=640`, `simplify=True`, `opset=11`, `dynamic=False`, `half=False`.
- Test prediction step uses `/kaggle/input/sigmapotato/test/images` with `imgsz=640` and `conf=0.3`.

### Deployment implications
- Inference input should be assumed as static `640x640` RGB.
- Pipeline should preserve mask/segmentation output, not just boxes.
- This model is intended to be the first stage that localizes candidate leaves for later classification/lesion analysis.

## 2) MobileNetV2 infection classifier
### Goal
Classify cropped leaf imagery into disease/health categories after leaf extraction.

### Framework and base model
- Frameworks: PyTorch + timm.
- Base architecture: `mobilenetv2_100`.
- Dataset root: `/kaggle/input/potato-leaf-disease-dataset/Potato Leaf Disease Dataset in Uncontrolled Environment`.

### Training configuration
- Number of classes in script: `7`.
Bacteria, Fungi, Healthy, Phytophthora, Pests, Virus
- Image size: `224`.
- Batch size: `48`.
- Workers: `4`.
- Epochs: `30`.
- Learning rate: `1e-3`.
- Early stopping patience: `5`.
- Gradient clipping: `1.0`.
- Mixed precision enabled.

### Data pipeline
- Uses `ImageFolder`.
- Split is created in-script as 80% train / 20% validation.
- Class imbalance is handled with `WeightedRandomSampler`.
- Validation transform is resize -> center crop -> tensor -> ImageNet normalization.

### Important custom augmentation logic
- A custom `RandomGridOrCrop` transform simulates the deployment grid logic.
- It uses 50% grid-tile mode with `grid_size=4` and 50% standard random crop mode.
- Albumentations adds flips, rotation, random rain, motion blur, optical fog, color jitter, normalization, and tensor conversion.
- This means the classifier is trained to be robust to partial views and harsh field conditions.

### Loss, metrics, and training loop
- Custom `FocalLoss` is used with `gamma=2.0` and label smoothing `0.1`.
- Optimizer: `Adam`.
- Scheduler: `ReduceLROnPlateau(mode="max", factor=0.5, patience=3)`.
- Main validation selection metric is weighted F1.
- Final evaluation prints a full `classification_report` and saves `confusion_matrix_classifier.png`.

### Output artifacts
- Best PyTorch checkpoint: `best_potato_classifier.pth`.
- ONNX filename: `potato_classifier.onnx`.
- ONNX export uses dummy input `(1, 3, 224, 224)`.
- Export settings: `opset_version=11`, static shape, input name `input`, output name `output`.

### Deployment implications
- Inference input should be assumed as RGB `224x224` leaf crops.
- The classifier expects ImageNet-style normalization.
- It is meant to run on already-isolated leaf regions rather than full-frame imagery.
- The pipeline should preserve class-name mapping from the ImageFolder class order found during training.

## 3) UNet lesion segmentation
### Goal
Perform binary lesion segmentation on diseased leaf regions to estimate lesion extent/severity.

### Framework and base model
- Frameworks: PyTorch + segmentation-models-pytorch.
- Architecture: `Unet`.
- Encoder: `mobilenet_v2`.
- Encoder weights: `imagenet`.
- Decoder channels: `(256, 128, 64, 32, 16)`.

### Dataset handling
- The script combines two datasets:
  - `/kaggle/input/plantsegv3`
  - `/kaggle/input/leaf-disease-segmentation-dataset/aug_data/aug_data`
- Custom `BinaryLesionDataset` searches flexible image/mask folder layouts.
- It tries image folders such as `images/train`, `train/images`, or `images`.
- Masks are binarized to `0/1`.
- Missing masks fall back to zeros.

### Training configuration
- Binary output classes: `1`.
- Image size: `256`.
- Batch size: `48`.
- Workers: `4`.
- Epochs: `30`.
- Learning rate: `1e-3`.
- Early stopping patience: `5`.
- Gradient clipping: `1.0`.
- Mixed precision enabled.
- Full metrics are calculated every `10` epochs.

### Augmentations and loss
- Training augmentations include resize, flips, rotation, random rain, motion blur, optical fog, brightness/contrast, Gaussian noise, normalization, and tensor conversion.
- Validation uses resize + normalization + tensor conversion.
- Loss function: `BCEWithLogitsLoss`.
- Scheduler: `ReduceLROnPlateau(mode="min", factor=0.5, patience=3)`.

### Metrics
- Fast and full metric helpers threshold sigmoid output at `0.5`.
- Full metrics include precision, recall, F1, and IoU.
- Best model selection is based on validation loss.

### Output artifacts
- Best PyTorch checkpoint: `best_binary_segmentation.pth`.
- ONNX filename: `lesion_segmentation.onnx`.
- ONNX export uses dummy input `(1, 3, 256, 256)`.
- Export settings: opset 11, static shape, input name `input`, output name `output`.

### Deployment implications
- Inference input should be assumed as RGB `256x256` crops.
- Output is a single-channel logit map that should be passed through sigmoid and thresholded around `0.5`.
- This model should run only on leaves already judged diseased by the classifier, not on every crop/frame.

## Recommended pipeline contract for Gemini
### End-to-end stage order
1. Run YOLOv8n-seg on the full frame at `640x640`.
2. Extract each detected leaf ROI and corresponding mask.
3. Build a clean leaf crop for classification.
4. Resize classifier input to `224x224`, apply ImageNet normalization, and run MobileNetV2.
5. If class is healthy, skip lesion segmentation.
6. If class is diseased, prepare a lesion-analysis crop resized to `256x256` and run UNet.
7. Apply sigmoid + threshold to the UNet output to estimate lesion area ratio.
8. Combine detection geometry, class result, and lesion severity for downstream spray logic.

### Preprocessing requirements
- All models assume RGB input.
- Classifier and UNet both use ImageNet normalization mean/std.
- Shapes are static for ONNX/Hailo compatibility.
- The pipeline should not use dynamic input shapes.

### Output expectations
- YOLO output: leaf detections plus segmentation masks.
- Classifier output: 7-class disease/health logits or probabilities.
- UNet output: binary lesion probability map.
- Final downstream record per leaf should ideally include bounding box, mask, class label, confidence, lesion ratio, and any severity score.

### Important caveats for implementation
- The exact class-name order for the classifier comes from the ImageFolder directory order at training time, so Gemini should preserve or explicitly load the same label mapping.
- The classifier training code simulates 4x4 grid-like deployment behavior, so partial leaf crops are expected and should be handled gracefully.
- The lesion model is binary and should not be interpreted as multi-class segmentation.
- The UNet should be gated by classifier output to save compute on edge hardware.
- ONNX exports are intended to stay FP32/static before later Hailo compilation.

## Minimal deployment-ready assumptions for code generation
- Full-frame detector input: `1x3x640x640`.
- Classifier crop input: `1x3x224x224`.
- Lesion segmenter input: `1x3x256x256`.
- Detector ONNX/Hailo artifact corresponds to YOLOv8n-seg leaf segmentation.
- Classifier ONNX/Hailo artifact corresponds to MobileNetV2 disease classification.
- Lesion ONNX/Hailo artifact corresponds to UNet binary lesion segmentation.
