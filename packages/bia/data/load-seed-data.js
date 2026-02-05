/**
 * Load seed data from contracts/mock-data into your analytics tool.
 *
 * This script demonstrates how to:
 * 1. Read CSV/JSON data
 * 2. Transform for analytics
 * 3. Load into database or BI tool
 *
 * Usage:
 *   node load-seed-data.js
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // TODO: npm install csv-parser

// Paths to mock data
const CONTRACTS_DIR = path.join(__dirname, '../../../contracts/mock-data');
const REQUESTS_CSV = path.join(CONTRACTS_DIR, 'requests.csv');
const REQUESTS_JSON = path.join(CONTRACTS_DIR, 'requests.json');
const USERS_JSON = path.join(CONTRACTS_DIR, 'users.json');

/**
 * Load requests from CSV
 */
async function loadRequestsFromCSV() {
  return new Promise((resolve, reject) => {
    const requests = [];

    fs.createReadStream(REQUESTS_CSV)
      .pipe(csv())
      .on('data', (row) => {
        requests.push(row);
      })
      .on('end', () => {
        console.log(`Loaded ${requests.length} requests from CSV`);
        resolve(requests);
      })
      .on('error', reject);
  });
}

/**
 * Load requests from JSON
 */
function loadRequestsFromJSON() {
  const data = fs.readFileSync(REQUESTS_JSON, 'utf-8');
  const requests = JSON.parse(data);
  console.log(`Loaded ${requests.length} requests from JSON`);
  return requests;
}

/**
 * Load users from JSON
 */
function loadUsers() {
  const data = fs.readFileSync(USERS_JSON, 'utf-8');
  const users = JSON.parse(data);
  console.log(`Loaded ${users.length} users from JSON`);
  return users;
}

/**
 * Transform data for analytics
 */
function transformForAnalytics(requests) {
  return requests.map((req) => {
    // Parse dates
    const createdAt = new Date(req.createdAt);
    const _updatedAt = req.updatedAt ? new Date(req.updatedAt) : null;
    const resolvedAt = req.resolvedAt ? new Date(req.resolvedAt) : null;

    // Calculate resolution time in hours
    let resolutionTimeHours = null;
    if (resolvedAt && createdAt) {
      resolutionTimeHours = (resolvedAt - createdAt) / (1000 * 60 * 60);
    }

    // Extract date parts for time-based analysis
    const createdDate = createdAt.toISOString().split('T')[0];
    const createdHour = createdAt.getHours();
    const dayOfWeek = createdAt.getDay(); // 0 = Sunday
    const weekOfYear = getWeekNumber(createdAt);
    const monthYear = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;

    return {
      ...req,
      createdDate,
      createdHour,
      dayOfWeek,
      weekOfYear,
      monthYear,
      resolutionTimeHours,
      isResolved: req.status === 'resolved',
      // TODO: Add SLA calculation based on business rules
      // resolvedWithinSLA: ...
    };
  });
}

/**
 * Get ISO week number
 */
function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * TODO: Load into your database
 * Examples for different databases:
 */

// PostgreSQL example
async function _loadToPostgreSQL(_records) {
  // const { Pool } = require('pg');
  // const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  //
  // for (const record of records) {
  //   await pool.query(
  //     `INSERT INTO requests (id, title, description, category, priority, status, created_at, ...)
  //      VALUES ($1, $2, $3, $4, $5, $6, $7, ...)`,
  //     [record.id, record.title, ...]
  //   );
  // }
  //
  // await pool.end();
  console.log('TODO: Implement PostgreSQL loading');
}

// MySQL example
async function _loadToMySQL(_records) {
  // const mysql = require('mysql2/promise');
  // const connection = await mysql.createConnection({
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME
  // });
  //
  // for (const record of records) {
  //   await connection.execute(
  //     `INSERT INTO requests (id, title, ...) VALUES (?, ?, ...)`,
  //     [record.id, record.title, ...]
  //   );
  // }
  //
  // await connection.end();
  console.log('TODO: Implement MySQL loading');
}

// CSV export for Excel/Google Sheets
function exportToCSV(records, outputPath) {
  const headers = Object.keys(records[0]).join(',');
  const rows = records.map((record) =>
    Object.values(record)
      .map((v) => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v))
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  fs.writeFileSync(outputPath, csvContent);
  console.log(`Exported ${records.length} records to ${outputPath}`);
}

/**
 * Main function
 */
async function main() {
  console.log('Loading seed data for BIA analysis...\n');

  try {
    // Load data (choose CSV or JSON)
    const requests = await loadRequestsFromCSV();
    // OR: const requests = loadRequestsFromJSON();

    const _users = loadUsers();

    // Transform for analytics
    console.log('\nTransforming data...');
    const analyticsData = transformForAnalytics(requests);

    // Display sample analytics
    console.log('\n=== Sample Analytics ===');
    console.log(`Total Requests: ${analyticsData.length}`);
    console.log(
      `Resolved: ${analyticsData.filter((r) => r.isResolved).length}`
    );

    const avgResolutionTime =
      analyticsData
        .filter((r) => r.resolutionTimeHours !== null)
        .reduce((sum, r) => sum + r.resolutionTimeHours, 0) /
      analyticsData.filter((r) => r.resolutionTimeHours !== null).length;
    console.log(`Avg Resolution Time: ${avgResolutionTime.toFixed(2)} hours`);

    // Category breakdown
    const byCategory = {};
    analyticsData.forEach((r) => {
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    });
    console.log('\nBy Category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    // Export options
    console.log('\n=== Export Options ===');

    // 1. Export to CSV for Excel/Sheets
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    exportToCSV(analyticsData, path.join(outputDir, 'analytics_data.csv'));

    // 2. TODO: Load to database
    // await loadToPostgreSQL(analyticsData);
    // await loadToMySQL(analyticsData);

    console.log('\nData loading complete!');
    console.log('Next steps:');
    console.log('1. Import output/analytics_data.csv into your BI tool');
    console.log('2. OR: Uncomment database loading code');
    console.log('3. Build dashboards using queries/ templates');
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  loadRequestsFromCSV,
  loadRequestsFromJSON,
  transformForAnalytics,
};
