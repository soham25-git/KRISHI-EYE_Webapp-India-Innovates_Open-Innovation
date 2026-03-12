# KRISHI-EYE — Data Retention Policy (DPDP Act Compliance)

> **Status:** Specification
> **Goal:** Minimize personal data storage and define clear deletion/anonymization TTLs.

## 1 — Data Classification Tiers

| Tier | PII / Sensitive | Retention Period | Post-Retention Action |
|------|-----------------|------------------|----------------------|
| **User Identity** | Yes | Duration of account + 180 days | Delete (hard delete) |
| **Auth Sessions** | Yes | 90 days after expiry/revocation | Delete |
| **Audit Logs** | Low | 1 Year (7 years for admin logs) | Archive / Delete |
| **Advisory Logs (Chat)** | Yes | 180 days (Live) | Anonymize question, delete metadata |
| **Telemetry (GPS)** | No | 2 Years (Aggregate after 6 mo) | Archive as static geo-data |
| **Support Tickets** | Medium | 3 Years after closure | Delete / Archive |
| **Knowledge (RAG)** | No | Active while source is relevant | Delete source binary, keep index |

## 2 — Sensitive Field Redaction Rules (S-09, S-10)

| Table | Field | Retention | Rule |
|-------|-------|-----------|------|
| `sessions` | `ip_address` | 30 Days | Truncate to /24 (IPv4) or mask (/64 IPv6) |
| `sessions` | `user_agent` | 30 Days | Replace with browser name/version |
| `advisory_logs` | `question` | 180 Days | Remove PII via regex or AI scrubber; hash User ID |
| `telemetry_points` | `recorded_at`| 2 Years | Round to nearest minute for historical data |

## 3 — Account Deletion Workflow (S-25)
- User triggers `DELETE /api/v1/me` → **Soft delete 30 days** (undo allowed).
- After **31 days** → **Permanent delete**:
  - `users`: Hard delete.
  - `sessions`: Hard delete.
  - `farms/fields/tractors`: Hard delete.
  - `advisory_logs/tickets`: Anonymize (strip PII, change `user_id` to `deleted_user_UUID`).

## 4 — Implementation requirements
- [ ] Add `expires_at` column to `sessions` and `advisory_logs`.
- [ ] Schedule daily `cleanup_job` for rows where `now() > expires_at`.
- [ ] Implementation of `GET /api/v1/me/export` for data portability.
- [ ] Implementation of `X-Data-Age` response header for transparency.

---

> [!CAUTION] 
> **Never store raw phone numbers** in application logs or secondary indices. Use the hashed version for lookups where feasible.
