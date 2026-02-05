-- Volume Metrics Queries
-- Request Management System - BIA Package
-- 
-- These queries calculate request volume metrics for dashboards and reports.
-- Adjust table/column names based on your database schema.

-- =============================================================================
-- 1. TOTAL REQUESTS
-- =============================================================================

-- Total requests (all time)
SELECT COUNT(*) AS total_requests
FROM requests;

-- Total requests by status
SELECT 
  status,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM requests
GROUP BY status
ORDER BY count DESC;


-- =============================================================================
-- 2. REQUESTS OVER TIME
-- =============================================================================

-- Daily request volume (last 30 days)
SELECT 
  DATE(created_at) AS date,
  COUNT(*) AS requests_count
FROM requests
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Weekly request volume (last 12 weeks)
SELECT 
  DATE_TRUNC('week', created_at) AS week_start,
  COUNT(*) AS requests_count
FROM requests
WHERE created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start;

-- Monthly request volume (last 12 months)
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS requests_count
FROM requests
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Hourly distribution (to identify peak times)
SELECT 
  EXTRACT(HOUR FROM created_at) AS hour_of_day,
  COUNT(*) AS requests_count
FROM requests
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour_of_day;

-- Day of week distribution
SELECT 
  TO_CHAR(created_at, 'Day') AS day_of_week,
  EXTRACT(DOW FROM created_at) AS day_number,
  COUNT(*) AS requests_count
FROM requests
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY day_number;


-- =============================================================================
-- 3. REQUESTS BY CATEGORY
-- =============================================================================

-- Total requests by category
SELECT 
  category,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM requests
GROUP BY category
ORDER BY count DESC;

-- Category volume over time (last 30 days)
SELECT 
  DATE(created_at) AS date,
  category,
  COUNT(*) AS count
FROM requests
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), category
ORDER BY date, count DESC;


-- =============================================================================
-- 4. REQUESTS BY PRIORITY
-- =============================================================================

-- Total requests by priority
SELECT 
  priority,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM requests
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'P0' THEN 1
    WHEN 'P1' THEN 2
    WHEN 'P2' THEN 3
    WHEN 'P3' THEN 4
  END;

-- Priority distribution by category
SELECT 
  category,
  priority,
  COUNT(*) AS count
FROM requests
GROUP BY category, priority
ORDER BY category, 
  CASE priority
    WHEN 'P0' THEN 1
    WHEN 'P1' THEN 2
    WHEN 'P2' THEN 3
    WHEN 'P3' THEN 4
  END;


-- =============================================================================
-- 5. WEEK-OVER-WEEK / MONTH-OVER-MONTH TRENDS
-- =============================================================================

-- Week-over-week comparison
WITH weekly_counts AS (
  SELECT 
    DATE_TRUNC('week', created_at) AS week_start,
    COUNT(*) AS requests_count
  FROM requests
  WHERE created_at >= CURRENT_DATE - INTERVAL '8 weeks'
  GROUP BY DATE_TRUNC('week', created_at)
)
SELECT 
  week_start,
  requests_count,
  LAG(requests_count) OVER (ORDER BY week_start) AS previous_week,
  requests_count - LAG(requests_count) OVER (ORDER BY week_start) AS change,
  ROUND(
    (requests_count - LAG(requests_count) OVER (ORDER BY week_start)) * 100.0 / 
    NULLIF(LAG(requests_count) OVER (ORDER BY week_start), 0),
    2
  ) AS percent_change
FROM weekly_counts
ORDER BY week_start DESC;

-- Month-over-month comparison
WITH monthly_counts AS (
  SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS requests_count
  FROM requests
  WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY DATE_TRUNC('month', created_at)
)
SELECT 
  month,
  requests_count,
  LAG(requests_count) OVER (ORDER BY month) AS previous_month,
  requests_count - LAG(requests_count) OVER (ORDER BY month) AS change,
  ROUND(
    (requests_count - LAG(requests_count) OVER (ORDER BY month)) * 100.0 / 
    NULLIF(LAG(requests_count) OVER (ORDER BY month), 0),
    2
  ) AS percent_change
FROM monthly_counts
ORDER BY month DESC;


-- =============================================================================
-- 6. TOP REQUESTERS
-- =============================================================================

-- Top 10 requesters by volume
SELECT 
  u.name AS requester_name,
  u.email,
  COUNT(r.id) AS requests_submitted
FROM requests r
JOIN users u ON r.requested_by = u.id
GROUP BY u.name, u.email
ORDER BY requests_submitted DESC
LIMIT 10;


-- =============================================================================
-- 7. AGENT WORKLOAD DISTRIBUTION
-- =============================================================================

-- Requests per agent (assigned)
SELECT 
  u.name AS agent_name,
  COUNT(r.id) AS requests_assigned,
  COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) AS requests_resolved,
  COUNT(CASE WHEN r.status = 'in_progress' THEN 1 END) AS requests_in_progress,
  COUNT(CASE WHEN r.status = 'pending' THEN 1 END) AS requests_pending
FROM requests r
LEFT JOIN users u ON r.assigned_to = u.id
WHERE r.assigned_to IS NOT NULL
GROUP BY u.name
ORDER BY requests_assigned DESC;

-- Unassigned requests
SELECT COUNT(*) AS unassigned_requests
FROM requests
WHERE assigned_to IS NULL
  AND status != 'resolved';


-- =============================================================================
-- 8. CURRENT STATISTICS (FOR DASHBOARD KPIs)
-- =============================================================================

-- Dashboard summary metrics
SELECT 
  COUNT(*) AS total_requests,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS in_progress,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved,
  COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) AS today,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS this_week,
  COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) AS this_month
FROM requests;


-- =============================================================================
-- NOTES:
-- - Adjust date intervals based on your needs
-- - Replace table/column names if using different schema
-- - Add WHERE clauses to filter by date range, category, etc.
-- - Optimize with indexes on created_at, status, category, priority
-- - Consider materialized views for frequently-run queries
-- =============================================================================
