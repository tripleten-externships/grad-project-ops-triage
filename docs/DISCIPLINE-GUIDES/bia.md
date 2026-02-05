# Business Intelligence & Analytics (BIA) Discipline Guide

## 🎯 Role Overview

As a **Business Intelligence & Analytics** specialist, you transform raw request data into actionable insights. You'll create dashboards, define metrics, and help managers make data-driven decisions to improve IT operations.

### Your Impact

- **Managers gain visibility** into team performance and bottlenecks
- **SLA compliance** is tracked and improved
- **Resource allocation** is optimized based on data
- **Trends are identified** before they become problems

## 📋 Required Deliverables

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **Dashboard** | [`packages/bia/dashboards/`](../../packages/bia/dashboards/) | Interactive BI dashboard |
| **Metric Definitions** | [`packages/bia/docs/METRIC-DEFINITIONS.md`](../../packages/bia/docs/METRIC-DEFINITIONS.md) | All metrics with formulas |
| **SQL Queries** | [`packages/bia/queries/`](../../packages/bia/queries/) | Data extraction queries |
| **Insights Memo** | [`packages/bia/docs/INSIGHTS-MEMO.md`](../../packages/bia/docs/INSIGHTS-MEMO.md) | Key findings and recommendations |
| **Dashboard Guide** | [`packages/bia/docs/DASHBOARD-GUIDE.md`](../../packages/bia/docs/DASHBOARD-GUIDE.md) | How to use the dashboard |

## 🛠️ Tools & Technologies

### BI Tool Options

Choose **ONE** based on availability:

