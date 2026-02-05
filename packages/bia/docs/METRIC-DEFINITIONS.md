# Metric Definitions

## Overview
This document defines all metrics used in the Request Management System dashboards and reports. Each metric includes the calculation formula, purpose, and interpretation guidelines.

---

## Volume Metrics

### Total Requests
**Definition**: Count of all requests in the system.

**Calculation**:
```sql
COUNT(*) FROM requests
```

**Purpose**: Track overall system usage and growth.

**Interpretation**:
- Increasing trend = Growing demand
- Decreasing trend = May indicate service issues or reduced need

---

### Requests by Status
**Definition**: Breakdown of requests by current status (Pending, In Progress, Resolved).

**Calculation**:
```sql
COUNT(*) FROM requests GROUP BY status
```

**Statuses**:
- `pending`: Awaiting triage/assignment
- `in_progress`: Being worked on
- `resolved`: Completed

**Purpose**: Monitor workflow and identify bottlenecks.

**Interpretation**:
- High pending count = Triage backlog
- High in-progress count = Agents over-allocated
- Low resolved rate = Performance issue

---

### Requests by Category
**Definition**: Distribution of requests across categories (IT Support, HR, Facilities, Finance, etc.).

**Calculation**:
```sql
SELECT category, COUNT(*) as count, 
       COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM requests
GROUP BY category
```

**Purpose**: Identify which departments/services have highest demand.

**Interpretation**:
- Dominant category = May need dedicated resources
- Balanced distribution = Resources allocated appropriately
- Emerging category = New service area

---

### Requests by Priority
**Definition**: Distribution of requests by priority level (P0-P3).

**Calculation**: 
```sql
SELECT priority, COUNT(*)
FROM requests
GROUP BY priority
```

**Priority Levels** (from `contracts/data-models/priority-definitions.md`):
- **P0 - Critical**: System down, business-blocking issue
- **P1 - High**: Major functionality impaired
- **P2 - Medium**: Minor issue, workaround available
- **P3 - Low**: Enhancement, informational

**Purpose**: Assess urgency distribution and workload criticality.

**Interpretation**:
- High P0/P1 percentage = High-stress environment
- Mostly P3 = Mature, stable system
- Unbalanced distribution = Priority calibration needed

---

## Performance Metrics

### Average Resolution Time
**Definition**: Mean time from request creation to resolution.

**Calculation**:
```sql
AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) 
FROM requests 
WHERE status = 'resolved' AND resolved_at IS NOT NULL
```

**Unit**: Hours

**Purpose**: Measure responsiveness and efficiency.

**Interpretation**:
- Lower = Faster service
- Higher = Delays or complex requests
- Compare to SLA targets

**Benchmark**: 
- P0: < 4 hours (target)
- P1: < 24 hours (target)
- P2: < 72 hours (target)
- P3: < 168 hours (target)

---

### Median Resolution Time
**Definition**: 50th percentile of resolution times (middle value when sorted).

**Calculation**:
```sql
PERCENTILE_CONT(0.5) WITHIN GROUP (
  ORDER BY EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
) 
FROM requests 
WHERE status = 'resolved'
```

**Purpose**: More robust than average (not skewed by outliers).

**Interpretation**:
- If median << average = Few very slow requests pulling up average
- If median ≈ average = Consistent performance

---

### SLA Compliance Rate
**Definition**: Percentage of resolved requests that met their SLA target.

**Calculation**:
```sql
SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*) 
FROM requests 
WHERE status = 'resolved'
```

**SLA Targets**:
- P0: 4 hours
- P1: 24 hours
- P2: 72 hours
- P3: 168 hours

**Purpose**: Measure service quality and adherence to commitments.

**Interpretation**:
- \>= 95% = Excellent
- 90-95% = Good
- 80-90% = Needs improvement
- < 80% = Critical issue

**Formula for** `met_sla`:
```sql
CASE 
  WHEN priority = 'P0' AND resolution_hours <= 4 THEN TRUE
  WHEN priority = 'P1' AND resolution_hours <= 24 THEN TRUE
  WHEN priority = 'P2' AND resolution_hours <= 72 THEN TRUE
  WHEN priority = 'P3' AND resolution_hours <= 168 THEN TRUE
  ELSE FALSE
END
```

---

## Trend Metrics

### Week-over-Week Change
**Definition**: Percentage change in request volume compared to previous week.

**Calculation**:
```sql
(this_week - last_week) * 100.0 / last_week
```

**Purpose**: Detect short-term trends (spikes, drops).

**Interpretation**:
- Positive % = Increasing demand
- Negative % = Decreasing demand
- \>50% change = Investigate cause (campaign, outage, holiday)

---

### Month-over-Month Change
**Definition**: Percentage change in request volume compared to previous month.

**Calculation**:
```sql
(this_month - last_month) * 100.0 / last_month
```

**Purpose**: Track medium-term growth patterns.

**Interpretation**:
- Consistent growth = Plan for scaling
- Seasonal patterns = Adjust staffing

