# Phase 1 Demo Data Contract

> **MANDATORY INPUT:** This document defines the exact shape of the seeded demo dataset. Backend, web, mobile, ai-service, and database agents **must** use these structures to ensure cross-service compatibility in Phase 1 before real data is available.

---

## 1. Farms
Total seeded: `2`

| Field | Type | Example / Note |
|---|---|---|
| `id` | UUID | |
| `owner_user_id` | UUID | (Belongs to the demo user) |
| `name` | String | "Green Acres Farm", "Sunrise Valley" |
| `district` | String | "Nashik" |
| `state` | String | "Maharashtra" |
| `centroid` | Point (GeoJSON) | `[73.7898, 19.9975]` |

---

## 2. Fields
Total seeded: `3` (Across the 2 farms)

| Field | Type | Example / Note |
|---|---|---|
| `id` | UUID | |
| `farm_id` | UUID | |
| `name` | String | "North Plot", "River Block" |
| `crop` | String | "Grapes", "Onions" |
| `season` | String | "Kharif 2026" |
| `area_acres` | Number | `4.5` |
| `boundary` | Polygon (GeoJSON) | Valid coordinate array |

---

## 3. Tractors
Total seeded: `2`

| Field | Type | Example / Note |
|---|---|---|
| `id` | UUID | |
| `farm_id` | UUID | |
| `label` | String | "Mahindra 575 DI", "Swaraj 744 XM" |
| `color_hex` | String | `"#FF0000"`, `"#0000FF"` |

---

## 4. Operation Jobs
Total seeded: `4`

| Field | Type | Example / Note |
|---|---|---|
| `id` | UUID | |
| `tractor_id` | UUID | |
| `field_id` | UUID | |
| `status` | String | `"completed"` |
| `started_at` | ISO Date | |
| `ended_at` | ISO Date | |
| `avg_speed_kmph` | Number | `4.2` |
| `total_distance_m` | Number | `2450.0` |
| `coverage_summary` | JSON | `{ "percent": 95, "missed_patches": 2 }` |

---

## 5. Telemetry Points
Total seeded: `~200 per Job`

| Field | Type | Example / Note |
|---|---|---|
| `job_id` | UUID | |
| `recorded_at` | ISO Date | Incremental timestamps |
| `location` | Point (GeoJSON) | Along the field route |
| `speed_kmph` | Number | `3.5 - 5.0` |
| `heading_deg` | Number | `0 - 360` |
| `infection_intensity` | Number | `0.0 - 1.0` (For heatmap red/yellow/green) |
| `heat_weight` | Number | `0.0 - 1.0` |

---

## 6. Analytics Snapshots
Total seeded: `3 periods per farm` (e.g., Last Week, Last Month, Last Season)

| Field | Type | Example / Note |
|---|---|---|
| `farm_id` | UUID | |
| `period_label` | String | "March 2026" |
| `metrics` | JSON | `{ "coverage_percent": 92, "savings_inr": 4500, "detection_count": 12 }` |

---

## 7. Support Directory
Total seeded: `3 Organizations, 15 Contacts`

| Field | Type | Example / Note |
|---|---|---|
| `organization.name` | String | "Kisan Call Center", "Agri-Extension KV" |
| `contact.state` | String | "Maharashtra", "Gujarat" |
| `contact.district` | String | "Nashik", "Surat" |
| `contact.phone` | String | "1800-180-1551" |
| `contact.toll_free` | Boolean | `true` or `false` |
| `contact.issue_types` | Array[String] | `["Pest Control", "Subsidies"]` |

---

## 8. AI Advisory Logs (Mock History & Source Check)
Total seeded: `5 sample Q&A pairs`

| Field | Type | Example / Note |
|---|---|---|
| `question` | String | "How much urea should I add to my onions?" |
| `answer` | String | "Based on ..., you should..." (Must refuse dosage if high risk) |
| `confidence` | String | `"high"`, `"medium"`, `"low"` |
| `source_ids` | Array[UUID] | Maps to seeded knowledge sources |
| `language` | String | `"en"`, `"hi"`, `"mr"` |

---

> **Note for API and Web/Mobile Agents:** The frontend will rely on `GET /api/v1/demo/seed-job` (admin) to ensure data exists, and then fetch normally via the standard `/fields`, `/jobs`, `/analytics`, and `/support` endpoints.
