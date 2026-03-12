# KRISHI-EYE n8n Detailed Workflow Specifications

This document defines the logic, security, and error-handling steps for each n8n workflow.

---

## [W1] Support Contact Import
**Objective**: Synchronize user-friendly Google Sheet/CSV sources to the backend.

### Workflow Nodes:
1. **Trigger**: Webhook or Google Sheet `Row Created/Updated`.
2. **Security Node**: `Code Node` (JavaScript) to verify `X-KRISHI-SIGNATURE` (HMAC-SHA256) using a secret.
3. **Replay Filter**: Check `timestamp` header (reject if older than 5 mins).
4. **Data Processor**: Map Excel/Sheet columns (e.g., "Full Name" -> "name").
5. **Idempotency**: Generate a hash of the row data; use as `X-Idempotency-Key` in header.
6. **HTTP Request**: `POST /api/v1/admin/support-contacts` with `SUPPORT_IMPORT_TOKEN`.
7. **Error Handler**: On 4xx/5xx, retry 3 times (Backoff: 5, 25, 125 mins). If all fail, route to W7.

---

## [W2] Nightly Knowledge Refresh
**Objective**: Scheduled daily re-ingestion for AI assistant's ground knowledge.

### Workflow Nodes:
1. **Schedule Trigger**: `17 2 * * *` (Offset to prevent top-of-hour contention).
2. **HTTP Request**: `POST /api/v1/admin/knowledge-sources/ingest` with `INGEST_SERVICE_TOKEN`.
3. **Confirmation**: Wait for 202 Accepted status.

---

## [W3] Critical Ticket Notification
**Objective**: Real-time push for high-priority support issues.

### Workflow Nodes:
1. **Webhook Trigger**: `POST` from backend services.
2. **Security**: Validate JWT scope (`notifications:write`).
3. **Filter**: Continue only if `priority` is `CRITICAL` or `HIGH`.
4. **Integration Node**: Format generic Markdown for Slack/Discord/Email.
5. **Conditional Branch**: Route based on `category` (Agronomy vs UI bugs).

---

## [W4] Demo Data Reseed (EXPO MODE ONLY)
**Objective**: Reset the environment for fresh demo presentations.

### Workflow Nodes:
1. **Cron Trigger**: `47 */6 * * *` (Offset 13 mins).
2. **Environment Guard**: `Code Node` checking `ENV_NAME`. If `ENV_NAME === 'prod'`, end workflow.
3. **Concurrency Lock**: 
   - HTTP Get `/api/v1/admin/lock?key=demo-reseed`.
   - If `locked === true`, abort and notify infra.
4. **Lock Acquisition**: HTTP Post `/api/v1/admin/lock?key=demo-reseed&ttl=300`.
5. **Sequence**:
   - `DELETE /api/v1/demo/reset` (with `DEMO_RESEED_TOKEN`).
   - `POST /api/v1/demo/seed-job`.
6. **Cleanup**: Clear lock.

---

## [W7] Global Error Handler (DLQ)
**Objective**: Unified alerting and dead-letter storage for automation failures.

### Triggering:
- Workflows route to this if they exhaust retries or encounter a logic fatal error.
- GitHub Actions `POST` to this if health checks fail catastrophically.

### Nodes:
1. **Webhook / Entry Node**: Standardized JSON input (workflow name, error, timestamp, owner).
2. **Redaction Node**: Ensures any accidentally leaked secrets or PII are stripped.
   - *Regex*: Mask any values matching `bearer ` or `key=`.
   - *Key Stripping*: Remove `payload.raw_body` if it contains object keys like `email` or `ticket_description`.
3. **Escalation Router**: 
   - If `workflow_id == W4` AND `env == prod`, trigger **Critical Alarm** (P0).
   - Else, standard alert.
4. **Action - Discord**: Post color-coded embed to `#monitoring-alerts`.
5. **Action - Logging**: Append to `admin_ops_log` Google Sheet.

---

## Global Data Redaction & Replay Protection

### 1. The Redaction Proxy Pattern
All n8n workflows MUST use a reusable `Redaction Proxy` (Code Node) before any external call:
```javascript
const sensitiveKeys = ['phone', 'email', 'auth', 'token', 'key', 'secret'];
return items.map(item => {
  const json = { ...item.json };
  sensitiveKeys.forEach(k => {
    if (json[k]) json[k] = '[REDACTED]';
  });
  return { json };
});
```

### 2. Manual Reseed Safeguard
Even if an operator manually executes W4 in n8n, the **Environment Guard** node performs a mandatory lookup for a `FORCE_PROD_RESEED` flag (default: `false`) in the secure Vault. If not found and env is Prod, the node emits a `SYSTEM_HALT` signal.

### 3. Workflow Ownership
| ID | Workflow Name | Owner | Slack/Discord |
|----|---------------|-------|---------------|
| W1 | Support Import | Data Ops | `@data-ops-oncall` |
| W2 | AI Ingest | AI Team | `@ai-engineer` |
| W3 | Ticket Alerts | CS Team | `@cs-manager` |
| W4 | Demo Reseed | Marketing | `@demo-lead` |
| W5 | Health Checks | DevOps | `@devops-lead` |
| W6 | Security Audit | Sec Ops | `@sec-ops` |
