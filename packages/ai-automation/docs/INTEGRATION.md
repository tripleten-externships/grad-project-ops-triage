# AI Automation Integration Guide

## Overview
This guide explains how to integrate the AI automation service with the backend and other services.

---

## Architecture

```
┌──────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend   │────────>│   Backend (Node) │────────>│   AI Automation │
│              │         │                  │  webhook│   (Node/TS)     │
└──────────────┘         └──────────────────┘         └─────────────────┘
                                │                             │
                                │                             │
                                ▼                             ▼
                         ┌──────────────┐            ┌────────────────┐
                         │   Database   │            │  LLM API       │
                         │              │            │  (OpenAI, etc) │
                         └──────────────┘            └────────────────┘
                                                             │
                                                             ▼
                                                      ┌────────────────┐
                                                      │  DS Model API  │
                                                      │  (Optional)    │
                                                      └────────────────┘
```

---

## Backend Integration

### 1. Webhook Trigger

When a new request is created, backend sends webhook:

**Backend Code** (`packages/backend/src/services/webhook.service.ts`):
```typescript
import axios from 'axios';

export async function triggerAITriage(request: Request): Promise<void> {
  const aiAutomationUrl = process.env.AI_AUTOMATION_URL || 'http://localhost:8002';
  
  try {
    const response = await axios.post(
      `${aiAutomationUrl}/triage`,
      {
        request_id: request.id,
        title: request.title,
        description: request.description
      },
      {
        timeout: 15000 // 15 second timeout
      }
    );
    
    // Store AI predictions in request metadata
    await updateRequestMetadata(request.id, {
      ai_suggestion: response.data
    });
    
  } catch (error) {
    console.error('AI triage failed:', error.message);
    // Don't fail request creation if AI unavailable
  }
}
```

### 2. Display Suggestions to Agent

**Backend API Endpoint** (`packages/backend/src/routes/triage.routes.ts`):
```typescript
// GET /api/requests/:id/ai-suggestion
router.get('/:id/ai-suggestion', async (req, res) => {
  const request = await db.requests.findById(req.params.id);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  const aiSuggestion = request.ai_metadata?.ai_suggestion || null;
  
  res.json({
    request_id: request.id,
    ai_suggestion: aiSuggestion,
    current_category: request.category,
    current_priority: request.priority
  });
});
```

**Frontend Display** (`packages/frontend/src/pages/triage/TriagePage.tsx`):
```tsx
{aiSuggestion && (
  <div className="ai-suggestion-card">
    <h3>AI Suggestion</h3>
    <div>
      <strong>Category:</strong> {aiSuggestion.suggested_category}
      <span className="confidence">
        {(aiSuggestion.category_confidence * 100).toFixed(0)}% confident
      </span>
    </div>
    <div>
      <strong>Priority:</strong> {aiSuggestion.suggested_priority}
      <span className="confidence">
        {(aiSuggestion.priority_confidence * 100).toFixed(0)}% confident
      </span>
    </div>
    {aiSuggestion.summary && (
      <div><strong>Summary:</strong> {aiSuggestion.summary}</div>
    )}
    {aiSuggestion.needs_manual_review && (
      <div className="warning">⚠️ {aiSuggestion.review_reason}</div>
    )}
    <div className="actions">
      <button onClick={() => acceptSuggestion(aiSuggestion)}>
        Accept Suggestion
      </button>
      <button onClick={() => modifySuggestion()}>
        Modify
      </button>
    </div>
  </div>
)}
```

### 3. Track Accuracy

When agent finalizes triage:
```typescript
// PATCH /api/requests/:id/triage
router.patch('/:id/triage', async (req, res) => {
  const { category, priority, accepted_ai_suggestion } = req.body;
  
  const request = await db.requests.findById(req.params.id);
  const aiSuggestion = request.ai_metadata?.ai_suggestion;
  
  if (aiSuggestion) {
    // Log prediction accuracy
    await db.ai_predictions.update(request.id, {
      agent_category: category,
      agent_priority: priority,
      suggestion_accepted: accepted_ai_suggestion,
      category_correct: category === aiSuggestion.suggested_category,
      priority_correct: priority === aiSuggestion.suggested_priority
    });
  }
  
  // Update request
  request.category = category;
  request.priority = priority;
  await request.save();
  
  res.json(request);
});
```

