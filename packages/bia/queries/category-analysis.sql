-- Category Analysis Queries
-- Request Management System - BIA Package
--
-- Queries to analyze request patterns by category and identify trends

-- =============================================================================
-- 1. CATEGORY BREAKDOWN
-- =============================================================================

-- Overall category distribution
SELECT 
  category,
  COUNT(*) AS total_requests,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS in_progress
FROM requests
GROUP BY category
ORDER BY total_requests DESC;

-- Category distribution by time period
SELECT 
  category,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS last_7_days,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS last_30_days,
  COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) AS this_month,
  COUNT(*) AS all_time
FROM requests
GROUP BY category
ORDER BY last_30_days DESC;


-- =============================================================================
-- 2. CATEGORY TRENDS OVER TIME
-- =============================================================================

-- Daily requests by category (last 30 days)
SELECT 
  DATE(created_at) AS date,
  category,
  COUNT(*) AS requests_count
FROM requests
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), category
ORDER BY date, requests_count DESC;

-- Weekly category trends (last 12 weeks)
SELECT 
  DATE_TRUNC('week', created_at) AS week_start,
  category,
  COUNT(*) AS requests_count
FROM requests
WHERE created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at), category
ORDER BY week_start, requests_count DESC;

-- Month-over-month category growth
WITH monthly_data AS (
  SELECT 
    DATE_TRUNC('month', created_at) AS month,
    category,
    COUNT(*) AS count
  FROM requests
  WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY DATE_TRUNC('month', created_at), category
)
SELECT 
  month,
  category,
  count,
  LAG(count) OVER (PARTITION BY category ORDER BY month) AS previous_month,
  count - LAG(count) OVER (PARTITION BY category ORDER BY month) AS absolute_change,
  ROUND(
    (count - LAG(count) OVER (PARTITION BY category ORDER BY month)) * 100.0 / 
    NULLIF(LAG(count) OVER (PARTITION BY category ORDER BY month), 0),
    2
  ) AS percent_change
FROM monthly_data
ORDER BY month DESC, category;


-- =============================================================================
-- 3. CATEGORY × PRIORITY ANALYSIS
-- =============================================================================

-- Cross-tabulation of category and priority
SELECT 
  category,
  COUNT(CASE WHEN priority = 'P0' THEN 1 END) AS p0_count,
  COUNT(CASE WHEN priority = 'P1' THEN 1 END) AS p1_count,
  COUNT(CASE WHEN priority = 'P2' THEN 1 END) AS p2_count,
  COUNT(CASE WHEN priority = 'P3' THEN 1 END) AS p3_count,
  COUNT(*) AS total,
  -- Average priority score (P0=1, P1=2, P2=3, P3=4)
  ROUND(AVG(
    CASE priority
      WHEN 'P0' THEN 1
      WHEN 'P1' THEN 2
      WHEN 'P2' THEN 3
      WHEN 'P3' THEN 4
    END
  ), 2) AS avg_priority_score
FROM requests
GROUP BY category
ORDER BY avg_priority_score, total DESC;

-- Percentage of high-priority (P0, P1) requests by category
SELECT 
  category,
  COUNT(*) AS total,
  COUNT(CASE WHEN priority IN ('P0', 'P1') THEN 1 END) AS high_priority_count,
  ROUND(COUNT(CASE WHEN priority IN ('P0', 'P1') THEN 1 END) * 100.0 / COUNT(*), 2) AS high_priority_pct
FROM requests
GROUP BY category
ORDER BY high_priority_pct DESC;


-- =============================================================================
-- 4. CATEGORY PERFORMANCE METRICS
-- =============================================================================

-- Average resolution time by category
SELECT 
  category,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved_count,
  ROUND(AVG(
    CASE WHEN status = 'resolved' AND resolved_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
    END
  ), 2) AS avg_resolution_hours,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
  ) FILTER (WHERE status = 'resolved' AND resolved_at IS NOT NULL), 2) AS median_resolution_hours,
  ROUND(MIN(
    CASE WHEN status = 'resolved' AND resolved_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
    END
  ), 2) AS min_resolution_hours,
  ROUND(MAX(
    CASE WHEN status = 'resolved' AND resolved_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
    END
  ), 2) AS max_resolution_hours
FROM requests
GROUP BY category
ORDER BY avg_resolution_hours;

-- Category SLA compliance
WITH sla_by_category AS (
  SELECT 
    category,
    priority,
    EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 AS resolution_hours,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN 1
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN 1
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN 1
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN 1
      ELSE 0
    END AS met_sla
  FROM requests
  WHERE status = 'resolved' AND resolved_at IS NOT NULL
)
SELECT 
  category,
  COUNT(*) AS total_resolved,
  SUM(met_sla) AS met_sla_count,
  ROUND(SUM(met_sla) * 100.0 / COUNT(*), 2) AS sla_compliance_pct
FROM sla_by_category
GROUP BY category
ORDER BY sla_compliance_pct DESC;


-- =============================================================================
-- 5. CATEGORY WORKLOAD DISTRIBUTION
-- =============================================================================

-- Which agents handle which categories most
SELECT 
  u.name AS agent_name,
  r.category,
  COUNT(*) AS requests_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY u.name), 2) AS pct_of_agent_workload
FROM requests r
JOIN users u ON r.assigned_to = u.id
WHERE r.assigned_to IS NOT NULL
GROUP BY u.name, r.category
ORDER BY agent_name, requests_count DESC;

