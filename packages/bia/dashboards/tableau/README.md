# Tableau Dashboard Instructions

## Overview
Guide for creating Request Management dashboards in Tableau Desktop/Tableau Public.

---

## Prerequisites
- Tableau Desktop or Tableau Public
- Data source access (CSV, database, or API)
- Tableau license (if using Tableau Server)

---

## Data Connection

### Connect to CSV
1. Open Tableau
2. **Connect** → **To a File** → **Text file**
3. Navigate to `contracts/mock-data/requests.csv`
4. Data will appear in Data Source tab

### Connect to Database
1. **Connect** → **To a Server** → Choose database type
2. Enter connection details
3. Drag `requests` table to canvas
4. Join with `users` table if needed (Inner Join on requestedBy = id)

### Connect to JSON/API
1. **Connect** → **To a Server** → **Web Data Connector**
2. Enter API URL or use custom connector
3. Transform JSON to tabular format

---

## Data Preparation

### Data Interpreter
If CSV has formatting issues:
1. Check **Use Data Interpreter** in Data Source tab
2. Review field names and types

### Data Types
Ensure correct types:
- `Created At`: Date & Time
- `Resolved At`: Date & Time  
- `Category`: String (Dimension)
- `Priority`: String (Dimension)
- `Status`: String (Dimension)

### Calculated Fields

Right-click in Data pane → **Create Calculated Field**

**Resolution Time (Hours)**:
```
DATEDIFF('hour', [Created At], [Resolved At])
```

**Is Resolved**:
```
IF [Status] = "resolved" THEN TRUE
ELSE FALSE
END
```

**Resolved Within SLA** (example: 24 hours for P1):
```
CASE [Priority]
  WHEN 'P0' THEN DATEDIFF('hour', [Created At], [Resolved At]) <= 4
  WHEN 'P1' THEN DATEDIFF('hour', [Created At], [Resolved At]) <= 24
  WHEN 'P2' THEN DATEDIFF('hour', [Created At], [Resolved At]) <= 72
  WHEN 'P3' THEN DATEDIFF('hour', [Created At], [Resolved At]) <= 168
  ELSE FALSE
END
```

**Week of Year**:
```
WEEK([Created At])
```

---

## Worksheet Examples

### 1. Total Requests (KPI Card)
- Drag `Request ID` to Text
- Change aggregation to COUNT (DISTINCT)
- Format as number, large font
- Add to dashboard

### 2. Requests Over Time (Line Chart)
- Columns: `Created At` (Continuous, Day)
- Rows: `Request ID` (COUNT)
- Optional: Color by Category
- Right-click axis → **Format** → Adjust as needed

### 3. Requests by Category (Donut Chart)
- Drag `Category` to Rows
- Drag `Request ID` (COUNT) to Angle
- Drag `Request ID` (COUNT) to Size
- Marks: **Pie**
- Duplicate pie, change to white circle, layer on top for donut effect

### 4. Requests by Priority (Bar Chart)
- Rows: `Priority`
- Columns: `Request ID` (COUNT)
- Color: `Priority` (use custom colors: P0=Red, P1=Orange, etc.)
- Sort descending by count

### 5. Average Resolution Time
- Create KPI with `AVG([Resolution Time Hours])`
- Format to 1 decimal place
- Add " hours" suffix

### 6. SLA Compliance Rate
**Calculated Field**:
```
SUM(IF [Resolved Within SLA] THEN 1 ELSE 0 END) / COUNT([Request ID])
```
- Format as Percentage
- Display as KPI card

### 7. Agent Performance Table
- Rows: `Assigned To` (agent name)
- Columns: 
  - `Request ID` (COUNT) - "Requests Handled"
  - `AVG([Resolution Time Hours])` - "Avg Res Time"
- Sort by Requests Handled descending

---

## Dashboard Layout

### Dashboard 1: Executive Overview

**Size**: Fixed (1200 x 800) or Automatic

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  [Filters: Date Range | Category | Priority]   │
├──────────┬──────────┬──────────┬───────────────┤
│ Total    │ Avg Res  │ SLA %    │ Pending       │
│ Requests │ Time     │          │ Requests      │
├──────────┴──────────┴──────────┴───────────────┤
│                                                 │
│         Requests Over Time (Line Chart)         │
│                                                 │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│  Category        │     Priority Breakdown       │
│  Breakdown       │     (Bar Chart)              │
│  (Donut)         │                              │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│              Agent Performance Table            │
└─────────────────────────────────────────────────┘
```

**Objects**:
- **Text**: Title "Request Management Dashboard"
- **Filter**: Date Range (Relative: Last 30 days)
- **Filter**: Category
- **Filter**: Priority
- **KPI Cards**: 4 worksheets
- **Charts**: 3 visualizations
- **Table**: 1 worksheet

**Interactions**:
- Enable **Use as Filter** for Category and Priority charts
- Clicking on a slice/bar filters other visuals

---

## Formatting

### Colors
Match design system:
- Edit **Color Palette**: 
  - P0: #d32f2f
  - P1: #ed6c02
  - P2: #0288d1
  - P3: #2e7d32

### Fonts
- Title: 18pt, Bold
- Headers: 12pt, Bold
- Body: 10pt

### Tooltips
Customize tooltips for better UX:
- Worksheet → Tooltip → Edit
- Include relevant fields
- Format as readable text

---

## Parameters & Filters

### Date Range Filter
1. Create Parameter: `Date Range Type` (Last7Days, Last30Days, LastQuarter)
2. Create Calculated Field based on parameter
3. Use as filter

### Dynamic Title
```
"Requests for " + [Date Range Type] + " (" + STR(COUNTD([Request ID])) + " total)"
```

---

## Publishing

### To Tableau Server
1. **Server** → **Publish Workbook**
2. Choose project
3. Set permissions (Viewer for managers)
4. Schedule extract refresh

### To Tableau Public (Free)
1. **Server** → **Tableau Public** → **Save to Tableau Public**
2. Get shareable link
3. Embed in website

### Embedded in Frontend
```html
<div class='tableauPlaceholder'>
  <object class='tableauViz' width='1200' height='800'>
    <param name='host_url' value='https://public.tableau.com/' />
    <param name='embed_code_version' value='3' />
    <param name='site_root' value='' />
    <param name='name' value='YourDashboardName' />
    <param name='tabs' value='no' />
    <param name='toolbar' value='yes' />
  </object>
</div>
```

---

## Export Options

Users can export from Tableau:
- **Download** → **Image** (PNG)
- **Download** → **PDF**
- **Download** → **Data** (CSV) - if enabled by admin

---

## Troubleshooting

**Q: Can't connect to database**  
A: Check firewall, verify credentials, ensure Tableau drivers installed

**Q: Calculations show errors**  
A: Check field types, use IFNULL() for null handling

**Q: Dashboard is slow**  
A: Use data extracts instead of live connection, optimize calculations

**Q: Colors not matching design**  
A: Create custom color palette in Preferences

---

## References
- Tableau Documentation: https://help.tableau.com/
- Calculated Fields Guide: https://help.tableau.com/current/pro/desktop/en-us/calculations_calculatedfields.htm
- Metric Definitions: `../docs/METRIC-DEFINITIONS.md`

---

## TODO
- [ ] Connect to data source
- [ ] Create calculated fields
- [ ] Build worksheets
- [ ] Assemble dashboard
- [ ] Apply formatting and branding
- [ ] Test interactivity
- [ ] Publish to server/public
- [ ] Share with stakeholders
