# BIA Package (Business Intelligence & Analytics)

## Overview
This package provides scaffolding and templates for the Business Intelligence & Analytics team to create dashboards, queries, and metrics for the Request Management System.

## Role of BIA
- **Data Analysis**: Analyze request patterns, trends, and bottlenecks
- **Dashboard Creation**: Build interactive visualizations for stakeholders
- **Metric Definition**: Define and track KPIs
- **Reporting**: Generate executive summaries and insights memos
- **Data Quality**: Ensure data accuracy and completeness

---

## Team Deliverables

### Phase 1: Data Setup (Days 1-2)
- [ ] Load mock data into analytics tool
- [ ] Validate data structure and quality
- [ ] Document data sources and connections

### Phase 2: Metrics & Queries (Days 3-4)
- [ ] Define metric calculations (`docs/METRIC-DEFINITIONS.md`)
- [ ] Create SQL queries for key metrics
- [ ] Test query performance and accuracy

### Phase 3: Dashboard Development (Days 5-6)
- [ ] Build request volume dashboard
- [ ] Build SLA compliance dashboard
- [ ] Build category/priority analysis dashboard
- [ ] Build agent performance dashboard

### Phase 4: Documentation & Handoff (Day 7)
- [ ] Create dashboard usage guide
- [ ] Write insights memo template
- [ ] Train stakeholders on dashboard access

---

## Project Structure

```
bia/
├── data/                 # Data loading scripts
├── dashboards/           # Dashboard-specific resources
│   ├── power-bi/         # Power BI files
│   ├── tableau/          # Tableau workbooks
│   ├── looker/           # Looker LookML
│   └── spreadsheet/      # Excel/Google Sheets templates
├── queries/              # SQL query templates
├── docs/                 # Documentation
└── README.md            # This file
```

---

## Supported Tools

### Primary Tools
1. **Power BI**: Enterprise dashboards
2. **Tableau**: Interactive visualizations
3. **Looker**: Embedded analytics
4. **Excel/Google Sheets**: Ad-hoc analysis

Choose the tool that best fits your organization's BI stack.

---

## Data Sources

### Development Data
- **Mock Data**: `contracts/mock-data/requests.csv` and `requests.json`
- **Generator**: Use `contracts/mock-data/data-generator.js` to create more data
- **Size**: ~100-1000 requests (adjust as needed)

### Production Data
- **Database**: Connect to backend database (PostgreSQL, MySQL, etc.)
- **API**: Query backend API endpoints
- **Data Warehouse**: If available (Snowflake, BigQuery, Redshift)

### Schema Reference
- **Request Schema**: `contracts/schemas/request.schema.json`
- **Field Dictionary**: `contracts/data-models/field-dictionary.md`
- **Business Rules**: `contracts/data-models/business-rules.md`

---

## Key Metrics

See `docs/METRIC-DEFINITIONS.md` for detailed calculations.

### Volume Metrics
- Total requests
- Requests by period (daily, weekly, monthly)
- Requests by category
- Requests by priority

### Performance Metrics
- Average resolution time
- Median resolution time
- SLA compliance rate
- Requests by status

### Agent Metrics
- Requests handled per agent
- Average resolution time per agent
- Agent workload distribution

### Trend Metrics
- Day-over-day growth
- Hourly/daily patterns during the intensive bootcamp
- Request volume trends

---

## Getting Started

### 1. Load Mock Data
```bash
cd packages/bia/data
node load-seed-data.js
```

### 2. Choose Dashboard Tool
- **Power BI**: See `dashboards/power-bi/README.md`
- **Tableau**: See `dashboards/tableau/README.md`
- **Looker**: See `dashboards/looker/README.md`
- **Spreadsheet**: See `dashboards/spreadsheet/README.md`

### 3. Run Sample Queries
```sql
-- Example: Request volume by category
-- See queries/volume-metrics.sql
SELECT category, COUNT(*) as count
FROM requests
GROUP BY category
ORDER BY count DESC;
```

### 4. Build Dashboard
- Import data into chosen tool
- Create visualizations based on metrics
- Add filters (date range, category, priority, agent)
- Test with stakeholders

