# 🏗️ System Architecture

## High-Level Flow
```mermaid
sequenceDiagram
    Farmer->>+Web: Upload crop image
    Web->>+API: Process request
    API->>+AI: Disease detection
    AI->>AI: YOLOv8 segmentation → EfficientNet classification
    AI->>+VectorDB: RAG advisory
    AI->>-API: Detection + advisory
    API->>-Web: JSON response
    Web->>-Farmer: Heatmap + spray plan
```

## Data Flow
| Stage | Input | Model | Output |
|-------|-------|--------|--------|
| 1. Leaf Detection | Crop image | YOLOv8-seg | Bounding boxes |
| 2. Disease Class | Leaf crop | EfficientNet-B0 | Disease type + confidence |
| 3. Advisory | Disease + location | RAG (PGVector) | Treatment + KVK contacts |
| 4. Spraying | Detection map | Heatmap algo | 6-lane spray pattern |
