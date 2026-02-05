# AI Automation Package

## Overview
This package provides AI-powered automation for the Request Management System, including intelligent triage, categorization, and priority assignment using Large Language Models (LLMs).

## Role of AI Automation
- **Automated Triage**: Suggest category and priority for new requests
- **Smart Routing**: Recommend best agent based on skills and workload
- **Request Summarization**: Generate concise summaries for complex requests
- **Template Matching**: Identify similar historical requests
- **Quality Assurance**: Flag incomplete or ambiguous requests

---

## Approach

### Option 1: LLM-Based (GPT-4, Claude, Gemini)
**Pros**:
- Highly flexible, handles complex cases
- No training data required
- Can process natural language instructions

**Cons**:
- API costs per request
- Latency (1-3 seconds)
- External dependency

### Option 2: Traditional ML (Data Science Package)
**Pros**:
- Fast inference (<200ms)
- No ongoing API costs
- Predictable performance

**Cons**:
- Requires training data
- Less flexible
- See `packages/data-science/`

### Recommended: Hybrid Approach
- Use DS model for structured prediction (category, priority)
- Use LLM for summarization and edge cases
- Fall back to LLM if DS model confidence is low

---

## Team Deliverables

### Phase 1: Setup (Days 1-2)
- [ ] Set up API keys (OpenAI, Anthropic, etc.)
- [ ] Define workflow triggers
- [ ] Create initial prompts

### Phase 2: Development (Days 3-4)
- [ ] Implement automation logic
- [ ] Test prompts with sample requests
- [ ] Implement confidence thresholding
- [ ] Add guardrails

### Phase 3: Integration (Days 5-6)
- [ ] Integrate with backend webhooks
- [ ] Implement fallback logic
- [ ] Add monitoring and logging

### Phase 4: Validation (Day 7)
- [ ] A/B test with manual triage
- [ ] Measure accuracy
- [ ] Tune prompts based on results

---

## Project Structure

```
ai-automation/
├── workflows/           # Workflow definitions
├── prompts/             # LLM prompt templates
├── src/                 # TypeScript source code
├── config/              # Configuration files
├── docs/                # Documentation
├── package.json         # Node dependencies
└── .env.example         # Environment variables template
```

---

## Quick Start

### Installation
```bash
cd packages/ai-automation
npm install
cp .env.example .env
# Edit .env with your API keys
```

### Run Automation
```bash
# Process a single request
npm run triage -- --request-id 12345

# Start webhook listener
npm run listen
```

---

## Workflow

### Request Triage Automation

**Trigger**: New request created (webhook from backend)

**Steps**:
1. Receive request data (title, description)
2. Call LLM API with triage prompt
3. Parse response to extract category, priority, summary
4. Validate predictions (guardrails)
5. Return to backend with confidence scores
6. Backend shows suggestions to agent

**Output**: Matches `contracts/integration-points/ai-automation-input.schema.json`

---

## Integration with Backend

### Webhook Setup
Backend calls AI automation via webhook when request is created:

```typescript
// Backend: packages/backend/src/services/webhook.service.ts
await axios.post('http://localhost:8002/triage', {
  request_id: request.id,
  title: request.title,
  description: request.description
});
```

### AI Automation Response
```json
{
  "request_id": "12345",
  "suggested_category": "IT Support",
  "category_confidence": 0.92,
  "suggested_priority": "P1",
  "priority_confidence": 0.85,
  "summary": "User unable to access email account",
  "reasoning": "Email access issues are typically IT Support, urgency indicated by 'urgent' keyword",
  "model": "gpt-4",
  "timestamp": "2026-02-04T12:00:00Z"
}
```

---

## Prompts

All prompts are stored in `prompts/` directory as plain text files for easy editing and version control.

### Key Prompts
- **Triage**: Categorize and prioritize request
- **Summarize**: Generate concise summary
- **Validate**: Check for completeness
- **Route**: Recommend agent

See `prompts/` directory for templates.

---

## Guardrails

### Input Validation
- Minimum description length: 10 characters
- Maximum description length: 5000 characters
- Required fields: title, description

### Output Validation
- Category must be from approved list
- Priority must be P0, P1, P2, or P3
- Confidence scores must be 0-1
- No PII in summary

### Safety Rules
- Don't auto-assign P0 without human review
- Flag potentially sensitive requests (HR, legal)
- Rate limiting: Max 100 requests/min

See `prompts/guardrails.md` for full details.

---

## Monitoring

### Metrics to Track
- **Accuracy**: Compare AI predictions to agent's final decision
- **Confidence Distribution**: Track average confidence scores
- **Override Rate**: % of times agent changes AI suggestion
- **Latency**: Time from trigger to response
- **Cost**: API usage costs

### Logging
All predictions logged to database with:
- Request ID
- Predictions (category, priority)
- Confidence scores
- Agent's final decision (for accuracy tracking)
- Model used
- Timestamp

---

## Cost Optimization

### Token Usage
- Input: ~100-300 tokens per request (title + description + prompt)
- Output: ~50-100 tokens (category, priority, summary)
- **Total**: ~150-400 tokens per request

### Estimated Costs
- **GPT-4**: ~$0.01 per request
- **GPT-3.5-Turbo**: ~$0.0002 per request
- **Claude**: ~$0.008 per request

**Recommendation**: Start with GPT-3.5-Turbo, upgrade to GPT-4 for complex cases.

### Reducing Costs
1. Use DS model for initial prediction, LLM only if confidence < 0.6
2. Batch requests (if possible)
3. Cache common patterns
4. Use shorter prompts

---

## Comparison: LLM vs. DS Model

| Criterion | LLM (GPT-4) | DS Model |
|-----------|-------------|----------|
| **Accuracy** | 90-95% | 80-85% |
| **Speed** | 1-3s | <200ms |
| **Cost** | $0.01/request | $0 (after training) |
| **Flexibility** | High | Low |
| **Explanation** | Yes (reasoning) | Limited |
| **Training Required** | No | Yes |

**Recommendation**: Use both! DS model for speed, LLM for quality and edge cases.

---

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
# Start local backend (mock)
npm run test:integration
```

### Prompt Testing
```bash
# Test prompts with sample requests
npm run test:prompts
```

---

## Deployment

### Local Development
```bash
npm run dev
```

### Docker
```bash
docker build -t ai-automation .
docker run -p 8002:8002 --env-file .env ai-automation
```

### Cloud Deployment
- Deploy to Vercel, AWS Lambda, or Google Cloud Run
- Set environment variables in cloud platform
- Configure webhook URL in backend

---

## References

- **Output Schema**: `contracts/integration-points/ai-automation-input.schema.json`
- **Backend Integration**: `packages/backend/docs/ARCHITECTURE.md`
- **Data Science Model**: `packages/data-science/docs/INTEGRATION.md`
- **User Story**: `contracts/user-stories/US-02-agent-triage.md`

---

## Support

For questions:
- **Prompts/Accuracy**: AI Automation team lead
- **Integration**: Backend team
- **Cost/Performance**: DevOps

---

## Next Steps

1. Set up API keys in `.env`
2. Test prompts with sample data
3. Integrate with backend webhook
4. Monitor accuracy and iterate on prompts
5. Optimize for cost and performance
