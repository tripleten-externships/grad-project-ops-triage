# Power BI Dashboard Instructions

## Overview
This guide helps you create Request Management dashboards in Microsoft Power BI.

---

## Prerequisites
- Power BI Desktop installed
- Access to data source (CSV, database, or API)
- Basic Power BI knowledge

---

## Data Import

### Option 1: Import from CSV
1. Open Power BI Desktop
2. **Home** → **Get Data** → **Text/CSV**
3. Navigate to `contracts/mock-data/requests.csv`
4. Click **Load**
5. Repeat for `users.json` if needed

### Option 2: Connect to Database
1. **Get Data** → **Database** → Choose your database type
2. Enter connection details:
   - Server: `localhost` or production server
   - Database: `request_management`
   - Authentication: SQL Server or Windows
3. Select `requests` and `users` tables
4. Click **Transform Data** to open Power Query Editor

### Option 3: Connect to API
1. **Get Data** → **Web**
2. Enter API URL: `http://localhost:3000/api/requests`
3. If authentication required, click **Advanced** and add headers
4. Click **OK** and **Transform Data**

---

## Data Transformation (Power Query)

### 1. Clean Data
- Remove duplicate rows
- Handle nulls in critical columns
- Ensure correct data types:
  - `createdAt`: DateTime
  - `priority`: Text
  - `category`: Text
  - `status`: Text

### 2. Add Calculated Columns

**Created Date** (for time-based filtering):
```
CreatedDate = DATEVALUE([createdAt])
```

**Created Hour**:
```
CreatedHour = HOUR([createdAt])
```

**Resolution Time (Hours)**:
```
ResolutionTimeHours = 
IF(
  [resolvedAt] <> BLANK(),
  DATEDIFF([createdAt], [resolvedAt], HOUR),
  BLANK()
)
```

**Is Resolved**:
```
IsResolved = IF([status] = "resolved", TRUE(), FALSE())
```

**Week of Year**:
```
WeekOfYear = WEEKNUM([createdAt])
```

### 3. Create Date Table (for time intelligence)
```
DateTable = CALENDAR(MIN(requests[createdAt]), MAX(requests[createdAt]))
```

Then add columns:
```
Year = YEAR(DateTable[Date])
Month = FORMAT(DateTable[Date], "MMMM")
MonthNumber = MONTH(DateTable[Date])
DayOfWeek = FORMAT(DateTable[Date], "dddd")
```

---

## Measures (DAX)

Create these measures in the **requests** table:

### Volume Metrics
```dax
Total Requests = COUNTROWS(requests)

Resolved Requests = 
CALCULATE(
  COUNTROWS(requests),
  requests[status] = "resolved"
)

Pending Requests = 
CALCULATE(
  COUNTROWS(requests),
  requests[status] = "pending"
)

Requests This Week = 
CALCULATE(
  COUNTROWS(requests),
  FILTER(ALL(DateTable), DateTable[WeekOfYear] = WEEKNUM(TODAY()) && DateTable[Year] = YEAR(TODAY()))
)

Requests Last Week = 
CALCULATE(
  COUNTROWS(requests),
  FILTER(ALL(DateTable), DateTable[WeekOfYear] = WEEKNUM(TODAY()) - 1 && DateTable[Year] = YEAR(TODAY()))
)

WoW Change = 
VAR ThisWeek = [Requests This Week]
VAR LastWeek = [Requests Last Week]
RETURN
IF(LastWeek = 0, BLANK(), (ThisWeek - LastWeek) / LastWeek)
```

### Performance Metrics
```dax
Avg Resolution Time (Hours) = 
AVERAGE(requests[ResolutionTimeHours])

Median Resolution Time (Hours) = 
MEDIAN(requests[ResolutionTimeHours])

SLA Compliance % = 
VAR Compliant = 
  CALCULATE(
    COUNTROWS(requests),
    requests[resolvedWithinSLA] = TRUE()
  )
VAR Total = COUNTROWS(requests)
RETURN
DIVIDE(Compliant, Total, 0) * 100
```

---

## Dashboard Layout

### Page 1: Executive Overview

**Cards (Top Row)**:
- Total Requests
- Avg Resolution Time
- SLA Compliance %
- Pending Requests

