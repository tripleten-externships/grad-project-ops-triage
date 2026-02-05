# Spreadsheet Dashboard (Excel / Google Sheets)

## Overview
Guide for creating Request Management dashboards using Excel or Google Sheets for teams without dedicated BI tools.

---

## Prerequisites
- Microsoft Excel (2016+) or Google Sheets
- Access to data (CSV export or database connection)
- Basic spreadsheet skills

---

## Data Import

### Excel

**From CSV**:
1. **Data** → **Get Data** → **From File** → **From Text/CSV**
2. Select `contracts/mock-data/requests.csv`
3. Click **Transform Data** to open Power Query
4. Clean data types, remove duplicates
5. Click **Close & Load**

**From Database** (requires Office 365):
1. **Data** → **Get Data** → **From Database**
2. Enter connection details
3. Select `requests` table
4. Load into sheet

### Google Sheets

**From CSV**:
1. **File** → **Import** → **Upload**
2. Select `requests.csv`
3. Choose **Replace current sheet** or **Insert new sheet**
4. Import data

**From Database** (Google Sheets Add-on):
1. Install "Supermetrics" or similar connector add-on
2. Connect to database
3. Import data

---

## Template Structure

We provide a pre-built template with formulas and charts.

### Sheet 1: Raw Dat

a
- Import request data here
- Do not manually edit (formulas reference this sheet)

### Sheet 2: Dashboard
- Visual summary with charts and KPI cards
- Auto-updates when raw data changes

### Sheet 3: Metrics
- Calculated metrics
- Pivot tables

### Sheet 4: Filters
- Helper sheet for dropdown filters

---

## Key Formulas

### Total Requests
```excel
=COUNTA(RawData!A:A) - 1
```
(Count all rows minus header)

### Resolved Requests
```excel
=COUNTIF(RawData!F:F, "resolved")
```
(Count where status = "resolved")

### Average Resolution Time
For Excel/Sheets with date columns:
```excel
=AVERAGE(
  IF(RawData!F:F="resolved", 
     RawData!H:H - RawData!G:G, 
     ""
  )
) * 24
```
(Returns hours)

### SLA Compliance Rate
```excel
=COUNTIFS(RawData!F:F, "resolved", RawData!I:I, TRUE) / 
 COUNTIF(RawData!F:F, "resolved") * 100
```

### Requests This Week
```excel
=COUNTIFS(
  RawData!G:G, ">="&TODAY()-WEEKDAY(TODAY())+1,
  RawData!G:G, "<="&TODAY()
)
```

### Week-over-Week Change
```excel
=(ThisWeek - LastWeek) / LastWeek * 100
```

---

## Pivot Tables

### Requests by Category

**Excel**:
1. Select data range
2. **Insert** → **PivotTable**
3. Rows: Category
4. Values: Count of Request ID
5. Sort descending

**Google Sheets**:
1. **Data** → **Pivot table**
2. Rows: Category
3. Values: COUNTA of Request ID
4. Sort descending

### Requests by Priority and Category

**Excel**:
- Rows: Category
- Columns: Priority
- Values: Count of Request ID
- Show as: Percentage of Grand Total (optional)

---

## Charts

### 1. KPI Cards (Excel)

Create using shapes:
1. **Insert** → **Shapes** → **Rectangle**
2. Add text box with formula: `=Metrics!B2` (Total Requests)
3. Format: Large font, colored background
4. Duplicate for other KPIs

**Google Sheets**: Use text + formatting (no native card visual)

### 2. Requests Over Time (Line Chart)

**Data**:
- X-axis: Date (group by day/week)
- Y-axis: Count of requests

**Steps**:
1. Create pivot table: Rows=Created Date, Values=Count
2. Select pivot table
3. **Insert** → **Line Chart**
4. Format axes, add title

### 3. Category Breakdown (Pie Chart)

**Data**:
- Labels: Category
- Values: Count

**Steps**:
1. Use category pivot table
2. **Insert** → **Pie Chart** or **Donut Chart**
3. Add data labels showing percentages

### 4. Priority Distribution (Bar Chart)

**Data**:
- X-axis: Priority (P0, P1, P2, P3)
- Y-axis: Count

**Steps**:
1. Create pivot table by priority
2. **Insert** → **Bar Chart** (horizontal)
3. Color code bars: P0=Red, P1=Orange, P2=Blue, P3=Green

### 5. Agent Performance (Table)

Use pivot table:
- Rows: Assigned To (agent name)
- Values: 
  - Count of Request ID
  - Average of Resolution Time Hours
- Sort by count descending

---

## Conditional Formatting

### Highlight High Priority
1. Select Priority column
2. **Home** → **Conditional Formatting** → **New Rule**
3. Format cells that contain: "P0"
4. Set red background

