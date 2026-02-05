# Data Science Model Integration Guide

## Overview
This document explains how the Software Engineering team integrates the DS model predictions into the Request Management System backend.

---

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Frontend  │────────>│  Backend (Node)  │────────>│   Database  │
└─────────────┘         └──────────────────┘         └─────────────┘
                               │
                               │ HTTP POST /predict
                               ▼
                        ┌──────────────────┐
                        │  DS Model API    │
                        │  (Python/FastAPI)│
                        └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Trained Models  │
                        │  (pickle files)  │
                        └──────────────────┘
```

---

## Integration Flow

### Scenario 1: Request Submission (US-01)

1. **User submits request** via frontend
2. **Backend receives** request data
3. **Backend calls DS API** (optional, for auto-suggestions)
   ```javascript
   POST http://localhost:8001/predict
   {
     "title": "Password reset needed",
     "description": "I forgot my password"
   }
   ```
4. **DS API returns predictions**:
   ```json
   {
     "predicted_category": "IT Support",
     "category_confidence": 0.87,
     "predicted_priority": "P2",
     "priority_confidence": 0.72,
     "model_version": "1.0.0",
     "timestamp": "2026-02-04T12:00:00Z"
   }
   ```
5. **Backend stores predictions** in `ai_metadata` field
6. **Frontend shows suggestions** to requester (optional)

### Scenario 2: Agent Triage (US-02)

1. **Agent opens request** for triage
2. **Backend fetches** stored predictions from database
3. **Frontend displays** AI suggestions with confidence scores
4. **Agent reviews** and accepts/rejects/modifies predictions
5. **Backend updates** category and priority with agent's final decision
6. **Backend tracks** prediction accuracy (for monitoring)

---

## API Endpoints

### DS Model API

#### `POST /predict`
Predict category and priority for a request.

**Request:**
```json
{
  "title": "string (required, 1-500 chars)",
  "description": "string (required)",
  "confidence_threshold": "float (optional, default 0.6)"
}
```

**Response:** (matches `ds-model-output.schema.json`)
```json
{
  "predicted_category": "string | null",
  "category_confidence": "float (0-1)",
  "predicted_priority": "string | null",
  "priority_confidence": "float (0-1)",
  "model_version": "string",
  "timestamp": "string (ISO 8601)"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid request
- `503`: Models not loaded
- `500`: Server error

#### `GET /health`
Check if models are loaded and ready.

**Response:**
```json
{
  "status": "healthy",
  "model_version": "1.0.0"
}
```

#### `GET /model-info`
Get model metadata.

**Response:**
```json
{
  "model_version": "1.0.0",
  "category_classes": ["IT Support", "HR", ...],
  "priority_classes": ["P0", "P1", "P2", "P3"],
  "feature_count": 1000
}
```

---

## Backend Integration (Node.js/TypeScript)

### 1. Add DS API Client

**File**: `packages/backend/src/services/ds-model.service.ts`

```typescript
import axios from 'axios';

const DS_API_URL = process.env.DS_API_URL || 'http://localhost:8001';

interface DSPrediction {
  predicted_category: string | null;
  category_confidence: number;
  predicted_priority: string | null;
  priority_confidence: number;
  model_version: string;
  timestamp: string;
}

export async function getPrediction(
  title: string,
  description: string,
  confidenceThreshold: number = 0.6
): Promise<DSPrediction | null> {
  try {
    const response = await axios.post(`${DS_API_URL}/predict`, {
      title,
      description,
      confidence_threshold: confidenceThreshold
    }, {
      timeout: 5000 // 5 second timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('DS model prediction failed:', error.message);
    // Don't fail the request if DS model is unavailable
    return null;
  }
}

export async function checkDSHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${DS_API_URL}/health`, { timeout: 2000 });
    return response.data.status === 'healthy';
  } catch {
    return false;
  }
}
```

### 2. Update Request Creation

**File**: `packages/backend/src/services/request.service.ts`

```typescript
import { getPrediction } from './ds-model.service';

export async function createRequest(data: CreateRequestDTO) {
  // Get DS model prediction (non-blocking)
  const prediction = await getPrediction(data.title, data.description);
  
  // Create request in database
  const request = await db.requests.create({
    title: data.title,
    description: data.description,
    category: data.category, // User's input (may be pre-filled)
    priority: data.priority, // User's input (may be pre-filled)
    ai_metadata: prediction ? {
      ds_prediction: prediction,
      prediction_applied: false // Track if agent accepted
    } : null,
    status: 'pending',
    requestedBy: data.userId,
    createdAt: new Date()
  });
  
  return request;
}
```

### 3. Triage API Endpoint

**File**: `packages/backend/src/routes/triage.routes.ts`

```typescript
// GET /api/requests/:id/suggestions
router.get('/:id/suggestions', async (req, res) => {
  const request = await db.requests.findById(req.params.id);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  // Return stored AI predictions if available
  const suggestions = request.ai_metadata?.ds_prediction || null;
  
  res.json({
    request_id: request.id,
    suggestions: suggestions,
    current_category: request.category,
    current_priority: request.priority
  });
});