**Option 1: Power BI** (Recommended)
- Free: Power BI Desktop
- Pros: Professional, powerful, Microsoft ecosystem
- Cons: Windows only (or VM)
- Download: [powerbi.microsoft.com](https://powerbi.microsoft.com)

**Option 2: Tableau**
- Free: Tableau Public or Student License
- Pros: Industry leader, beautiful visualizations
- Cons: Requires account, public publishing
- Download: [tableau.com/academic](https://www.tableau.com/academic/students)

**Option 3: Looker Studio** (formerly Google Data Studio)
- Free: Web-based
- Pros: No installation, easy sharing
- Cons: Limited features vs. Power BI/Tableau
- Access: [lookerstudio.google.com](https://lookerstudio.google.com)

**Option 4: Excel/Google Sheets**
- Free: Universally available
- Pros: Everyone has it, good for learning
- Cons: Limited interactivity
- Features: Pivot tables, charts, slicers

### Data Tools

```yaml
Data access:
  - MongoDB Compass (GUI)
  - Direct MongoDB queries
  - CSV exports

SQL:
  - MongoDB aggregation pipeline
  - (Or translate to SQL if using different DB)

Data prep:
  - Python + pandas (optional)
  - Excel Power Query
```

## 🚀 Setup Instructions

### 1. Install Your BI Tool

**Power BI**:
```bash
# Download from Microsoft
# Install Power BI Desktop
# No account required for local work
```

**Tableau**:
```bash
# Apply for student license
# Download Tableau Desktop
# Activate with edu email
```

**Looker Studio**:
```bash
# Just visit lookerstudio.google.com
# Sign in with Google account
```

### 2. Get the Data

**Option A: CSV Export** (Easiest)
```bash
# Copy mock data
cp ../../contracts/mock-data/requests.csv ./data/

# Or export from MongoDB
mongoexport --db=ops-triage --collection=requests --type=csv --fields=title,category,priority,status,createdAt,resolvedAt --out=requests.csv
```

**Option B: Direct MongoDB Connection** (Power BI/Tableau)
1. Install MongoDB connector for your BI tool
2. Get connection string from backend `.env`
3. Configure data source in BI tool

**Option C: API Export**
```javascript
// packages/bia/data/load-seed-data.js
const fetch = require('node-fetch');
const fs = require('fs');

async function exportData() {
  const response = await fetch('http://localhost:3000/api/requests?limit=1000');
  const data = await response.json();
  
  // Convert to CSV
  const csv = convertToCSV(data.data);
  fs.writeFileSync('./data/requests.csv', csv);
}
```

### 3. Import Data into BI Tool

**Power BI**:
1. Get Data → Text/CSV
2. Select `requests.csv`
3. Transform Data (Power Query)
4. Load to model

**Tableau**:
1. Connect → Text file
2. Select `requests.csv`
3. Data Source tab
4. Go to Sheet

**Looker Studio**:
1. Create → Data Source
2. File Upload → CSV
3. Connect

## 📊 Key Metrics to Track

### 1. Volume Metrics

```sql
-- Total requests
SELECT COUNT(*) as total_requests FROM requests;

-- Requests per day
SELECT 
  DATE(createdAt) as date,
  COUNT(*) as requests
FROM requests
GROUP BY DATE(createdAt)
ORDER BY date;

-- Requests by category
SELECT 
  category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM requests), 2) as percentage
FROM requests
GROUP BY category
ORDER BY count DESC;

-- Requests by priority
SELECT 
  priority,
  COUNT(*) as count
FROM requests
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'P0' THEN 1
    WHEN 'P1' THEN 2
    WHEN 'P2' THEN 3
    WHEN 'P3' THEN 4
  END;
```

### 2. SLA Metrics

**SLA Compliance** = (Requests resolved within SLA / Total resolved requests) × 100

```sql
-- SLA compliance rate
SELECT 
  COUNT(CASE WHEN resolvedAt <= slaDeadline THEN 1 END) as within_sla,
  COUNT(CASE WHEN resolvedAt > slaDeadline THEN 1 END) as missed_sla,
  COUNT(*) as total_resolved,
  ROUND(
    COUNT(CASE WHEN resolvedAt <= slaDeadline THEN 1 END) * 100.0 / COUNT(*),
    2
  ) as sla_compliance_pct
FROM requests
WHERE status = 'Resolved' OR status = 'Closed';

-- SLA compliance by priority
SELECT 
  priority,
  COUNT(CASE WHEN resolvedAt <= slaDeadline THEN 1 END) as within_sla,
  COUNT(*) as total,
  ROUND(
    COUNT(CASE WHEN resolvedAt <= slaDeadline THEN 1 END) * 100.0 / COUNT(*),
    2
  ) as compliance_pct
FROM requests
WHERE status IN ('Resolved', 'Closed')
GROUP BY priority;
```

### 3. Resolution Metrics

```sql
-- Average resolution time (in hours)
SELECT 
  AVG(TIMESTAMPDIFF(HOUR, createdAt, resolvedAt)) as avg_resolution_hours
FROM requests
WHERE status = 'Resolved';

-- Resolution time by category
SELECT 
  category,
  AVG(TIMESTAMPDIFF(HOUR, createdAt, resolvedAt)) as avg_hours,
  MIN(TIMESTAMPDIFF(HOUR, createdAt, resolvedAt)) as min_hours,
  MAX(TIMESTAMPDIFF(HOUR, createdAt, resolvedAt)) as max_hours
FROM requests
WHERE status = 'Resolved'
GROUP BY category;

-- Resolution time by priority
SELECT 
  priority,
  AVG(TIMESTAMPDIFF(HOUR, createdAt, resolvedAt)) as avg_hours
FROM requests
WHERE status = 'Resolved'
GROUP BY priority
ORDER BY avg_hours;
```

### 4. Queue Metrics

```sql
-- Current queue depth
SELECT 
  status,
  COUNT(*) as count
FROM requests
WHERE status IN ('Open', 'In Progress')
GROUP BY status;

-- Aging requests (open > 24h)
SELECT COUNT(*) as aging_requests
FROM requests
WHERE status = 'Open'
  AND TIMESTAMPDIFF(HOUR, createdAt, NOW()) > 24;

-- Queue by agent
SELECT 
  assignedTo,
  COUNT(*) as assigned_count,
  COUNT(CASE WHEN status = 'Open' THEN 1 END) as open_count,
  COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_count
FROM requests
WHERE assignedTo IS NOT NULL
GROUP BY assignedTo;
```

### 5. Trend Metrics

```sql
-- Weekly trends
SELECT 
  YEAR(createdAt) as year,
  WEEK(createdAt) as week,
  COUNT(*) as requests,
  COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved
FROM requests
GROUP BY YEAR(createdAt), WEEK(createdAt)
ORDER BY year, week;
```

## 📈 Dashboard Design

### Required Visualizations

Your dashboard must include **at least 5** visualizations:

#### 1. Overview KPIs (Scorecard)
- Total Requests
- Open Requests
- SLA Compliance %
- Avg Resolution Time

#### 2. Request Volume Over Time (Line Chart)
- X-axis: Date
- Y-axis: Number of requests
- Optional: Split by status or category

#### 3. Requests by Category (Bar/Pie Chart)
- Show distribution across Hardware, Software, Network, etc.
- Use colors from design system

#### 4. SLA Compliance (Gauge or Bar)
- Target: 90%+
- Show actual vs. target
- Color: Green (>90%), Yellow (80-90%), Red (<80%)

#### 5. Priority Distribution (Stacked Bar)
- P0/P1/P2/P3 breakdown
- Optionally by status

#### 6. Agent Performance (Table or Bar)
- Agents ranked by:
  - Number resolved
  - Avg resolution time
  - SLA compliance

### Dashboard Layout Example

```
┌─────────────────────────────────────────────────────┐
│  Ops Triage Dashboard                   [Filter: ▼]│
├─────────────┬─────────────┬─────────────┬──────────┤
│   Total     │    Open     │    SLA      │   Avg    │
│  Requests   │  Requests   │ Compliance  │   Time   │
│    1,234    │     45      │    92%      │  18h     │
├─────────────┴─────────────┴─────────────┴──────────┤
│                                                     │
│  [Line Chart: Requests Over Time]                  │
│                                                     │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  [Bar: By Category]  │  [Pie: By Priority]          │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│                                                     │
│  [Table: Agent Performance]                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Interactive Features

Add **filters/slicers**:
- Date range picker
- Category filter
- Priority filter
- Status filter
- Agent filter

## 📝 Metric Definitions Document

Create [`docs/METRIC-DEFINITIONS.md`](../../packages/bia/docs/METRIC-DEFINITIONS.md):

```markdown
# Metric Definitions

## Volume Metrics

### Total Requests
**Definition**: Count of all support requests in the system
**Formula**: `COUNT(requests)`
**Business Context**: Overall demand for IT support
**Target**: Track trends, no specific target

### Open Requests
**Definition**: Requests with status = 'Open'
**Formula**: `COUNT(requests WHERE status = 'Open')`
**Business Context**: Current backlog
**Target**: < 50 at any time

## SLA Metrics

### SLA Compliance Rate
**Definition**: Percentage of requests resolved within SLA
**Formula**: `(Within SLA / Total Resolved) × 100`
**Calculation**: 
- Within SLA: `COUNT(requests WHERE resolvedAt <= slaDeadline)`
- Total Resolved: `COUNT(requests WHERE status IN ('Resolved', 'Closed'))`
**Business Context**: How well we meet service commitments
**Target**: ≥ 90%

### SLA Deadline
**Definition**: Time by which request must be resolved
**Formula**: Based on priority
- P0: createdAt + 4 hours
- P1: createdAt + 24 hours
- P2: createdAt + 72 hours
- P3: createdAt + 120 hours

## Resolution Metrics

### Average Resolution Time
**Definition**: Mean time from creation to resolution
**Formula**: `AVG(resolvedAt - createdAt)` in hours
**Business Context**: Efficiency of support team
**Target**: 
- P0: < 4h
- P1: < 20h
- P2: < 60h
- P3: < 100h

[Continue for all metrics...]
```

## 🔍 Insights Memo

Write [`docs/INSIGHTS-MEMO.md`](../../packages/bia/docs/INSIGHTS-MEMO.md) with:

### Structure

```markdown
# Analytics Insights Memo

**To**: IT Management
**From**: BIA Team
**Date**: 2026-02-05
**Re**: IT Support Request Analysis - Key Findings

## Executive Summary
[2-3 sentence overview of findings]

## Key Insights

### 1. [Insight Title]
**Finding**: [What the data shows]
**Impact**: [Why it matters]
**Recommendation**: [What to do about it]

**Supporting Data**:
- Metric 1: X
- Metric 2: Y

### 2. [Next Insight]
...

## Appendix
[Charts, detailed tables]
```

### Example Insights

**Insight 1: Software Requests Dominate**
- Finding: 45% of all requests are Software category
- Impact: May indicate need for better user training or software quality issues
- Recommendation: Invest in self-service knowledge base for common software issues

**Insight 2: P0 SLA Compliance is Low**
- Finding: Only 78% of P0 requests resolved within 4-hour SLA
- Impact: Critical issues taking too long, risk to business operations
- Recommendation: Dedicate on-call agent for P0 response, escalation process

**Insight 3: Friday Peak Volume**
- Finding: 30% more requests on Fridays vs. Monday-Thursday average
- Impact: Friday staffing may be insufficient
- Recommendation: Adjust agent schedules to add Friday capacity

## 🔌 Integration with Other Disciplines

### With Backend

**Get data via**:
1. Direct MongoDB access (read-only)
2. Analytics API endpoints
3. CSV exports

**Coordinate on**:
- What metrics to expose
- Data freshness requirements
- Query performance

### With Frontend

**Provide**:
- Metric definitions for insights page
- Chart specifications
- Data for embedded visualizations

### With Data Science

**Collaborate on**:
- Model performance metrics
- Prediction accuracy tracking
- Feature importance analysis

## ✅ Deliverable Checklist

**Dashboard**:
- [ ] Created in chosen BI tool
- [ ] At least 5 visualizations
- [ ] Interactive filters/slicers
- [ ] Professional design
- [ ] Exported as PDF or shared link

**Metrics**:
- [ ] All key metrics defined
- [ ] Formulas documented
- [ ] Business context explained
- [ ] Targets set

**Queries**:
- [ ] Volume metrics query
- [ ] SLA metrics query
- [ ] Category analysis query
- [ ] Queries tested and work

**Insights**:
- [ ] 3+ actionable insights
- [ ] Data-driven recommendations
- [ ] Executive summary
- [ ] Supporting visualizations

**Documentation**:
- [ ] Dashboard guide (how to use)
- [ ] Data source documentation
- [ ] Refresh schedule
- [ ] Known limitations

## 🎯 Stretch Goals

- [ ] **Predictive Analytics**: Forecast future request volume
- [ ] **Anomaly Detection**: Alert on unusual patterns
- [ ] **Cohort Analysis**: Track request lifecycle by cohort
- [ ] **Advanced Visualizations**: Heat maps, geo maps
- [ ] **Real-time Dashboard**: Auto-refresh from live data
- [ ] **Mobile Dashboard**: Responsive design for mobile
- [ ] **Alerting**: Email alerts for metric thresholds
- [ ] **What-if Analysis**: Scenario modeling

## 📚 Resources

### BI Tool Learning

**Power BI**:
- [Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/)
- [Guy in a Cube YouTube](https://www.youtube.com/c/GuyinaCube)

**Tableau**:
- [Tableau Training](https://www.tableau.com/learn/training)
- [Tableau Public Gallery](https://public.tableau.com/app/discover)

**Looker Studio**:
- [Looker Studio Help](https://support.google.com/looker-studio)

### Dashboard Design

- **Stephen Few**: Information Dashboard Design
- **Cole Nussbaumer Knaflic**: Storytelling with Data
- **Edward Tufte**: Visual Display of Quantitative Information

### SQL & Data

- **MongoDB Aggregation**: [docs.mongodb.com/aggregation](https://docs.mongodb.com/manual/aggregation/)
- **SQL Tutorial**: [sqlzoo.net](https://sqlzoo.net/)

## ❓ Common Questions

**Q: Which BI tool should I choose?**  
A: Power BI if on Windows, Looker Studio for ease, Excel if others unavailable.

**Q: Can I use Python instead of a BI tool?**  
A: Yes, but must create interactive visualizations (Plotly Dash, Streamlit).

**Q: How do I get MongoDB data into Excel?**  
A: Export to CSV, then import. Or use MongoDB Connector for BI.

**Q: What if I can't find good insights?**  
A: Look for: Trends over time, category imbalances, SLA patterns, agent comparison.

**Q: How often should dashboard refresh?**  
A: Daily is fine for this project. Real-time is stretch goal.

---

**Turn data into decisions!** 📊💡
