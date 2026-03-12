
### `docs/database-schema.md`
```md
# Database Schema (Web + App First, No Hardware)

## Extensions
- postgis
- vector

## Tables

### users
- id UUID PK
- phone VARCHAR(20) UNIQUE NOT NULL
- name TEXT
- role TEXT NOT NULL
- preferred_language TEXT DEFAULT 'en'
- email TEXT NULL
- is_active BOOLEAN DEFAULT true
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### sessions
- id UUID PK
- user_id UUID REFERENCES users(id)
- refresh_token_hash TEXT NOT NULL
- device_label TEXT
- ip_address TEXT
- user_agent TEXT
- expires_at TIMESTAMPTZ NOT NULL
- created_at TIMESTAMPTZ NOT NULL
- revoked_at TIMESTAMPTZ NULL

### farmer_profiles
- id UUID PK
- user_id UUID UNIQUE REFERENCES users(id)
- village TEXT
- taluka TEXT
- district TEXT
- state TEXT
- primary_crop TEXT
- farm_size_acres NUMERIC(10,2)
- literacy_preference TEXT NULL
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### farms
- id UUID PK
- owner_user_id UUID REFERENCES users(id)
- name TEXT NOT NULL
- district TEXT NOT NULL
- state TEXT NOT NULL
- centroid GEOGRAPHY(POINT, 4326)
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### farm_members
- id UUID PK
- farm_id UUID REFERENCES farms(id)
- user_id UUID REFERENCES users(id)
- role TEXT NOT NULL
- created_at TIMESTAMPTZ NOT NULL

### fields
- id UUID PK
- farm_id UUID REFERENCES farms(id)
- name TEXT NOT NULL
- crop TEXT
- season TEXT
- area_acres NUMERIC(10,2)
- boundary GEOGRAPHY(POLYGON, 4326)
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### tractors
- id UUID PK
- farm_id UUID REFERENCES farms(id)
- label TEXT NOT NULL
- description TEXT
- color_hex TEXT
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### operation_jobs
- id UUID PK
- tractor_id UUID REFERENCES tractors(id)
- field_id UUID REFERENCES fields(id)
- status TEXT NOT NULL
- started_at TIMESTAMPTZ
- ended_at TIMESTAMPTZ
- avg_speed_kmph NUMERIC(8,2)
- total_distance_m NUMERIC(12,2)
- coverage_summary JSONB
- improvement_summary JSONB
- source_type TEXT DEFAULT 'manual_or_demo'
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### telemetry_points
- id BIGSERIAL PK
- tractor_id UUID REFERENCES tractors(id)
- job_id UUID REFERENCES operation_jobs(id)
- recorded_at TIMESTAMPTZ NOT NULL
- location GEOGRAPHY(POINT, 4326) NOT NULL
- speed_kmph NUMERIC(8,2)
- heading_deg NUMERIC(8,2)
- infection_intensity NUMERIC(8,2)
- heat_weight NUMERIC(8,2)
- progress_percent NUMERIC(5,2)
- extra JSONB
- created_at TIMESTAMPTZ NOT NULL

### analytics_snapshots
- id UUID PK
- farm_id UUID REFERENCES farms(id)
- period_label TEXT NOT NULL
- period_start TIMESTAMPTZ
- period_end TIMESTAMPTZ
- metrics JSONB NOT NULL
- created_at TIMESTAMPTZ NOT NULL

### support_organizations
- id UUID PK
- name TEXT NOT NULL
- category TEXT NOT NULL
- website TEXT
- is_verified BOOLEAN DEFAULT false
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### support_contacts
- id UUID PK
- organization_id UUID REFERENCES support_organizations(id)
- state TEXT
- district TEXT
- contact_name TEXT
- phone TEXT
- toll_free BOOLEAN DEFAULT false
- issue_types TEXT[]
- source_url TEXT
- verified_at TIMESTAMPTZ
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### support_tickets
- id UUID PK
- user_id UUID REFERENCES users(id)
- farm_id UUID REFERENCES farms(id)
- category TEXT
- description TEXT
- status TEXT NOT NULL
- priority TEXT
- assigned_to_user_id UUID NULL REFERENCES users(id)
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

### knowledge_sources
- id UUID PK
- title TEXT NOT NULL
- source_type TEXT NOT NULL
- source_url TEXT
- language TEXT DEFAULT 'en'
- region_state TEXT
- region_district TEXT
- crop TEXT
- published_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ
- checksum TEXT
- status TEXT DEFAULT 'active'
- created_at TIMESTAMPTZ NOT NULL

### knowledge_chunks
- id UUID PK
- source_id UUID REFERENCES knowledge_sources(id)
- chunk_text TEXT NOT NULL
- embedding VECTOR(1536)
- metadata JSONB
- created_at TIMESTAMPTZ NOT NULL

### advisory_logs
- id UUID PK
- user_id UUID REFERENCES users(id)
- farm_id UUID REFERENCES farms(id)
- question TEXT NOT NULL
- answer TEXT
- language TEXT
- confidence NUMERIC(5,4)
- source_ids UUID[]
- escalated BOOLEAN DEFAULT false
- created_at TIMESTAMPTZ NOT NULL

### audit_logs
- id UUID PK
- actor_user_id UUID NULL REFERENCES users(id)
- entity_type TEXT NOT NULL
- entity_id TEXT NOT NULL
- action TEXT NOT NULL
- metadata JSONB
- ip_address TEXT
- created_at TIMESTAMPTZ NOT NULL

### consent_records
- id UUID PK
- user_id UUID REFERENCES users(id)
- consent_type TEXT NOT NULL
- accepted BOOLEAN NOT NULL
- version TEXT NOT NULL
- created_at TIMESTAMPTZ NOT NULL

## Indexes
- GIST on fields.boundary
- GIST on farms.centroid
- GIST on telemetry_points.location
- BTREE on telemetry_points(recorded_at, job_id)
- BTREE on support_contacts(state, district)
- BTREE on analytics_snapshots(farm_id, period_start)
- BTREE on audit_logs(entity_type, entity_id, created_at)
- Vector index on knowledge_chunks.embedding
