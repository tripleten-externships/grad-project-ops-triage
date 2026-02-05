# Priority Definitions

Priority levels define the urgency and impact of support requests, along with their associated SLA targets.

## Priority Levels

### P0 - Critical

**Definition**: System outage or critical functionality broken affecting multiple customers or high-value customers.

**Examples**:
- Production system completely down
- Data loss or corruption
- Security breach
- Payment processing failure affecting multiple customers

**SLA Targets**:
- First Response: **15 minutes**
- Time to Triage: **30 minutes**
- Time to Resolution: **4 hours**
- Business Hours: **24/7**

**Assignment**:
- Automatically escalated to senior engineers
- Manager notification required
- On-call engineer paged if outside business hours

---

### P1 - High

**Definition**: Significant functionality impaired or single high-value customer affected.

**Examples**:
- Key feature not working (e.g., login issues)
- Performance severely degraded
- Enterprise customer unable to complete critical workflow
- Revenue-impacting bug

**SLA Targets**:
- First Response: **1 hour**
- Time to Triage: **2 hours**
- Time to Resolution: **24 hours**
- Business Hours: **24/7**

**Assignment**:
- Assigned to experienced agent immediately
- Manager informed within 1 hour
- Daily updates required

---

### P2 - Medium

**Definition**: Non-critical functionality issue or minor impact on customer operations.

**Examples**:
- Minor feature bug with workaround available
- UI/UX issue not blocking core functionality
- Documentation error
- Account configuration request

**SLA Targets**:
- First Response: **4 hours**
- Time to Triage: **8 hours** (same business day)
- Time to Resolution: **3 business days**
- Business Hours: **Mon-Fri, 9am-6pm**

**Assignment**:
- Added to general triage queue
- Assigned based on agent availability and expertise
- Updates every 2 business days

---

### P3 - Low

**Definition**: Minor inconvenience or feature request with minimal business impact.

**Examples**:
- Feature enhancement request
- General questions
- Cosmetic issues
- Nice-to-have improvements
- Documentation clarification

**SLA Targets**:
- First Response: **24 hours**
- Time to Triage: **48 hours**
- Time to Resolution: **7 business days**
- Business Hours: **Mon-Fri, 9am-6pm**

**Assignment**:
- Lowest priority in queue
- Can be used for training new agents
- Updates as needed or upon request

---

## Priority Assignment Rules

### Automatic Priority Assignment

The system can suggest priority based on:

1. **Category + Keywords**
   - `billing` + "payment failed" → P1
   - `technical` + "cannot login" → P1
   - `technical` + "server down" → P0
   - `account` + "update email" → P3

2. **Requester Type**
   - `enterprise` customers default to P2 (minimum)
   - `paid` customers default to P2-P3
   - `free` customers default to P3

3. **Channel**
   - `phone` calls default to P1-P2 (higher urgency)
   - `email` defaults to P2-P3
   - `web_form` defaults to P2-P3

### Manual Override

Agents can override automatic priority assignment during triage if:
- More context reveals higher/lower urgency
- Multiple customers report same issue (escalate to P0/P1)
- Workaround is available (downgrade to lower priority)
- Customer has special SLA agreement

### Priority Escalation

Automatically escalate priority when:
- Request breaches current SLA by 50%
- Customer requests escalation and meets criteria
- Issue affects multiple customers (aggregate to P0/P1)
- Security implications discovered

### Priority De-escalation

Can de-escalate priority when:
- Workaround provided and confirmed working
- Impact less severe than initially assessed
- Customer agrees to de-escalation
- Issue scheduled for upcoming release

---

## SLA Breach Handling

### Warning Thresholds
- **Yellow Alert**: 75% of SLA time elapsed
- **Red Alert**: 90% of SLA time elapsed
- **Breach**: SLA time exceeded

### Breach Response
1. **P0 Breach**: Immediate escalation to Director, post-mortem required
2. **P1 Breach**: Escalation to Manager, explanation required
3. **P2 Breach**: Documented and reviewed in daily ops meeting
4. **P3 Breach**: Tracked but no immediate action required

### Measuring SLA Compliance

SLA targets are measured during **business hours only** except for P0 and P1:

- **P0 & P1**: 24/7 coverage, calendar time
- **P2 & P3**: Business hours only (Mon-Fri, 9am-6pm local time)

**Exclusions** (time doesn't count against SLA):
- Time in `waiting` status (customer's responsibility)
- Holidays and scheduled maintenance windows
- Time waiting for third-party vendor response

---

## Reporting & Metrics

### Key Metrics by Priority
- **Volume**: Count of requests by priority
- **SLA Compliance Rate**: % meeting SLA targets
- **Average Resolution Time**: Actual time to resolve
- **Breach Rate**: % of requests breaching SLA
- **First Response Time**: Time from creation to first agent response

### Target SLA Compliance Rates
- P0: **98%**
- P1: **95%**
- P2: **90%**
- P3: **85%**
