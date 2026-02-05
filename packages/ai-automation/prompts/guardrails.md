# AI Automation Guardrails

## Overview
Guardrails ensure AI predictions are safe, accurate, and aligned with business rules. These rules are applied after LLM response but before returning to the backend.

---

## Safety Rules

### Rule 1: No Auto-Assignment of P0
**Condition**: If LLM predicts P0 (Critical) priority  
**Action**: Flag for mandatory manual review  
**Reason**: P0 incidents require human judgment and immediate escalation

**Implementation**:
```typescript
if (prediction.priority === 'P0') {
  prediction.needs_manual_review = true;
  prediction.review_reason = 'P0 priority requires human verification';
}
```

---

### Rule 2: Low Confidence Threshold
**Condition**: If category OR priority confidence < 0.6  
**Action**: Flag as "needs review"  
**Reason**: Low confidence indicates ambiguous request

**Implementation**:
```typescript
if (prediction.category_confidence < 0.6 || prediction.priority_confidence < 0.6) {
  prediction.needs_manual_review = true;
  prediction.review_reason = 'Low confidence prediction';
}
```

---

### Rule 3: Sensitive Content Detection
**Condition**: Request contains sensitive keywords  
**Keywords**: 
- "termination", "fired", "layoff"
- "harassment", "discrimination", "lawsuit"
- "confidential", "legal", "attorney"
- "salary", "compensation" (when in HR context)

**Action**: Auto-categorize as HR + flag for privacy review  
**Reason**: Sensitive HR/legal matters require careful handling

**Implementation**:
```typescript
const sensitiveKeywords = ['termination', 'harassment', 'confidential', 'lawsuit'];
const hasSensitive = sensitiveKeywords.some(kw => 
  description.toLowerCase().includes(kw)
);

if (hasSensitive) {
  prediction.category = 'HR';
  prediction.needs_manual_review = true;
  prediction.review_reason = 'Sensitive content detected';
  prediction.is_sensitive = true;
}
```

---

### Rule 4: PII Detection
**Condition**: Request contains potential PII  
**Patterns**:
- Social Security Numbers (XXX-XX-XXXX)
- Credit card numbers
- Email addresses from external domains
- Phone numbers

**Action**: Flag for PII redaction  
**Reason**: Privacy compliance

**Note**: Use regex or PII detection library

---

### Rule 5: Invalid Category/Priority
**Condition**: LLM returns category or priority not in approved list  
**Action**: Use default fallback values  
**Fallback**: Category = "Other", Priority = "P2"

**Implementation**:
```typescript
const validCategories = ['IT Support', 'HR', 'Facilities', 'Finance', 'Other'];
const validPriorities = ['P0', 'P1', 'P2', 'P3'];

if (!validCategories.includes(prediction.category)) {
  prediction.category = 'Other';
  prediction.category_confidence = 0.3;
}

if (!validPriorities.includes(prediction.priority)) {
  prediction.priority = 'P2';
  prediction.priority_confidence = 0.3;
}
```

---

## Business Rules

### Rule 6: Category-Priority Constraints
**Condition**: Certain category + priority combinations are unlikely  
**Examples**:
- Facilities requests are rarely P0
- Finance requests rarely P0 unless invoice blocking revenue

**Action**: Reduce confidence if combination is unusual

**Implementation**:
```typescript
const unlikelyCombinations = [
  { category: 'Facilities', priority: 'P0' },
  { category: 'HR', priority: 'P0' }
];

if (isUnlikelyCombination(prediction)) {
  prediction.needs_manual_review = true;
  prediction.review_reason = 'Unusual category-priority combination';
}
```

---

### Rule 7: Duplicate Detection
**Condition**: Very similar request submitted recently (< 24 hours)  
**Action**: Link to original request, suggest duplicate  
**Reason**: Prevent duplicate work

**Note**: Requires request history comparison (semantic similarity)

---

### Rule 8: Minimum Description Length
**Condition**: Description < 10 characters  
**Action**: Reject or flag as incomplete  
**Reason**: Insufficient information for categorization

---

## Quality Assurance

### Rule 9: Reasoning Required
**Condition**: LLM didn't provide reasoning  
**Action**: Lower confidence score by 0.1  
**Reason**: Unexplained predictions are less trustworthy

---

### Rule 10: Confidence Calibration
**Condition**: LLM consistently over/under-confident  
**Action**: Apply calibration factor based on historical accuracy  
**Example**: If LLM says 0.9 confidence but actual accuracy is 0.7, adjust down

**Implementation**:
```typescript
// Calibration based on historical data
const calibratedConfidence = calibrate(
  rawConfidence,
  historicalAccuracyByCategory[category]
);
```

---

## Rate Limiting & Abuse Prevention

### Rule 11: Per-User Rate Limit
**Condition**: Same user submitting >10 requests/hour  
**Action**: Flag for spam review  
**Reason**: Prevent system abuse

---

### Rule 12: Gibberish Detection
**Condition**: Description is random characters or repeated text  
**Action**: Flag as spam  
**Example**: "asdfasdfasdf" or "test test test test"

**Implementation**: Check for low entropy or repeated patterns

---

## Override Logging

### Rule 13: Track All Overrides
**Condition**: Agent changes AI prediction  
**Action**: Log override for model retraining  
**Data to Log**:
- Original AI prediction
- Agent's final decision
- Override reason (if provided)
- Request characteristics

**Use**: Identify model weaknesses and retrain

---

## Escalation Rules

### Rule 14: Critical Keywords Escalation
**Condition**: Request contains "urgent", "critical", "down", "broken", "outage"  
**Action**: Ensure priority >= P1 (unless category is clearly low-priority)

---

### Rule 15: VIP User Escalation
**Condition**: Requester is executive or VIP  
**Action**: Boost priority by one level (P2 → P1, P1 → P0)  
**Note**: Requires user role information

---

## Testing Guardrails

Each guardrail should have:
1. **Unit tests**: Test the logic in isolation
2. **Integration tests**: Test with real LLM responses
3. **Edge case tests**: Test boundary conditions

**Example Test**:
```typescript
describe('Guardrail: P0 Manual Review', () => {
  it('should flag P0 predictions for review', () => {
    const prediction = { priority: 'P0', needs_manual_review: false };
    applyGuardrails(prediction);
    expect(prediction.needs_manual_review).toBe(true);
  });
});
```

---

## Monitoring

Track these metrics:
- **Guardrail Trigger Rate**: How often each rule fires
- **False Positive Rate**: Rules that incorrectly flag requests
- **Override After Guardrail**: Agent disagrees with guardrail decision

---

## Updating Guardrails

Guardrails should evolve based on:
- User feedback
- Agent override patterns
- Model accuracy improvements
- Business rule changes

**Process**:
1. Identify issue (e.g., too many false P0 flags)
2. Update rule logic
3. Test with historical data
4. Deploy and monitor
5. Document change

---

## References
- Priority Definitions: `contracts/data-models/priority-definitions.md`
- Business Rules: `contracts/data-models/business-rules.md`
- Integration Schema: `contracts/integration-points/ai-automation-input.schema.json`

---

**Last Updated**: [Date]  
**Owner**: AI Automation Team
