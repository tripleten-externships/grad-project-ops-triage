# Dashboard Usage Guide

## Overview
This guide explains how to use the Request Management System dashboards to monitor performance, identify trends, and make data-driven decisions.

---

## Dashboard Access

### Power BI
**URL**: [Insert Power BI workspace URL]  
**Login**: Use your organization SSO credentials  
**Permissions**: Request access from BIA team if you don't see the dashboard

### Tableau
**URL**: [Insert Tableau Server URL]  
**Login**: Organization credentials  
**Mobile**: Download Tableau Mobile app

### Google Sheets/Excel
**URL**: [Insert shared folder link]  
**Access**: View-only for most users, edit for BIA team

---

## Available Dashboards

### 1. Executive Overview (US-03)
**Audience**: Managers, Team Leads, Executives  
**Purpose**: High-level metrics and KPIs  
**Refresh Schedule**: Hourly

**What You'll See**:
- Total requests (current period)
- Average resolution time
- SLA compliance percentage
- Pending requests count
- Request volume trend (line chart)
- Category breakdown (donut chart)
- Priority distribution (bar chart)

**When to Use**:
- Daily standup meetings
- Team reviews during bootcamp
- Executive presentations
- Quick system health check

---

### 2. Category Analysis
**Audience**: Department Heads, Process Owners  
**Purpose**: Deep dive into specific categories  
**Refresh Schedule**: Daily

**What You'll See**:
- Requests by category over time
- Category-specific resolution times
- SLA compliance by category
- Category growth trends
- Sub-category breakdowns (if available)

**When to Use**:
- Department planning
- Resource allocation decisions
- Identifying automation opportunities
- Comparing department performance

---

### 3. Agent Performance
**Audience**: Team Leads, Agents  
**Purpose**: Monitor individual and team productivity  
**Refresh Schedule**: Daily

**What You'll See**:
- Requests handled per agent
- Average resolution time per agent
- SLA compliance by agent
- Workload distribution
- Agent leaderboard

**When to Use**:
- 1:1 performance discussions (with context!)
- Workload balancing
- Identifying training needs
- Recognizing top performers

**⚠️ Caution**: Use metrics as conversation starters, not performance scorecards. Consider request complexity, not just speed.

---

### 4. Trend Analysis
**Audience**: Analysts, Strategic Planners  
**Purpose**: Long-term patterns and forecasting  
**Refresh Schedule**: Weekly

**What You'll See**:
- Period-over-period trends
- Seasonal patterns
- Day-of-week / hour-of-day heatmaps
- Request volume forecast
- Category growth analysis

**When to Use**:
- Capacity planning
- Budget forecasting
- Identifying seasonal staffing needs
- Detecting unusual patterns

---

## How to Use Filters

### Date Range Filter
**Location**: Top of dashboard  
**Options**: 
- Last 7 days
- Last 30 days
- Last quarter
- Custom range

**How to Use**:
1. Click on date range dropdown
2. Select predefined range OR choose custom dates
3. Dashboard updates automatically

**Tip**: Use "Last 30 days" for operational reviews, "Last quarter" for strategic planning.

---

### Category Filter
**Location**: Right side panel or top bar  
**Options**: All categories, or select specific ones

**How to Use**:
1. Click "Category" filter
2. Check/uncheck categories
3. Apply filter (button may vary by tool)

**Use Case Example**:
- IT Manager wants to see only IT Support requests
- Select "IT Support" in category filter
- All charts now show IT Support data only

---

### Priority Filter
**How to Use**: Same as category filter

**Use Case Example**:
- Focus on high-priority (P0, P1) requests during incident review

---

### Agent Filter
**Audience**: Team leads reviewing specific agent performance

**Use Case Example**:
- 1:1 meeting with Agent X
- Filter to show only Agent X's requests
- Review resolution times and SLA compliance

---

## Interpreting Visualizations

### KPI Cards
**What They Show**: Single numeric values (e.g., "Total Requests: 420")

**How to Read**:
- Large number = primary metric
- Smaller text = context (e.g., "+15% vs. previous period")
- Green ▲ = improving
- Red ▼ = declining

**Action**: If metric is red or below target, drill into details.

---

### Line Chart (Requests Over Time)
**X-Axis**: Date  
**Y-Axis**: Request count

**How to Read**:
- Upward trend = increasing demand
- Downward trend = decreasing demand
- Spikes = investigate cause (campaign, outage, incident)
- Valleys = holidays, weekends

**Interactions**:
- Hover over points to see exact values
- Click and drag to zoom into date range
- Click legend to show/hide categories

---

### Donut Chart (Category Breakdown)
**How to Read**:
- Each slice = category
- Size = proportion of total
- Percentage shown on hover or label

**Interactions**:
- Click slice to filter other visuals to that category
- Hover to see exact count and percentage

**Insights**:
- Largest slice = highest-volume category
- Many small slices = fragmented workload

---

### Bar Chart (Priority Distribution)
**How to Read**:
- Horizontal bars sorted by count
- Color-coded: P0 (red), P1 (orange), P2 (blue), P3 (green)