-- Category requests assignment rate (assigned vs unassigned)
SELECT 
  category,
  COUNT(*) AS total,
  COUNT(CASE WHEN assigned_to IS NOT NULL THEN 1 END) AS assigned,
  COUNT(CASE WHEN assigned_to IS NULL THEN 1 END) AS unassigned,
  ROUND(COUNT(CASE WHEN assigned_to IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 2) AS assignment_rate
FROM requests
GROUP BY category
ORDER BY assignment_rate DESC;


-- =============================================================================
-- 6. CATEGORY SEASONALITY & PATTERNS
-- =============================================================================

-- Requests by category and day of week
SELECT 
  TO_CHAR(created_at, 'Day') AS day_of_week,
  EXTRACT(DOW FROM created_at) AS day_number,
  category,
  COUNT(*) AS requests_count
FROM requests
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at), category
ORDER BY day_number, requests_count DESC;

-- Requests by category and hour of day (identify peak times)
SELECT 
  EXTRACT(HOUR FROM created_at) AS hour_of_day,
  category,
  COUNT(*) AS requests_count
FROM requests
GROUP BY EXTRACT(HOUR FROM created_at), category
ORDER BY hour_of_day, requests_count DESC;


-- =============================================================================
-- 7. EMERGING CATEGORIES (GROWTH ANALYSIS)
-- =============================================================================

-- Fastest growing categories (comparing recent vs. historical)
WITH period_comparison AS (
  SELECT 
    category,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS last_30_days,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '60 days' 
                AND created_at < CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS previous_30_days
  FROM requests
  WHERE created_at >= CURRENT_DATE - INTERVAL '60 days'
  GROUP BY category
)
SELECT 
  category,
  last_30_days,
  previous_30_days,
  last_30_days - previous_30_days AS absolute_growth,
  ROUND(
    (last_30_days - previous_30_days) * 100.0 / NULLIF(previous_30_days, 0),
    2
  ) AS growth_rate_pct
FROM period_comparison
WHERE previous_30_days > 0  -- Only categories that existed before
ORDER BY growth_rate_pct DESC;


-- =============================================================================
-- 8. CATEGORY TEXT ANALYSIS (FREQUENT KEYWORDS)
-- =============================================================================

-- Most common words in titles by category (requires text processing)
-- Note: This is a simplified version; for production use a proper text search
SELECT 
  category,
  LOWER(REGEXP_SPLIT_TO_TABLE(title, E'\\s+')) AS word,
  COUNT(*) AS frequency
FROM requests
WHERE LENGTH(REGEXP_SPLIT_TO_TABLE(title, E'\\s+')) > 3  -- Ignore short words
GROUP BY category, LOWER(REGEXP_SPLIT_TO_TABLE(title, E'\\s+'))
HAVING COUNT(*) >= 3  -- Only words appearing 3+ times
ORDER BY category, frequency DESC
LIMIT 100;


-- =============================================================================
-- 9. CATEGORY RECOMMENDATION (FOR NEW REQUESTS)
-- =============================================================================

-- Most common category by requester (for auto-suggestion)
SELECT 
  requested_by,
  category,
  COUNT(*) AS request_count,
  ROW_NUMBER() OVER (PARTITION BY requested_by ORDER BY COUNT(*) DESC) AS rank
FROM requests
GROUP BY requested_by, category
HAVING COUNT(*) >= 2  -- At least 2 requests in this category
ORDER BY requested_by, rank;


-- =============================================================================
-- 10. CATEGORY REPORTING SUMMARY
-- =============================================================================

-- Comprehensive category report (for executive summary)
WITH category_stats AS (
  SELECT 
    category,
    COUNT(*) AS total_requests,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
    AVG(
      CASE WHEN status = 'resolved' AND resolved_at IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
      END
    ) AS avg_resolution_hours,
    COUNT(CASE WHEN priority IN ('P0', 'P1') THEN 1 END) AS high_priority,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS last_30_days
  FROM requests
  GROUP BY category
),
sla_stats AS (
  SELECT 
    category,
    SUM(
      CASE 
        WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN 1
        WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN 1
        WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN 1
        WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN 1
        ELSE 0
      END
    ) * 100.0 / COUNT(*) AS sla_compliance_pct
  FROM requests
  WHERE status = 'resolved' AND resolved_at IS NOT NULL
  GROUP BY category
)
SELECT 
  cs.category,
  cs.total_requests,
  cs.resolved,
  cs.pending,
  ROUND(cs.resolved * 100.0 / cs.total_requests, 2) AS resolution_rate_pct,
  ROUND(cs.avg_resolution_hours, 2) AS avg_resolution_hours,
  cs.high_priority,
  ROUND(cs.high_priority * 100.0 / cs.total_requests, 2) AS high_priority_pct,
  cs.last_30_days,
  ROUND(sla.sla_compliance_pct, 2) AS sla_compliance_pct
FROM category_stats cs
LEFT JOIN sla_stats sla ON cs.category = sla.category
ORDER BY cs.total_requests DESC;


-- =============================================================================
-- NOTES:
-- - Add indexes on category, created_at, status for better performance
-- - Consider materialized views for complex aggregations
-- - Adjust time intervals based on analysis needs
-- - For text analysis, consider using full-text search or external tools
-- =============================================================================