---

## Agent Metrics

### Requests Handled per Agent
**Definition**: Number of requests assigned to each agent.

**Calculation**:
```sql
COUNT(*) 
FROM requests 
WHERE assigned_to = agent_id
GROUP BY assigned_to
```

**Purpose**: Monitor workload distribution.

**Interpretation**:
- Balanced across agents = Fair distribution
- One agent with much higher count = Overloaded or specialized

---

### Agent Resolution Rate
**Definition**: Percentage of assigned requests that agent has resolved.

**Calculation**:
```sql
COUNT(CASE WHEN status = 'resolved' THEN 1 END) * 100.0 / COUNT(*)
FROM requests
WHERE assigned_to = agent_id
```

**Purpose**: Measure individual productivity.

**Interpretation**:
- High rate = Efficient agent
- Low rate = May be handling complex requests or need support

**Caution**: Don't use for performance reviews without context (complexity varies).

---

### Agent Average Resolution Time
**Definition**: Mean time for agent to resolve requests.

**Calculation**:
```sql
AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)
FROM requests
WHERE assigned_to = agent_id AND status = 'resolved'
```

**Purpose**: Identify fast/slow resolvers (for training, not punishment).

**Interpretation**:
- Compare by category and priority (not raw average)
- Lower time = Efficient OR handling simple requests
- Higher time = Thorough OR handling complex requests

---

## Derived Metrics

### First Response Time
**Definition**: Time from request creation to first agent response/assignment.

**Calculation**:
```sql
EXTRACT(EPOCH FROM (first_response_at - created_at)) / 3600
```

**Note**: Requires tracking `first_response_at` timestamp.

**Purpose**: Measure initial responsiveness (customer perception).

**Benchmark**: < 1 hour for P0/P1, < 4 hours for P2/P3.

---

### Request Backlog
**Definition**: Number of open requests (pending + in_progress).

**Calculation**:
```sql
COUNT(*) 
FROM requests 
WHERE status IN ('pending', 'in_progress')
```

**Purpose**: Monitor workload accumulation.

**Interpretation**:
- Growing backlog = Need more resources
- Shrinking backlog = Capacity available

---

### Utilization Rate
**Definition**: Percentage of time agents are assigned active requests.

**Calculation** (simplified):
```sql
COUNT(DISTINCT assigned_to) / COUNT(DISTINCT user_id WHERE role = 'agent')
```

**Purpose**: Ensure agents are neither overloaded nor underutilized.

**Interpretation**:
- \>90% = Risk of burnout
- 70-90% = Good utilization
- <50% = Underutilized or overstaffed

---

## Forecasting Metrics

### Average Daily Requests
**Definition**: Mean requests per day over a period.

**Calculation**:
```sql
COUNT(*) / COUNT(DISTINCT DATE(created_at))
FROM requests
WHERE created_at >= start_date
```

**Purpose**: Predict future volume, plan capacity.

---

### Request Forecast (Next Month)
**Definition**: Projected request volume based on historical trend.

**Calculation** (linear trend):
```
Forecast = avg_daily_requests * days_in_period * growth_factor
```

**Purpose**: Resource planning, budgeting.

---

## Data Quality Metrics

### Missing Priority Rate
**Definition**: Percentage of requests without a priority assigned.

**Calculation**:
```sql
COUNT(CASE WHEN priority IS NULL THEN 1 END) * 100.0 / COUNT(*)
FROM requests
```

**Purpose**: Identify data quality issues.

**Target**: 0% (all requests should have priority).

---

### Unassigned Request Rate
**Definition**: Percentage of non-resolved requests without an agent assigned.

**Calculation**:
```sql
COUNT(CASE WHEN assigned_to IS NULL THEN 1 END) * 100.0 / COUNT(*)
FROM requests
WHERE status != 'resolved'
```

**Purpose**: Monitor triage effectiveness.

**Interpretation**:
- High rate = Triage backlog or auto-assignment not working

---

## Calculation Notes

### Business Hours vs. Calendar Hours
- **Calendar Hours**: Simple timestamp difference (default)
- **Business Hours**: Excludes nights, weekends, holidays (optional)

For SLA, consider business hours if your support operates 9-5 Mon-Fri.

### Null Handling
- Exclude `NULL` timestamps from time calculations
- Use `COALESCE()` or `NULLIF()` to avoid division by zero

### Rounding
- Percentages: 2 decimal places (e.g., 87.53%)
- Hours: 2 decimal places (e.g., 12.75 hours)
- Counts: Whole numbers

---

## References
- **Priority Definitions**: `contracts/data-models/priority-definitions.md`
- **Business Rules**: `contracts/data-models/business-rules.md`
- **Field Dictionary**: `contracts/data-models/field-dictionary.md`
- **SQL Queries**: `queries/volume-metrics.sql`, `queries/sla-metrics.sql`

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| <!-- Date --> | Initial metrics defined | BIA Team |

<!-- TODO: Update as metrics evolve -->
