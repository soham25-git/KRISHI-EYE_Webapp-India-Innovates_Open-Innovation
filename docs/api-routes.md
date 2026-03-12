# API Routes (Web + App Phase)

## Auth
- POST /api/v1/auth/request-otp
- POST /api/v1/auth/verify-otp
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- GET /api/v1/auth/sessions
- DELETE /api/v1/auth/sessions/:sessionId

## Users & profiles
- GET /api/v1/me
- PATCH /api/v1/me
- GET /api/v1/me/farmer-profile
- PUT /api/v1/me/farmer-profile

## Farms & fields
- GET /api/v1/farms
- POST /api/v1/farms
- GET /api/v1/farms/:farmId
- PATCH /api/v1/farms/:farmId
- GET /api/v1/farms/:farmId/fields
- POST /api/v1/farms/:farmId/fields
- GET /api/v1/fields/:fieldId
- PATCH /api/v1/fields/:fieldId
- POST /api/v1/fields/:fieldId/boundary
- GET /api/v1/farms/:farmId/members
- POST /api/v1/farms/:farmId/members

## Tractors & jobs (logical/demo)
- GET /api/v1/tractors
- POST /api/v1/tractors
- GET /api/v1/tractors/:tractorId
- PATCH /api/v1/tractors/:tractorId
- POST /api/v1/tractors/:tractorId/jobs/start
- POST /api/v1/tractors/:tractorId/jobs/:jobId/stop
- GET /api/v1/jobs/:jobId
- GET /api/v1/jobs/:jobId/replay
- GET /api/v1/jobs/:jobId/heatmap
- GET /api/v1/jobs/:jobId/analytics

## Telemetry / demo data
- POST /api/v1/telemetry/batch
- GET /api/v1/telemetry/jobs/:jobId
- POST /api/v1/demo/seed-job
- POST /api/v1/demo/reset

## Support directory
- GET /api/v1/support/organizations
- GET /api/v1/support/contacts
- GET /api/v1/support/contacts?state=&district=&category=&issueType=
- POST /api/v1/support/tickets
- GET /api/v1/support/tickets/:ticketId
- PATCH /api/v1/support/tickets/:ticketId
- POST /api/v1/support/tickets/:ticketId/escalate

## AI assistant
- POST /api/v1/ai/chat
- POST /api/v1/ai/feedback
- POST /api/v1/ai/escalate
- GET /api/v1/ai/history
- GET /api/v1/ai/sources/:sourceId

## Analytics
- GET /api/v1/analytics/overview
- GET /api/v1/analytics/farms/:farmId/improvement
- GET /api/v1/analytics/jobs/:jobId/summary
- GET /api/v1/analytics/farms/:farmId/timeline

## Admin
- GET /api/v1/admin/knowledge-sources
- POST /api/v1/admin/knowledge-sources
- PATCH /api/v1/admin/knowledge-sources/:sourceId
- POST /api/v1/admin/knowledge-sources/ingest
- GET /api/v1/admin/support-contacts
- POST /api/v1/admin/support-contacts
- PATCH /api/v1/admin/support-contacts/:contactId
- GET /api/v1/admin/audit-logs
- GET /api/v1/admin/metrics