// PATCH /api/requests/:id/triage
router.patch('/:id/triage', async (req, res) => {
  const { category, priority, accepted_ai_suggestion } = req.body;
  
  const request = await db.requests.findById(req.params.id);
  
  // Update request
  request.category = category;
  request.priority = priority;
  
  // Track if AI suggestion was accepted (for accuracy monitoring)
  if (request.ai_metadata?.ds_prediction) {
    request.ai_metadata.prediction_applied = accepted_ai_suggestion;
    request.ai_metadata.agent_category = category;
    request.ai_metadata.agent_priority = priority;
  }
  
  await request.save();
  
  res.json(request);
});
```

---

## Data Contract

### Request Schema
See `contracts/schemas/request.schema.json` for the full request object structure.

**Relevant Fields**:
```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "P0 | P1 | P2 | P3",
  "ai_metadata": {
    "ds_prediction": { /* DS model output */ },
    "prediction_applied": "boolean",
    "agent_category": "string (for accuracy tracking)",
    "agent_priority": "string (for accuracy tracking)"
  }
}
```

### DS Model Output Schema
See `contracts/integration-points/ds-model-output.schema.json`

---

## Deployment

### Development
```bash
# Terminal 1: Start DS API
cd packages/data-science
source venv/bin/activate
python api/app.py

# Terminal 2: Start Backend
cd packages/backend
npm run dev
```

### Docker Compose
Add DS service to `docker-compose.yml`:

```yaml
services:
  ds-model-api:
    build:
      context: ./packages/data-science
      dockerfile: api/Dockerfile
    ports:
      - "8001:8000"
    environment:
      - MODEL_VERSION=1.0.0
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  
  backend:
    # ... existing config
    environment:
      - DS_API_URL=http://ds-model-api:8000
    depends_on:
      - ds-model-api
```

### Production
<!-- TODO: Define production deployment strategy -->
- Deploy DS API to cloud (AWS Lambda, GCP Cloud Run, etc.)
- Use environment variable for `DS_API_URL`
- Implement retry logic and circuit breakers
- Monitor API latency and availability

---

## Error Handling

### DS API Unavailable
- Backend should continue to function if DS API is down
- Return `null` for predictions
- Log errors but don't fail request creation
- Frontend should hide AI suggestions if unavailable

### Low Confidence Predictions
- If confidence < threshold, return `null` for that field
- Agent proceeds with manual categorization
- Track low-confidence rate for model improvement

### Timeout Handling
- Set reasonable timeout (5 seconds)
- Use async/await with try-catch
- Don't block user requests

---

## Monitoring

### Metrics to Track
1. **DS API Availability**: Uptime, response time
2. **Prediction Usage**: % of requests with predictions
3. **Confidence Distribution**: Mean confidence scores
4. **Accuracy**: Compare predictions to agent's final classification
5. **Override Rate**: % of times agent changes prediction

### Dashboards
- **BIA Package**: Create dashboard for prediction metrics
- **Alert**: If accuracy < 70% or availability < 95%

### Logging
```typescript
logger.info('DS prediction received', {
  request_id,
  predicted_category,
  category_confidence,
  predicted_priority,
  priority_confidence,
  model_version
});

logger.info('Agent triage complete', {
  request_id,
  final_category,
  final_priority,
  ai_suggestion_accepted,
  prediction_was_correct: final_category === predicted_category
});
```

---

## Testing

### Unit Tests
```typescript
// Mock DS API
jest.mock('./ds-model.service', () => ({
  getPrediction: jest.fn().mockResolvedValue({
    predicted_category: 'IT Support',
    category_confidence: 0.85,
    predicted_priority: 'P2',
    priority_confidence: 0.70,
    model_version: '1.0.0',
    timestamp: '2026-02-04T12:00:00Z'
  })
}));
```

### Integration Tests
- Test backend with real DS API running
- Test error handling when DS API is down
- Test confidence thresholding

---

## FAQ

**Q: Is DS API required for the system to work?**  
A: No, it's optional. Backend gracefully handles unavailability.

**Q: Should we call DS API on every request?**  
A: Recommended for new requests. Can be skipped for request updates.

**Q: How do we handle multiple AI systems (DS + LLM)?**  
A: See `packages/ai-automation/docs/INTEGRATION.md`. May use DS for structured prediction, LLM for text generation.

**Q: Can we batch predictions?**  
A: Yes, DS API supports `predict_batch` in Python client. Can expose batch endpoint if needed.

---

## References

- **Model Card**: `packages/data-science/docs/MODEL-CARD.md`
- **API Docs**: `http://localhost:8001/docs` (FastAPI auto-generated)
- **Output Schema**: `contracts/integration-points/ds-model-output.schema.json`
- **Backend Package**: `packages/backend/`
- **AI Automation Package**: `packages/ai-automation/`

---

## Support

For integration issues:
- **DS Team**: Model API, predictions, retraining
- **SE Team**: Backend integration, deployment
- **DevOps**: Infrastructure, monitoring
