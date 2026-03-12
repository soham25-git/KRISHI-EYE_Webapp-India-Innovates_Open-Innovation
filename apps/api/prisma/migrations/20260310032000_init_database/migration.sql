-- Init Migration for KRISHI-EYE Phase 2 (Hardened)
-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- users table
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone" VARCHAR(20) NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL,
    "preferred_language" TEXT NOT NULL DEFAULT 'en',
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CREATE UNIQUE INDEX
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- sessions table
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "device_label" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- sessions-user_id foreign key
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- farmer_profiles table
CREATE TABLE "farmer_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "village" TEXT,
    "taluka" TEXT,
    "district" TEXT,
    "state" TEXT,
    "primary_crop" TEXT,
    "farm_size_acres" DECIMAL(10,2),
    "literacy_preference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmer_profiles_pkey" PRIMARY KEY ("id")
);

-- farmer_profiles uniqueness
CREATE UNIQUE INDEX "farmer_profiles_user_id_key" ON "farmer_profiles"("user_id");
ALTER TABLE "farmer_profiles" ADD CONSTRAINT "farmer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- farms table (with PostGIS centroid)
CREATE TABLE "farms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "centroid" geography(Point, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "farms" ADD CONSTRAINT "farms_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "farms_centroid_idx" ON "farms" USING GIST ("centroid");

-- farm_members table
CREATE TABLE "farm_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "farm_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farm_members_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "farm_members" ADD CONSTRAINT "farm_members_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "farm_members" ADD CONSTRAINT "farm_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- fields table (with PostGIS boundary)
CREATE TABLE "fields" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "farm_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "crop" TEXT,
    "season" TEXT,
    "area_acres" DECIMAL(10,2),
    "boundary" geography(Polygon, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "fields" ADD CONSTRAINT "fields_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "fields_boundary_idx" ON "fields" USING GIST ("boundary");

-- tractors table
CREATE TABLE "tractors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "farm_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "color_hex" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tractors_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tractors" ADD CONSTRAINT "tractors_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- operation_jobs table
CREATE TABLE "operation_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tractor_id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "avg_speed_kmph" DECIMAL(8,2),
    "total_distance_m" DECIMAL(12,2),
    "coverage_summary" JSONB,
    "improvement_summary" JSONB,
    "source_type" TEXT NOT NULL DEFAULT 'manual_or_demo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operation_jobs_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "operation_jobs" ADD CONSTRAINT "operation_jobs_tractor_id_fkey" FOREIGN KEY ("tractor_id") REFERENCES "tractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operation_jobs" ADD CONSTRAINT "operation_jobs_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- telemetry_points table (BigInt ID + npippe location)
CREATE TABLE "telemetry_points" (
    "id" BIGSERIAL NOT NULL,
    "tractor_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "location" geography(Point, 4326) NOT NULL,
    "speed_kmph" DECIMAL(8,2),
    "heading_deg" DECIMAL(8,2),
    "infection_intensity" DECIMAL(8,2),
    "heat_weight" DECIMAL(8,2),
    "progress_percent" DECIMAL(5,2),
    "extra" JSONB,

    CONSTRAINT "telemetry_points_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "telemetry_points" ADD CONSTRAINT "telemetry_points_tractor_id_fkey" FOREIGN KEY ("tractor_id") REFERENCES "tractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "telemetry_points" ADD CONSTRAINT "telemetry_points_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "operation_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "telemetry_points_location_idx" ON "telemetry_points" USING GIST ("location");
CREATE INDEX "telemetry_points_recorded_at_job_id_idx" ON "telemetry_points"("recorded_at", "job_id");

-- analytics_snapshots table
CREATE TABLE "analytics_snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "farm_id" UUID NOT NULL,
    "period_label" TEXT NOT NULL,
    "period_start" TIMESTAMP(3),
    "period_end" TIMESTAMP(3),
    "metrics" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "analytics_snapshots" ADD CONSTRAINT "analytics_snapshots_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "analytics_snapshots_farm_id_period_start_idx" ON "analytics_snapshots"("farm_id", "period_start");

-- support_organizations table
CREATE TABLE "support_organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "website" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_organizations_pkey" PRIMARY KEY ("id")
);

-- support_contacts table
CREATE TABLE "support_contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "state" TEXT,
    "district" TEXT,
    "contact_name" TEXT,
    "phone" TEXT,
    "toll_free" BOOLEAN NOT NULL DEFAULT false,
    "issue_types" TEXT[],
    "source_url" TEXT,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_contacts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "support_contacts" ADD CONSTRAINT "support_contacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "support_organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "support_contacts_state_district_idx" ON "support_contacts"("state", "district");

-- support_tickets table
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "farm_id" UUID,
    "category" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "priority" TEXT,
    "assigned_to_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- knowledge_sources table
CREATE TABLE "knowledge_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_url" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "region_state" TEXT,
    "region_district" TEXT,
    "crop" TEXT,
    "published_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "checksum" TEXT,
    "status" TEXT DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_sources_pkey" PRIMARY KEY ("id")
);

-- knowledge_chunks table (with Vector)
CREATE TABLE "knowledge_chunks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" UUID NOT NULL,
    "chunk_text" TEXT NOT NULL,
    "embedding" vector(1536),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "knowledge_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "knowledge_chunks_embedding_idx" ON "knowledge_chunks" USING hnsw ("embedding" vector_cosine_ops);

-- advisory_logs table
CREATE TABLE "advisory_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "farm_id" UUID,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "language" TEXT,
    "confidence" DECIMAL(5,4),
    "source_ids" TEXT[],
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advisory_logs_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "advisory_logs" ADD CONSTRAINT "advisory_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "advisory_logs" ADD CONSTRAINT "advisory_logs_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- audit_logs table
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_entity_type_entity_id_created_at_idx" ON "audit_logs"("entity_type", "entity_id", "created_at");

-- consent_records table
CREATE TABLE "consent_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "consent_type" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