---

## AI Automation API

### Endpoints

#### `POST /triage`
Categorize and prioritize a request.

**Request**:
```json
{
  "request_id": "uuid",
  "title": "string",
  "description": "string"
}
```

**Response** (matches `contracts/integration-points/ai-automation-input.schema.json`):
```json
{
  "request_id": "uuid",
  "suggested_category": "IT Support",
  "category_confidence": 0.87,
  "suggested_priority": "P1",
  "priority_confidence": 0.72,
  "summary": "User unable to access email...",
  "reasoning": "Email issues are IT Support...",
  "needs_manual_review": false,
  "model": "openai/gpt-3.5-turbo",
  "timestamp": "2026-02-04T12:00:00Z"
}
```

**Error Responses**:
- `400`: Invalid input
- `500`: Server error
- `503`: LLM API unavailable

#### `GET /health`
Health check.

**Response**:
```json
{
  "status": "healthy",
  "llm_provider": "openai",
  "ds_model_available": true
}
```

---

## Integration with DS Model

If DS Model package is deployed, AI automation can use it as fast path:

```typescript
// In AI automation config
USE_DS_MODEL_FALLBACK=true
DS_MODEL_API_URL=http://localhost:8001
```

**Flow**:
1. Try DS model first (200ms)
2. If confidence >= 0.7: Use DS prediction
3. If confidence < 0.7: Fall back to LLM

**Benefits**:
- 90% of requests use fast DS model
- LLM only for complex/ambiguous cases
- Significant cost savings

---

## Deployment

### Docker Compose

Add to root `docker-compose.yml`:
```yaml
services:
  ai-automation:
    build:
      context: ./packages/ai-automation
    ports:
      - "8002:8002"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LLM_PROVIDER=openai
      - OPENAI_MODEL=gpt-3.5-turbo
      - DS_MODEL_API_URL=http://ds-model-api:8000
      - BACKEND_URL=http://backend:3000
    depends_on:
      - backend
      - ds-model-api
```

### Environment Variables

See `.env.example` for full list. Key variables:
- `OPENAI_API_KEY`: Required
- `LLM_PROVIDER`: openai, anthropic, google
- `OPENAI_MODEL`: gpt-3.5-turbo or gpt-4
- `USE_DS_MODEL_FALLBACK`: true/false

---

## Monitoring & Observability

### Metrics to Track

1. **Latency**:
   - p50, p95, p99 response time
   - LLM API latency
   - DS model latency

2. **Accuracy**:
   - Category prediction accuracy
   - Priority prediction accuracy
   - Confidence calibration

3. **Usage**:
   - Requests per minute
   - Override rate (agent changes suggestion)
   - Acceptance rate (agent uses suggestion)

4. **Cost**:
   - Total API spend
   - Cost per request
   - Token usage

### Logging

All predictions logged with:
```typescript
{
  request_id,
  suggested_category,
  category_confidence,
  suggested_priority,
  priority_confidence,
  agent_final_category,  // Added when agent triages
  agent_final_priority,
  was_accepted,
  was_correct,
  model_used,
  latency_ms,
  timestamp
}
```

### Alerts

Set up alerts for:
- Latency > 10 seconds
- Error rate > 5%
- Daily cost > $50
- Accuracy < 75%

---

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
# Start backend and AI automation
docker-compose up backend ai-automation

# Run integration tests
npm run test:integration
```

### Load Testing
```bash
# Send 100 concurrent requests
npm run load-test
```

---

## Troubleshooting

**Q: AI suggestions not appearing in frontend**  
A: Check backend webhook is calling AI automation, check network logs

**Q: Latency is very high (>10s)**  
A: Check LLM API status, consider using GPT-3.5 instead of GPT-4

**Q: Low accuracy**  
A: Review and improve prompts, adjust confidence thresholds, collect more training data for DS model

**Q: High cost**  
A: Use DS model fallback, cache similar requests, use GPT-3.5 instead of GPT-4

---

## References

- Workflow Documentation: [`./WORKFLOW.md`](./WORKFLOW.md)
- Prompts: [`../prompts/`](../prompts/)
- Output Schema: `contracts/integration-points/ai-automation-input.schema.json`
- Backend Package: `packages/backend/`
- DS Model Package: `packages/data-science/`