**Visuals**:
1. **Line Chart**: Requests over time
   - X-axis: CreatedDate
   - Y-axis: Total Requests
   - Legend: Category (optional)

2. **Donut Chart**: Requests by Category
   - Legend: Category
   - Values: Total Requests

3. **Bar Chart**: Requests by Priority
   - Axis: Priority
   - Values: Total Requests
   - Colors: P0=Red, P1=Orange, P2=Blue, P3=Green

4. **Table**: Agent summary
   - Columns: Agent Name, Requests Handled, Avg Resolution Time

**Filters** (right pane):
- Date Range Slicer
- Category Slicer
- Priority Slicer

---

### Page 2: Trend Analysis

**Visuals**:
1. **Line Chart**: Daily request volume
2. **Matrix**: Requests by category and priority
3. **Line Chart**: Resolution time trend
4. **Column Chart**: Requests by day of week
5. **Scatter Plot**: Resolution time vs. priority

---

### Page 3: Agent Performance

**Visuals**:
1. **Table**: Agent leaderboard
2. **Bar Chart**: Requests per agent
3. **Box Plot**: Resolution time distribution by agent (if available)
4. **KPI**: Agent utilization

---

## Formatting

### Color Scheme
Use colors from design system (`packages/ux-design/design-system/tokens.json`):
- Primary: #2196f3
- P0/Critical: #d32f2f (red)
- P1/High: #ed6c02 (orange)
- P2/Medium: #0288d1 (blue)
- P3/Low: #2e7d32 (green)

### Theme
1. **View** → **Themes** → **Customize current theme**
2. Set colors for data points to match design system
3. Save as "Request Management Theme"

### Accessibility
- Use patterns + colors (not color alone)
- Add clear titles to all visuals
- Enable alt text for charts
- Ensure text has sufficient contrast

---

## Interactions

### Cross-filtering
By default, clicking on one visual filters others. Customize:
1. **Format** → **Edit interactions**
2. Set which visuals filter vs. highlight

### Drill-through
Create drill-through page for request details:
1. Add new page "Request Details"
2. Add visual with request ID filter
3. Right-click visual on main page → **Drill through**

---

## Publishing

### To Power BI Service
1. **File** → **Publish** → **Publish to Power BI**
2. Sign in with organization account
3. Choose workspace
4. Share link with stakeholders

### Scheduled Refresh
1. In Power BI Service, go to dataset settings
2. **Schedule refresh** → Set frequency (e.g., daily at 6 AM)
3. Configure data source credentials

---

## Embedded in App (US-03)

### Embed in Frontend
1. Publish report to Power BI Service
2. Copy embed code
3. Use Power BI JavaScript API in React:

```jsx
import { PowerBIEmbed } from 'powerbi-client-react';

<PowerBIEmbed
  embedConfig={{
    type: 'report',
    id: 'your-report-id',
    embedUrl: 'your-embed-url',
    accessToken: 'your-access-token',
    tokenType: 'Embed',
    settings: {
      panes: {
        filters: { visible: true },
        pageNavigation: { visible: true }
      }
    }
  }}
/>
```

---

## Export Options

Users can export data from Power BI:
- **Visual menu** → **Export data** → CSV or Excel
- **File** → **Export to PDF** (entire report)

---

## Troubleshooting

**Q: Visuals show no data**  
A: Check filters, ensure data loaded correctly, verify relationships

**Q: Dates not sorting correctly**  
A: Ensure column is DateTime type, not Text

**Q: Performance is slow**  
A: Reduce data volume, use aggregations, optimize DAX measures

**Q: Can't publish**  
A: Check Power BI Pro license, verify workspace permissions

---

## References
- Power BI Documentation: https://docs.microsoft.com/power-bi/
- DAX Reference: https://dax.guide/
- Metric Definitions: `../docs/METRIC-DEFINITIONS.md`
- User Story: `contracts/user-stories/US-03-manager-dashboard.md`

---

## TODO
- [ ] Import data from source
- [ ] Create calculated columns and measures
- [ ] Build dashboard pages
- [ ] Apply branding and colors
- [ ] Test with sample data
- [ ] Publish to service
- [ ] Share with stakeholders
