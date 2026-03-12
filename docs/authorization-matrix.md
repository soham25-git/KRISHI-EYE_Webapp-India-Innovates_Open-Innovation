# KRISHI-EYE — Authorization Matrix (BOLA/BFLA Enforcement)

> **Status:** Draft / Specification
> **Goal:** Definitive mapping of routes to ownership and role requirements.

## 1 — RBAC Definitions

| Role | Permissions |
|------|-------------|
| **Anonymous** | Authentication, OTP request/verify only |
| **Farmer** | Access to own farms, fields, tractors, jobs, tickets, and advisory logs |
| **Staff (Agronomist)** | View-only for assigned farm data; help ticket management |
| **Admin** | Full platform management; knowledge ingest; system metrics |

## 2 — Route Assignment & Ownership Guards

| Endpoint | Method | Required Role | Ownership Guard (BOLA Check) | Action |
|----------|--------|---------------|-------------------------------|--------|
| `/api/v1/me` | GET | Farmer+ | User context | Return `userId` match |
| `/api/v1/farms` | GET | Farmer+ | User context | Filter by `owner_user_id` or `farm_members` |
| `/api/v1/farms/:farmId` | ALL | Farmer+ | `farmId` owner/member | Validate `:farmId` relation to `actor_id` |
| `/api/v1/fields/:fieldId` | ALL | Farmer+ | `fieldId` → `farmId` owner | Join Field to Farm, check owner/member |
| `/api/v1/tractors/:tractorId` | ALL | Farmer+ | `tractorId` → `farmId` owner | Join Tractor to Farm, check owner/member |
| `/api/v1/jobs/:jobId` | GET | Farmer+ | `jobId` → `fieldId` owner | Join Job to Field/Farm, check owner |
| `/api/v1/telemetry/batch` | POST | Farmer+ | `tractorId` owner | Validate Tractor belongs to Farm owned by Actor |
| `/api/v1/support/tickets/:ticketId` | GET | Farmer+ | `userId` creator OR assigned Staff | Return 403 if ID exists but not owned |
| `/api/v1/support/tickets/:ticketId/escalate` | POST | Farmer+ | `userId` creator | Only creator can escalate |
| `/api/v1/ai/chat` | POST | Farmer+ | User context | Advisory log scoped to user |
| `/api/v1/ai/history` | GET | Farmer+ | User context | filter `advisory_logs` by `user_id` |

## 3 — Administrative Function-Level Matrix (BFLA)

| Endpoint | Method | Role | Extra Protection |
|----------|--------|------|------------------|
| `/api/v1/admin/knowledge-sources` | ALL | Admin | — |
| `/api/v1/admin/knowledge-sources/ingest` | POST | Admin | Re-auth (OTP) if > 15m since login |
| `/api/v1/admin/audit-logs` | GET | Admin | IP Allowlist |
| `/api/v1/admin/metrics` | GET | Admin | IP Allowlist |
| `/api/v1/demo/reset` | POST | Admin | **Disabled in Production** |

## 4 — Failure Behavior
- **Consistently return 403 Forbidden** on ownership violation to prevent enumeration (identifying if an ID exists or not).
- **Log all 403s** to `audit_logs` with actor ID and resource target.
