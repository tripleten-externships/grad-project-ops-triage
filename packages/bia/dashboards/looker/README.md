# Looker Dashboard Instructions

## Overview
Guide for creating Request Management dashboards in Looker using LookML.

---

## Prerequisites
- Looker instance access
- Database connection configured
- LookML developer access
- Git for version control

---

## LookML Model Setup

### 1. Create Connection
In Looker Admin:
- **Admin** → **Database** → **Connections**
- Add connection to your database
- Name: `request_management_db`

### 2. Create Project
- **Develop** → **Manage LookML Projects** → **New Project**
- Name: `request_management`
- Configure Git repository

### 3. Define Data Model

**File**: `models/request_management.model.lkml`

```lkml
connection: "request_management_db"

include: "/views/*.view.lkml"
include: "/dashboards/*.dashboard.lkml"

explore: requests {
  label: "Requests"
  
  join: users {
    type: left_outer
    sql_on: ${requests.requested_by} = ${users.id} ;;
    relationship: many_to_one
  }
}
```

---

## View Definitions

### Requests View

**File**: `views/requests.view.lkml`

```lkml
view: requests {
  sql_table_name: public.requests ;;
  
  # --- Primary Key ---
  dimension: id {
    primary_key: yes
    type: string
    sql: ${TABLE}.id ;;
  }
  
  # --- Dimensions ---
  dimension: title {
    type: string
    sql: ${TABLE}.title ;;
  }
  
  dimension: description {
    type: string
    sql: ${TABLE}.description ;;
  }
  
  dimension: category {
    type: string
    sql: ${TABLE}.category ;;
  }
  
  dimension: priority {
    type: string
    sql: ${TABLE}.priority ;;
    order_by_field: priority_order
  }
  
  dimension: priority_order {
    hidden: yes
    type: number
    sql: 
      CASE ${priority}
        WHEN 'P0' THEN 1
        WHEN 'P1' THEN 2
        WHEN 'P2' THEN 3
        WHEN 'P3' THEN 4
        ELSE 5
      END ;;
  }
  
  dimension: status {
    type: string
    sql: ${TABLE}.status ;;
  }
  
  dimension: requested_by {
    type: string
    sql: ${TABLE}.requested_by ;;
  }
  
  dimension: assigned_to {
    type: string
    sql: ${TABLE}.assigned_to ;;
  }
  
  # --- Dates ---
  dimension_group: created {
    type: time
    timeframes: [
      raw,
      time,
      date,
      week,
      month,
      quarter,
      year,
      day_of_week,
      hour_of_day
    ]
    sql: ${TABLE}.created_at ;;
  }
  
  dimension_group: updated {
    type: time
    timeframes: [raw, date, week, month]
    sql: ${TABLE}.updated_at ;;
  }
  
  dimension_group: resolved {
    type: time
    timeframes: [raw, date, week, month]
    sql: ${TABLE}.resolved_at ;;
  }
  
  # --- Derived Dimensions ---
  dimension: is_resolved {
    type: yesno
    sql: ${status} = 'resolved' ;;
  }
  
  dimension: resolution_time_hours {
    type: number
    sql: 
      EXTRACT(EPOCH FROM (${resolved_raw} - ${created_raw})) / 3600 ;;
    value_format_name: decimal_2
  }
  
  dimension: resolution_time_tier {
    type: tier
    tiers: [1, 4, 24, 72]
    style: integer
    sql: ${resolution_time_hours} ;;
    description: "Bins: <1h, 1-4h, 4-24h, 24-72h, >72h"
  }
  
  dimension: resolved_within_sla {
    type: yesno
    sql: 
      CASE 
        WHEN ${priority} = 'P0' AND ${resolution_time_hours} <= 4 THEN TRUE
        WHEN ${priority} = 'P1' AND ${resolution_time_hours} <= 24 THEN TRUE
        WHEN ${priority} = 'P2' AND ${resolution_time_hours} <= 72 THEN TRUE
        WHEN ${priority} = 'P3' AND ${resolution_time_hours} <= 168 THEN TRUE
        ELSE FALSE
      END ;;
  }
  
  # --- Measures ---
  measure: count {
    type: count
    drill_fields: [detail*]
  }
  
  measure: count_resolved {
    type: count
    filters: [status: "resolved"]
  }
  
  measure: count_pending {
    type: count
    filters: [status: "pending"]
  }
  
  measure: avg_resolution_time_hours {
    type: average
    sql: ${resolution_time_hours} ;;
    value_format_name: decimal_2
    drill_fields: [detail*]
  }
  
  measure: median_resolution_time_hours {
    type: median
    sql: ${resolution_time_hours} ;;
    value_format_name: decimal_2
  }
  
  measure: sla_compliance_rate {
    type: number
    sql: 
      100.0 * SUM(CASE WHEN ${resolved_within_sla} THEN 1 ELSE 0 END) / 
      NULLIF(COUNT(*), 0) ;;
    value_format_name: decimal_1
  }
  
  # --- Drill Fields ---
  set: detail {
    fields: [
      id,
      title,
      category,
      priority,
      status,
      created_date,
      resolution_time_hours
    ]
  }
}
```

### Users View

**File**: `views/users.view.lkml`

