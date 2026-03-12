# KRISHI-EYE — Rate Limit Policy

> **Status:** Specification
> **Goal:** Consistent API throttling to prevent abuse and ensure stability.

## 1 — Standard Tiers

| Tier | Window | Limit (Total requests) | Default Action |
|------|--------|-------------------------|----------------|
| **Global Default** | 1 minute | 60 | 429 Too Many Requests |
| **Auth** | 1 minute | 10 | 429 + Security Alert |
| **Telemetry** | 1 minute | 30 | 429 |
| **Admin** | 1 minute | 100 | 429 |
| **Internal (AI Proxy)** | 1 second | 50 | 429 |

## 2 — Endpoint-Specific Thresholds (P0)

| Endpoint | Window | Limit (per key) | Enforcement Key | S-Risk |
|----------|--------|-----------------|------------------|--------|
| `/api/v1/auth/request-otp` | 1 minute | 3 | IP Address | S-04 |
| `/api/v1/auth/verify-otp` | 15 minutes | 5 | Phone Number | S-04 |
| `/api/v1/auth/verify-otp` | 1 hour | 10 | IP Address | S-04 |
| `/api/v1/ai/chat` | 1 minute | 10 | User ID | Cost |
| `/api/v1/telemetry/batch` | 1 minute | 15 | Tractor ID | DoS |
| `/api/v1/support/tickets` | 1 hour | 20 | User ID | Spam |
| `/api/v1/admin/knowledge-sources/ingest` | 1 hour | 5 | Admin ID | SSRF |

## 3 — Secondary Lockout rules
- **Auth Lockout:** If 10 failed `verify-otp` attempts occur on a single phone number across IPs within 24 hours → **Permanently lock account** for manual admin review.
- **Bursted IP Lockout:** If an IP hits 1000 requests in 5 minutes (regardless of success/fail) → **Block IP for 24 hours**.

## 4 — Monitoring and Headers
- Required response headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- All 429s must be logged to a `rate_limit_violations` table or centralized logging for anomaly detection.
