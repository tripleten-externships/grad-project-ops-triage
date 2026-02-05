# Backend API Documentation

This document describes the REST API endpoints provided by the backend service.

> **Note**: For the full API contract specification, see [`contracts/schemas/api-contract.yml`](../../../contracts/schemas/api-contract.yml)

## Base URL

```
http://localhost:4000/api
```

## Authentication

> **TODO**: Authentication is not yet implemented. All endpoints are currently open.

## Endpoints

### Requests

#### List Requests

```
GET /api/requests
```

Query parameters:
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `category` (optional): Filter by category
- `assigned_to` (optional): Filter by assigned agent

Response: `200 OK`
```json
[
  {
    "id": "REQ-000001",
    "title": "Cannot access billing dashboard",
    "description": "...",
    "category": "billing",
    "priority": "P1",
    "status": "in_progress",
    ...
  }
]
```

#### Get Request by ID

```
GET /api/requests/:id
```

Response: `200 OK` or `404 Not Found`

#### Create Request

```
POST /api/requests
```

Request body:
```json
{
  "title": "Issue summary",
  "description": "Detailed description",
  "category": "technical",
  "priority": "P2",
  "requester_type": "paid",
  "channel": "web_form",
  "status": "new"
}
```

Response: `201 Created`

#### Update Request

```
PATCH /api/requests/:id
```

Request body: (partial update)
```json
{
  "status": "in_progress",
  "assigned_to": "agent-001"
}
```

Response: `200 OK` or `404 Not Found`

#### Delete Request

```
DELETE /api/requests/:id
```

Response: `204 No Content` or `404 Not Found`

### Triage Operations

#### Assign Request

```
POST /api/triage/:id/assign
```

Request body:
```json
{
  "agent_id": "agent-001"
}
```

Response: `200 OK`

#### Update Priority

```
PATCH /api/triage/:id/priority
```

Request body:
```json
{
  "priority": "P1"
}
```

Response: `200 OK`

### Analytics

#### Get Metrics

```
GET /api/analytics/metrics
```

Query parameters:
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string

Response: `200 OK`
```json
{
  "total_requests": 100,
  "by_status": {...},
  "by_priority": {...},
  "avg_resolution_time": 24.5,
  "sla_compliance": 85.5
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [...]
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Request REQ-000001 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error message"
}
```

## Webhooks

The backend emits webhook events for request lifecycle changes. See [`contracts/schemas/event-contract.yml`](../../../contracts/schemas/event-contract.yml) for event schemas.

Event types:
- `request.created`
- `request.updated`
- `request.assigned`
- `request.priority_changed`
- `request.status_changed`
- `request.resolved`
- `request.closed`

Configure webhook URL via `WEBHOOK_URL` environment variable.

## Rate Limiting

> **TODO**: Rate limiting not yet implemented

## Pagination

> **TODO**: Pagination not yet implemented

## TODO Features

- [ ] Authentication with JWT
- [ ] Role-based access control
- [ ] Request validation middleware
- [ ] Pagination for list endpoints
- [ ] Sorting options
- [ ] Advanced filtering
- [ ] Full-text search
- [ ] File attachments
- [ ] Activity logging
- [ ] OpenAPI/Swagger documentation