```lkml
view: users {
  sql_table_name: public.users ;;
  
  dimension: id {
    primary_key: yes
    type: string
    sql: ${TABLE}.id ;;
  }
  
  dimension: name {
    type: string
    sql: ${TABLE}.name ;;
  }
  
  dimension: email {
    type: string
    sql: ${TABLE}.email ;;
  }
  
  dimension: role {
    type: string
    sql: ${TABLE}.role ;;
  }
  
  measure: count {
    type: count
  }
}
```

---

## Dashboard Definition

**File**: `dashboards/executive_overview.dashboard.lkml`

```lkml
- dashboard: executive_overview
  title: Request Management - Executive Overview
  layout: newspaper
  preferred_viewer: dashboards-next
  
  elements:
  - name: total_requests
    title: Total Requests
    explore: requests
    type: single_value
    fields: [requests.count]
    limit: 500
    query_timezone: America/Los_Angeles
    custom_color_enabled: true
    show_single_value_title: true
    show_comparison: false
    comparison_type: value
    comparison_reverse_colors: false
    show_comparison_label: true
    enable_conditional_formatting: false
    row: 0
    col: 0
    width: 6
    height: 4
  
  - name: avg_resolution_time
    title: Avg Resolution Time (Hours)
    explore: requests
    type: single_value
    fields: [requests.avg_resolution_time_hours]
    limit: 500
    row: 0
    col: 6
    width: 6
    height: 4
  
  - name: sla_compliance
    title: SLA Compliance %
    explore: requests
    type: single_value
    fields: [requests.sla_compliance_rate]
    limit: 500
    row: 0
    col: 12
    width: 6
    height: 4
  
  - name: pending_requests
    title: Pending Requests
    explore: requests
    type: single_value
    fields: [requests.count_pending]
    limit: 500
    row: 0
    col: 18
    width: 6
    height: 4
  
  - name: requests_over_time
    title: Requests Over Time
    explore: requests
    type: looker_line
    fields: [requests.created_date, requests.count]
    fill_fields: [requests.created_date]
    sorts: [requests.created_date desc]
    limit: 500
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: true
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    show_null_points: true
    interpolation: linear
    row: 4
    col: 0
    width: 24
    height: 8
  
  - name: requests_by_category
    title: Requests by Category
    explore: requests
    type: looker_pie
    fields: [requests.category, requests.count]
    sorts: [requests.count desc]
    limit: 500
    value_labels: legend
    label_type: labPer
    inner_radius: 50
    row: 12
    col: 0
    width: 12
    height: 8
  
  - name: requests_by_priority
    title: Requests by Priority
    explore: requests
    type: looker_bar
    fields: [requests.priority, requests.count]
    sorts: [requests.count desc]
    limit: 500
    x_axis_gridlines: false
    y_axis_gridlines: true
    show_view_names: false
    show_y_axis_labels: true
    show_y_axis_ticks: true
    y_axis_tick_density: default
    y_axis_tick_density_custom: 5
    show_x_axis_label: true
    show_x_axis_ticks: true
    y_axis_scale_mode: linear
    x_axis_reversed: false
    y_axis_reversed: false
    plot_size_by_field: false
    trellis: ''
    stacking: ''
    limit_displayed_rows: false
    legend_position: center
    series_types: {}
    point_style: none
    show_value_labels: false
    label_density: 25
    x_axis_scale: auto
    y_axis_combined: true
    ordering: none
    show_null_labels: false
    show_totals_labels: false
    show_silhouette: false
    totals_color: "#808080"
    row: 12
    col: 12
    width: 12
    height: 8
  
  filters:
  - name: Date Range
    title: Date Range
    type: field_filter
    default_value: 30 day
    allow_multiple_values: true
    required: false
    ui_config:
      type: relative_timeframes
      display: inline
      options: []
    explore: requests
    field: requests.created_date
  
  - name: Category
    title: Category
    type: field_filter
    default_value: ''
    allow_multiple_values: true
    required: false
    ui_config:
      type: checkboxes
      display: popover
    explore: requests
    field: requests.category
  
  - name: Priority
    title: Priority
    type: field_filter
    default_value: ''
    allow_multiple_values: true
    required: false
    ui_config:
      type: checkboxes
      display: popover
    explore: requests
    field: requests.priority
```

---

## Embedding in Frontend

Use Looker Embed SDK:

```javascript
import { LookerEmbedSDK } from '@looker/embed-sdk'

LookerEmbedSDK.init('your-looker-host.com', '/auth-endpoint')

const dashboard = LookerEmbedSDK.createDashboardWithId('executive_overview')
  .appendTo('#dashboard-container')
  .withFilters({ 'requests.created_date': '30 days' })
  .build()
  .connect()
  .then((dashboard) => {
    console.log('Dashboard loaded');
  })
  .catch((error) => {
    console.error('Error loading dashboard:', error);
  });
```

---

## Deployment

1. **Commit Changes**: Push LookML to Git
2. **Deploy to Production**: Use Looker deploy webhook
3. **Set Permissions**: Grant access to manager role
4. **Schedule Deliveries**: Email/Slack dashboard snapshots

---

## References
- Looker Documentation: https://docs.looker.com/
- LookML Reference: https://docs.looker.com/reference/lookml-quick-reference
- Metric Definitions: `../docs/METRIC-DEFINITIONS.md`

---

## TODO
- [ ] Set up database connection
- [ ] Create LookML views
- [ ] Define explores
- [ ] Build dashboard
- [ ] Test filters and drill-downs
- [ ] Deploy to production
- [ ] Set up scheduled deliveries
