# AI Service Integration Contract

The `apps/ai-service` does NOT handle end-user authentication or session management directly. 
It relies entirely on the NestJS `api-proxy` to act as the trusted boundary.

## Route Map

| User Endpoint (`apps/api`) | Internal Endpoint (`apps/ai-service`) | Purpose |
|----------------------------|-----------------------------------------|---------|
| `POST /api/v1/ai/chat` | `POST /advisory/ask` | Retrieve response to a farmer's question |
| `POST /api/v1/ai/feedback` | `POST /advisory/feedback` | Log user feedback on an answer |
| `POST /api/v1/ai/escalate` | `POST /advisory/escalate` | Elevate question to support |
| `GET /api/v1/ai/history` | `GET /advisory/history` | Pageable question history |
| `GET /api/v1/ai/sources/:id`| `GET /advisory/sources/{source_id}` | Fetch chunk details of a cited source |
| `POST /api/v1/admin/…/ingest`| `POST /admin/ingest` | Trigger the retrieval ingest pipeline |

## Header Forwarding

The NestJS proxy **MUST** forward the following headers after verifying the user's JWT:
- `X-User-Id`: The UUID of the authenticated user.
- `X-Farm-Id` (Optional): The UUID of the active farm context.
- `X-Request-Id` (Optional): Trace ID for distributed logging.

If `X-User-Id` is missing, the AI service will return `401 Unauthorized`.

## Network Isolation

In staging and production environments, the AI Service should not be exposed to the public internet directly. Only the NestJS backend should be able to communicate with the AI Service over the internal network (e.g. Docker bridged network or VPC).
