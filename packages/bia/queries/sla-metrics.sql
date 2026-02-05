-- SLA Metrics Queries
-- Request Management System - BIA Package
--
-- Queries to calculate SLA compliance and resolution time metrics.
-- SLA targets defined in contracts/data-models/priority-definitions.md

-- =============================================================================
-- SLA TARGETS (Reference)
-- =============================================================================
-- P0 (Critical): 4 hours
-- P1 (High): 24 hours
-- P2 (Medium): 72 hours (3 days)
-- P3 (Low): 168 hours (7 days)


-- =============================================================================
-- 1. RESOLUTION TIME CALCULATIONS
-- =============================================================================

-- Average resolution time by priority
SELECT 
  priority,
  COUNT(*) AS resolved_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2) AS avg_hours,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2) AS median_hours,
  ROUND(MIN(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2) AS min_hours,
  ROUND(MAX(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2) AS max_hours
FROM requests
WHERE status = 'resolved'
  AND resolved_at IS NOT NULL
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'P0' THEN 1
    WHEN 'P1' THEN 2
    WHEN 'P2' THEN 3
    WHEN 'P3' THEN 4
  END;

-- Average resolution time by category
SELECT 
  category,
  COUNT(*) AS resolved_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2) AS avg_hours,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2) AS median_hours
FROM requests
WHERE status = 'resolved'
  AND resolved_at IS NOT NULL
GROUP BY category
ORDER BY avg_hours;


-- =============================================================================
-- 2. SLA COMPLIANCE CALCULATIONS
-- =============================================================================