### Resolution Time Color Scale
1. Select Resolution Time column
2. **Conditional Formatting** → **Color Scales**
3. Choose Green→Yellow→Red (green = fast, red = slow)

### SLA Status
1. Select SLA Compliant column
2. **Conditional Formatting** → **Icon Sets**
3. Use checkmark / X icons

---

## Filters & Slicers

### Excel

**Slicers** (visual filters):
1. Select pivot table or table range
2. **Insert** → **Slicer**
3. Choose fields: Category, Priority, Status
4. Position slicers above dashboard

**Filter Connections**:
1. Right-click slicer → **Report Connections**
2. Select which pivot tables/charts to filter

### Google Sheets

**Filter Views**:
1. Select data range
2. **Data** → **Create a filter**
3. Use dropdown arrows in header row
4. Save filter views for different stakeholders

---

## Automation

### Excel

**Refresh Data** (if using Power Query):
1. **Data** → **Refresh All**
2. Set auto-refresh: **Data** → **Queries & Connections** → Right-click → **Properties** → **Refresh every X minutes**

**Macro for Export**:
```vba
Sub ExportDashboardToPDF()
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, _
        Filename:="Dashboard_" & Format(Date, "yyyy-mm-dd") & ".pdf"
End Sub
```

### Google Sheets

**Apps Script** for auto-refresh:
```javascript
function refreshData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RawData');
  // TODO: Add logic to fetch fresh data from API or database
  SpreadsheetApp.flush();
}

// Set trigger: Edit → Current project's triggers → Add trigger
// Function: refreshData, Event: Time-driven, Hour timer
```

---

## Template Download

<!-- TODO: Create and host Excel/Google Sheets template -->

**Excel Template**: `dashboards/spreadsheet/Request_Management_Dashboard.xlsx`  
**Google Sheets Template**: [Link to template]

### Using the Template

1. Download/make a copy of template
2. Go to "RawData" sheet
3. Paste your data (or import CSV)
4. Ensure columns match:
   - A: Request ID
   - B: Title
   - C: Description
   - D: Category
   - E: Priority
   - F: Status
   - G: Created At
   - H: Resolved At
   - I: SLA Compliant
5. Navigate to "Dashboard" sheet → Charts auto-update

---

## Sharing & Collaboration

### Excel

**Share via OneDrive**:
1. Save to OneDrive/SharePoint
2. **File** → **Share**
3. Set permissions (View/Edit)
4. Send link to stakeholders

**Excel Online**: Collaborative editing in browser

### Google Sheets

**Share**:
1. **File** → **Share**
2. Add email addresses
3. Set permissions: Viewer, Commenter, Editor
4. Share-or publish to web for embed

---

## Limitations

- **Manual Refresh**: Unlike BI tools, requires manual data updates
- **Performance**: Slow with >10,000 rows
- **Interactivity**: Limited compared to Power BI/Tableau
- **Collaboration**: Version control can be challenging in Excel

---

## Best Practices

### For Excel
- Use Tables (`Ctrl+T`) for dynamic ranges
- Name ranges for easier formulas
- Protect sheets to prevent accidental edits
- Use data validation for input fields

### For Google Sheets
- Use `QUERY()` function for SQL-like filtering
- Leverage Google Apps Script for automation
- Use named ranges and `INDIRECT()` for dynamic formulas
- Version history for tracking changes

---

## Export Options

### Excel
- **PDF**: **File** → **Export** → **Create PDF/XPS**
- **CSV**: **File** → **Save As** → **CSV**
- **Print**: **File** → **Print** → Configure layout

### Google Sheets
- **PDF**: **File** → **Download** → **PDF**
- **CSV**: **File** → **Download** → **CSV**
- **Excel**: **File** → **Download** → **Microsoft Excel**

---

## Troubleshooting

**Q: Formulas show #REF! error**  
A: Check that referenced ranges exist, adjust cell references

**Q: Charts not updating**  
A: Right-click chart → **Select Data** → Verify data range

**Q: Pivot table shows old data**  
A: Right-click pivot → **Refresh**

**Q: Conditional formatting not working**  
A: Check formula logic, ensure cell references are correct

---

## Upgrading to BI Tool

When you outgrow spreadsheets:
1. Export data to CSV for import into Power BI/Tableau
2. Replicate dashboard layout in BI tool
3. Connect BI tool directly to database for auto-refresh
4. Migrate users to new platform

---

## References
- Excel Formulas: https://support.microsoft.com/excel
- Google Sheets Functions: https://support.google.com/docs/table/25273
- Pivot Tables: https://support.microsoft.com/en-us/office/create-a-pivottable
- Metric Definitions: `../docs/METRIC-DEFINITIONS.md`

---

## TODO
- [ ] Download template
- [ ] Import data
- [ ] Verify formulas calculate correctly
- [ ] Customize chart colors to match branding
- [ ] Share with stakeholders
- [ ] Set up refresh schedule