---

## Integration Points

### With Data Science Package
- Track ML model prediction accuracy
- Analyze prediction confidence distribution
- Identify categories with low prediction accuracy

### With Backend Package
- Query production database
- Use API endpoints for real-time data
- Monitor system performance metrics

### With Frontend Package
- Embed dashboards in manager view (US-03)
- Export data for download features

---

## Dashboard Requirements

### Manager Dashboard (US-03)
**Required Visualizations**:
1. **Overview Cards**: Total requests, avg resolution time, SLA compliance
2. **Volume Chart**: Line chart showing requests over time
3. **Category Breakdown**: Pie or donut chart
4. **Agent Performance**: Table or bar chart
5. **Trend Indicators**: Day-over-day change arrows

**Filters**:
- Date range picker
- Category filter
- Priority filter
- Agent filter
- Status filter

**Export Options**:
- PDF report
- CSV data export
- Email scheduled reports

---

## Best Practices

### Data Refresh
- **Real-time**: For critical metrics (optional)
- **Hourly**: For operational dashboards
- **Daily**: For executive reports
- **Weekly**: For trend analysis

### Performance
- Pre-aggregate data where possible
- Use indexed columns for filters
- Limit date ranges for large datasets
- Cache query results

### Accessibility
- Use color + patterns (not color alone)
- Provide data tables as alternative to charts
- Ensure high contrast for text
- Add alt text for charts

### Security
- Role-based access control
- Don't expose sensitive data in dashboards
- Audit dashboard access logs

---

## Workflow

1. **Define Requirements**: Meet with stakeholders to understand needs
2. **Design Mockup**: Sketch dashboard layout
3. **Develop Queries**: Write and test SQL queries
4. **Build Dashboard**: Create visualizations
5. **Validate Data**: Cross-check with source data
6. **User Testing**: Get feedback from managers
7. **Iterate**: Refine based on feedback
8. **Document**: Update DASHBOARD-GUIDE.md
9. **Deploy**: Publish to production
10. **Monitor**: Track usage and accuracy

---

## Metric Calculation Examples

### SLA Compliance Rate
```sql
SELECT 
  COUNT(CASE WHEN resolved_within_sla = true THEN 1 END) * 100.0 / COUNT(*) as sla_compliance_pct
FROM requests
WHERE status = 'resolved';
```

### Average Resolution Time by Priority
```sql
SELECT 
  priority,
  AVG(EXTRACT(EPOCH FROM (resolvedAt - createdAt)) / 3600) as avg_hours
FROM requests
WHERE status = 'resolved'
GROUP BY priority;
```

See `queries/` directory for more examples.

---

## Troubleshooting

**Q: Mock data not loading?**  
A: Check file paths in `data/load-seed-data.js`. Ensure `contracts/mock-data/` exists.

**Q: Queries are slow?**  
A: Add indexes on commonly filtered columns (category, priority, createdAt, status).

**Q: Dashboard shows no data?**  
A: Verify data source connection. Check date range filters.

**Q: Metrics don't match expectations?**  
A: Review calculation logic in `docs/METRIC-DEFINITIONS.md`. Validate with sample data.

---

## References

- **Contracts**: [`../../contracts/`](../../contracts/)
- **Mock Data**: [`../../contracts/mock-data/`](../../contracts/mock-data/)
- **User Stories**: [`../../contracts/user-stories/US-03-manager-dashboard.md`](../../contracts/user-stories/US-03-manager-dashboard.md)
- **Backend API**: [`../backend/docs/API.md`](../backend/docs/API.md)
- **Frontend Integration**: [`../frontend/docs/INTEGRATION.md`](../frontend/docs/INTEGRATION.md)

---

## Support

For questions:
- **Metrics/Calculations**: BIA team lead
- **Data Access**: Backend/DevOps team
- **Dashboard Issues**: BI tool administrator
- **Requirements**: Product owner

---

## Next Steps

1. Load mock data
2. Define metrics in `docs/METRIC-DEFINITIONS.md`
3. Write SQL queries in `queries/`
4. Build initial dashboard
5. Share with stakeholders for feedback
6. Iterate and refine
