# AI Automation Workflow Documentation

## Overview
This document describes the end-to-end workflow for AI-powered request triage automation.

---

## Workflow Diagram

See [`../workflows/workflow-diagram.mmd`](../workflows/workflow-diagram.mmd) for visual representation.

---

## Detailed Flow

### 1. Trigger: New Request Created

**Event Source**: Backend webhook  
**Endpoint**: `POST /triage`  
**Payload**:
```json
{
  "request_id": "uuid",
  "title": "Request title",
  "description": "Request description"
}
```

---

### 2. Input Validation

**Checks**:
- Required fields present (request_id, title, description)
- Description length >= 10 characters
- Description length <= 5000 characters
- Valid UTF-8 encoding

**On Failure**: Return 400 error to backend

---

### 3. Sensitive Content Detection

**Scanned For**:
- PII (SSN, credit cards, emails)
- Sensitive keywords (termination, harassment, legal)
- Confidential markers

**Actions**:
- If PII detected: Flag for redaction
- If sensitive: Auto-assign HR category + manual review flag

---

### 4. DS Model Attempt (Optional)

**Condition**: `USE_DS_MODEL_FALLBACK=true` AND DS API available

**Process**:
1. Call DS model API (`http://localhost:8001/predict`)
2. If confidence >= 0.7: Use DS prediction
3. If confidence < 0.7 OR API fails: Proceed to LLM

**Benefits**:
- Faster (< 200ms vs. 1-3s for LLM)
- No API cost
- Good for straightforward requests

---

### 5. LLM Categorization

**Provider**: OpenAI / Anthropic / Google (configurable)

**Prompt**: See [`../prompts/categorize-request.txt`](../prompts/categorize-request.txt)

**Input**:
- Title
- Description

**Output**:
```json
{
  "category": "IT Support",
  "category_confidence": 0.87,
  "priority": "P1",
  "priority_confidence": 0.72,
  "reasoning": "Email access issues are IT Support; urgency keyword detected"
}
```

**LLM Settings**:
- Temperature: 0.3 (low for consistency)
- Max tokens: 200
- Timeout: 10 seconds

---

### 6. Request Summarization

**Prompt**: See [`../prompts/summarize-request.txt`](../prompts/summarize-request.txt)

**Purpose**: Generate concise 1-2 sentence summary for agent quick review

**LLM Settings**:
- Temperature: 0.5
- Max tokens: 100

---

### 7. Output Validation

**Validates**:
- Category is in approved list
- Priority is P0, P1, P2, or P3
- Confidence scores are 0.0-1.0
- Reasoning provided (non-empty)

**Fallback Values**:
- Invalid category → "Other"
- Invalid priority → "P2"
- Invalid confidence → 0.3

---

### 8. Guardrails Application

**Applies Business Rules**:

1. **P0 Mandatory Review**: P0 always flagged for human approval
2. **Low Confidence**: If < 0.6, flag for review
3. **Sensitive Content**: Force HR category, require review
4. **Unlikely Combinations**: Facilities + P0 triggers review
5. **No Reasoning**: Reduce confidence by 10%

See [`../prompts/guardrails.md`](../prompts/guardrails.md) for full list.

---

### 9. Response Construction

**Output Schema**: Matches `contracts/integration-points/ai-automation-input.schema.json`

```typescript
{
  request_id: string;
  suggested_category: string | null;
  category_confidence: number;
  suggested_priority: string | null;
  priority_confidence: number;
  summary?: string;
  reasoning?: string;
  needs_manual_review?: boolean;
  review_reason?: string;
  model: string;
  timestamp: string;
}
```

---

### 10. Logging & Monitoring

**Logged to Database**:
- Request ID
- Predictions
- Confidence scores
- Model used
- Latency
- Timestamp

**Metrics Tracked**:
- API latency (p50, p95, p99)
- Prediction accuracy (when agent finalizes)
- Override rate (% changed by agent)
- Cost per request
- Confidence distribution

---

### 11. Return to Backend

**HTTP Response**: 200 OK with JSON payload

Backend stores in `requests.ai_metadata` field for agent to review.

---

## Error Handling

### LLM API Timeout
- **Timeout**: 10 seconds
- **Action**: Retry once, then fail gracefully
- **Fallback**: Try DS model OR return null predictions

### LLM API Rate Limit
- **Detection**: 429 status code
- **Action**: Exponential backoff, retry up to 3 times
- **Fallback**: Queue request for later processing

### Invalid JSON Response
- **Detection**: JSON parse error
- **Action**: Log error, try to extract partial data
- **Fallback**: Return default values

### DS Model Unavailable
- **Detection**: Connection refused or timeout
- **Action**: Proceed directly to LLM
- **Log**: Warning (not error)

---

## Performance Considerations

### Latency Breakdown
- Input validation: < 10ms
- PII scan: ~50ms
- DS model call: ~200ms (if used)
- LLM categorization: 1-3 seconds
- LLM summarization: 1-2 seconds
- Validation + guardrails: < 10ms
- **Total**: 2-5 seconds typical

### Optimization Tips
1. Use DS model for fast path (70% of requests)
2. Cache LLM responses for similar requests (1 hour TTL)
3. Run categorization and summarization in parallel
4. Use cheaper models (GPT-3.5) except for complex cases

---

## Cost Analysis

### Per Request (GPT-4)
- Input: ~250 tokens (prompt + request)
- Output: ~150 tokens (category + summary)
- **Total**: ~400 tokens ≈ $0.01

### Per Request (GPT-3.5-Turbo)
- **Total**: ~400 tokens ≈ $0.0002

### Example Cost (1000 requests)
- GPT-4: $10
- GPT-3.5-Turbo: $0.20

**Recommendation**: GPT-3.5-Turbo is sufficient for most cases.

---

## A/B Testing

### Experiment Setup
- **Group A**: Manual triage only (control)
- **Group B**: AI suggestions shown
- **Metrics**: 
  - Time to triage (faster?)
  - Triage accuracy (better?)
  - Agent satisfaction (survey)

### Results Tracking
- Compare final category/priority to AI suggestion
- Track override rate
- Survey agents on usefulness

---

## Future Enhancements

1. **Active Learning**: Retrain on agent corrections
2. **Multi-Model Ensemble**: Combine DS + LLM predictions
3. **Agent-Specific Models**: Personalized to agent expertise
4. **Batch Processing**: Process multiple requests in parallel
5. **Streaming Responses**: Return partial results as available

---

## References
- Workflow Definition: [`../workflows/triage-automation.yml`](../workflows/triage-automation.yml)
- Prompts: [`../prompts/`](../prompts/)
- Integration Guide: [`./INTEGRATION.md`](./INTEGRATION.md)
- Configuration: [`../config/confidence-thresholds.json`](../config/confidence-thresholds.json)