**Insights**:
- High P0/P1 count = high urgency environment
- Mostly P3 = low-urgency, mature system

---

### Table (Agent Performance)
**Columns**:
- Agent Name
- Requests Handled
- Avg Resolution Time
- SLA Compliance %

**How to Use**:
- Sort by any column (click header)
- Find outliers (very high/low values)
- Compare across agents

**Caution**: Don't rank agents solely on speed. Fast != better if quality suffers.

---

## Common Tasks

### Task 1: Check Current Status
**Goal**: Quickly see how many requests are pending

**Steps**:
1. Open Executive Overview dashboard
2. Look at "Pending Requests" KPI card
3. If high, check agent workload in Agent Performance dashboard

---

### Task 2: Review Performance
**Goal**: See if we met SLA targets during the bootcamp

**Steps**:
1. Open Executive Overview
2. Set date filter to "Last 7 days"
3. Check "SLA Compliance %" KPI
4. If < 95%, drill into category/agent performance

---

### Task 3: Prepare Final Report
**Goal**: Extract data for bootcamp presentation

**Steps**:
1. Set date filter to bootcamp date range
2. Screenshot KPI cards
3. Export table data to Excel (if needed)
4. See `INSIGHTS-MEMO.md` template for report format

---

### Task 4: Identify Automation Opportunities
**Goal**: Find repetitive, high-volume request types

**Steps**:
1. Go to Category Analysis dashboard
2. Sort categories by volume (descending)
3. Filter to requests with fast avg resolution time (<2 hours)
4. These are automation candidates (e.g., password resets)

---

### Task 5: Balance Agent Workload
**Goal**: Redistribute requests to prevent burnout

**Steps**:
1. Go to Agent Performance dashboard
2. Sort by "Requests Handled" (descending)
3. Identify agents with significantly more requests than average
4. Reassign pending requests from overloaded to underutilized agents

---

## Exporting Data

### Power BI
1. Click visual menu (three dots)
2. **Export data** → Choose CSV or Excel
3. Save file

**Note**: You can only export data you have permission to see.

### Tableau
1. **Worksheet** → **Export** → **Data**
2. Choose format (CSV, Excel)
3. Select data scope (Summary or Full Data)

### Google Sheets
1. **File** → **Download** → Choose format
2. OR: Copy cells and paste into email/report

---

## Troubleshooting

### Dashboard shows no data
**Causes**:
- Filters are too restrictive (e.g., date range has no requests)
- Data refresh failed
- Permission issue

**Solutions**:
1. Reset all filters
2. Check data refresh status
3. Contact BIA team if persists

---

### Numbers don't match expectations
**Causes**:
- Filters applied
- Looking at wrong date range
- Data delay (refresh lag)

**Solutions**:
1. Check active filters (clear if needed)
2. Verify date range
3. Refresh dashboard (F5 or refresh button)

---

### Slow performance
**Causes**:
- Large date range
- Complex calculations
- Network issues

**Solutions**:
1. Narrow date range
2. Remove unused filters
3. Close other browser tabs
4. Contact IT if network issue

---

### Can't export data
**Causes**:
- Insufficient permissions
- Export disabled by admin

**Solutions**:
1. Request export permissions from BIA team
2. Take screenshots as alternative

---

## Best Practices

### 1. Use Consistent Date Ranges
- Compare apples to apples (e.g., similar time periods with equal duration)
- Account for holidays and outliers

### 2. Don't Cherry-Pick Data
- Look at full picture, not just metrics that support your hypothesis
- Consider context (e.g., high volume period due to product launch)

### 3. Cross-Validate Metrics
- If SLA dropped, check resolution time AND request volume
- One metric doesn't tell the full story

### 4. Refresh Regularly
- Dashboards may be cached
- Click refresh before important meetings

### 5. Document Insights
- Use `INSIGHTS-MEMO.md` template to record findings
- Share with stakeholders for transparency

---

## Training & Support

### Training Resources
- **Video Tutorial**: [Link to training video]
- **Live Demo**: Request from BIA team
- **Office Hours**: [Day/Time] in [Location/Zoom]

### Getting Help
- **Dashboard Issues**: Contact BIA team at [email]
- **Data Questions**: See `METRIC-DEFINITIONS.md`
- **Feature Requests**: Submit via [ticketing system]

---

## Feedback

We continuously improve dashboards based on user feedback.

**Submit Feedback**:
- What's working well?
- What's confusing?
- What metrics are missing?
- What features would you like?

**Contact**: [BIA Team Email or Form]

---

## Related Documentation
- Metric Definitions: [`METRIC-DEFINITIONS.md`](./METRIC-DEFINITIONS.md)
- Insights Memo Template: [`INSIGHTS-MEMO.md`](./INSIGHTS-MEMO.md)
- SQL Queries: [`../queries/`](../queries/)
- User Story (Manager Dashboard): [`../../contracts/user-stories/US-03-manager-dashboard.md`](../../contracts/user-stories/US-03-manager-dashboard.md)

---

**Last Updated**: [Date]  
**Version**: 1.0  
**Maintained by**: BIA Team