-- Overall SLA compliance rate
WITH sla_check AS (
  SELECT 
    id,
    priority,
    EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 AS resolution_hours,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN TRUE
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN TRUE
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN TRUE
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN TRUE
      ELSE FALSE
    END AS met_sla
  FROM requests
  WHERE status = 'resolved'
    AND resolved_at IS NOT NULL
)
SELECT 
  COUNT(*) AS total_resolved,
  SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) AS met_sla_count,
  SUM(CASE WHEN NOT met_sla THEN 1 ELSE 0 END) AS missed_sla_count,
  ROUND(SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS sla_compliance_pct
FROM sla_check;

-- SLA compliance by priority
WITH sla_check AS (
  SELECT 
    priority,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN TRUE
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN TRUE
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN TRUE
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN TRUE
      ELSE FALSE
    END AS met_sla
  FROM requests
  WHERE status = 'resolved'
    AND resolved_at IS NOT NULL
)
SELECT 
  priority,
  COUNT(*) AS total,
  SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) AS met_sla,
  SUM(CASE WHEN NOT met_sla THEN 1 ELSE 0 END) AS missed_sla,
  ROUND(SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS compliance_pct
FROM sla_check
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'P0' THEN 1
    WHEN 'P1' THEN 2
    WHEN 'P2' THEN 3
    WHEN 'P3' THEN 4
  END;

-- SLA compliance by category
WITH sla_check AS (
  SELECT 
    category,
    priority,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN TRUE
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN TRUE
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN TRUE
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN TRUE
      ELSE FALSE
    END AS met_sla
  FROM requests
  WHERE status = 'resolved'
    AND resolved_at IS NOT NULL
)
SELECT 
  category,
  COUNT(*) AS total,
  SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) AS met_sla,
  ROUND(SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS compliance_pct
FROM sla_check
GROUP BY category
ORDER BY compliance_pct DESC;


-- =============================================================================
-- 3. SLA COMPLIANCE OVER TIME
-- =============================================================================

-- Daily SLA compliance (last 30 days)
WITH sla_check AS (
  SELECT 
    DATE(resolved_at) AS resolved_date,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN TRUE
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN TRUE
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN TRUE
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN TRUE
      ELSE FALSE
    END AS met_sla
  FROM requests
  WHERE status = 'resolved'
    AND resolved_at IS NOT NULL
    AND resolved_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
  resolved_date,
  COUNT(*) AS total_resolved,
  SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) AS met_sla,
  ROUND(SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS compliance_pct
FROM sla_check
GROUP BY resolved_date
ORDER BY resolved_date;

-- Weekly SLA compliance trend
WITH sla_check AS (
  SELECT 
    DATE_TRUNC('week', resolved_at) AS week_start,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN TRUE
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN TRUE
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN TRUE
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN TRUE
      ELSE FALSE
    END AS met_sla
  FROM requests
  WHERE status = 'resolved'
    AND resolved_at IS NOT NULL
    AND resolved_at >= CURRENT_DATE - INTERVAL '12 weeks'
)
SELECT 
  week_start,
  COUNT(*) AS total_resolved,
  SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) AS met_sla,
  ROUND(SUM(CASE WHEN met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS compliance_pct
FROM sla_check
GROUP BY week_start
ORDER BY week_start;


-- =============================================================================
-- 4. SLA VIOLATIONS (MISSED SLA)
-- =============================================================================

-- Requests that missed SLA
SELECT 
  id,
  title,
  category,
  priority,
  created_at,
  resolved_at,
  ROUND(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600, 2) AS resolution_hours,
  CASE priority
    WHEN 'P0' THEN 4
    WHEN 'P1' THEN 24
    WHEN 'P2' THEN 72
    WHEN 'P3' THEN 168
  END AS sla_target_hours,
  ROUND(
    EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 - 
    CASE priority
      WHEN 'P0' THEN 4
      WHEN 'P1' THEN 24
      WHEN 'P2' THEN 72
      WHEN 'P3' THEN 168
    END,
    2
  ) AS hours_over_sla
FROM requests
WHERE status = 'resolved'
  AND resolved_at IS NOT NULL
  AND (
    (priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 > 4) OR
    (priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 > 24) OR
    (priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 > 72) OR
    (priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 > 168)
  )
ORDER BY hours_over_sla DESC;


-- =============================================================================
-- 5. AT-RISK REQUESTS (Currently open, approaching SLA)
-- =============================================================================

-- Open requests approaching SLA deadline
WITH current_age AS (
  SELECT 
    id,
    title,
    category,
    priority,
    created_at,
    assigned_to,
    EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 AS age_hours,
    CASE priority
      WHEN 'P0' THEN 4
      WHEN 'P1' THEN 24
      WHEN 'P2' THEN 72
      WHEN 'P3' THEN 168
    END AS sla_target_hours
  FROM requests
  WHERE status IN ('pending', 'in_progress')
)
SELECT 
  id,
  title,
  category,
  priority,
  assigned_to,
  created_at,
  ROUND(age_hours, 2) AS age_hours,
  sla_target_hours,
  ROUND(sla_target_hours - age_hours, 2) AS hours_remaining,
  ROUND((age_hours / sla_target_hours) * 100, 2) AS sla_utilization_pct
FROM current_age
WHERE age_hours >= (sla_target_hours * 0.75)  -- At 75% of SLA or more
ORDER BY hours_remaining;


-- =============================================================================
-- 6. AGENT SLA PERFORMANCE
-- =============================================================================

-- SLA compliance rate by agent
WITH sla_check AS (
  SELECT 
    assigned_to,
    CASE 
      WHEN priority = 'P0' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 4 THEN TRUE
      WHEN priority = 'P1' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 24 THEN TRUE
      WHEN priority = 'P2' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 72 THEN TRUE
      WHEN priority = 'P3' AND EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600 <= 168 THEN TRUE
      ELSE FALSE
    END AS met_sla
  FROM requests
  WHERE status = 'resolved'
    AND resolved_at IS NOT NULL
    AND assigned_to IS NOT NULL
)
SELECT 
  u.name AS agent_name,
  COUNT(*) AS total_resolved,
  SUM(CASE WHEN s.met_sla THEN 1 ELSE 0 END) AS met_sla,
  ROUND(SUM(CASE WHEN s.met_sla THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS compliance_pct
FROM sla_check s
JOIN users u ON s.assigned_to = u.id
GROUP BY u.name
HAVING COUNT(*) >= 5  -- Only agents with at least 5 resolved requests
ORDER BY compliance_pct DESC;


-- =============================================================================
-- NOTES:
-- - Adjust SLA targets if business rules change
-- - Consider business hours vs. calendar hours for SLA calculation
-- - Add created_at, resolved_at, priority indexes for performance
-- - Use WHERE clauses to filter by date range as needed
-- =============================================================================
