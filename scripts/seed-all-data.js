#!/usr/bin/env node

/**
 * seed-all-data.js - Seed data distribution script
 *
 * This script:
 * - Reads mock data from contracts/mock-data/
 * - Displays summary of data being seeded
 * - Provides instructions for each discipline
 * - Creates fixture files for QA tests
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
const error = (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`);
const success = (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`);
const info = (msg) => console.log(`${colors.blue}➜${colors.reset} ${msg}`);
const section = (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`);

/**
 * Read JSON file
 */
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to read ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * Write JSON file
 */
function writeJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    error(`Failed to write ${filePath}: ${err.message}`);
    return false;
  }
}

/**
 * Main seeding function
 */
function main() {
  console.log(
    `${colors.blue}========================================${colors.reset}`
  );
  console.log(`${colors.blue}  Data Seeding Distribution${colors.reset}`);
  console.log(
    `${colors.blue}========================================${colors.reset}`
  );
  console.log('');

  // Read mock data
  const requestsPath = path.join(
    __dirname,
    '../contracts/mock-data/requests.json'
  );
  const usersPath = path.join(__dirname, '../contracts/mock-data/users.json');

  const requests = readJSON(requestsPath);
  const users = readJSON(usersPath);

  if (!requests || !users) {
    error('Failed to read mock data files');
    process.exit(1);
  }

  // Display summary
  section('📊 Data Summary');
  console.log('');
  console.log(`  Requests: ${requests.length} records`);
  console.log(`  Users:    ${users.length} records`);
  console.log('');

  // Analyze requests
  const statusCounts = {};
  const priorityCounts = {};
  const categoryCounts = {};

  requests.forEach((req) => {
    statusCounts[req.status] = (statusCounts[req.status] || 0) + 1;
    priorityCounts[req.priority] = (priorityCounts[req.priority] || 0) + 1;
    categoryCounts[req.category] = (categoryCounts[req.category] || 0) + 1;
  });

  console.log('  Request Breakdown:');
  console.log(
    `    By Status:   ${Object.entries(statusCounts)
      .map(([k, v]) => `${k}(${v})`)
      .join(', ')}`
  );
  console.log(
    `    By Priority: ${Object.entries(priorityCounts)
      .map(([k, v]) => `${k}(${v})`)
      .join(', ')}`
  );
  console.log(
    `    By Category: ${Object.entries(categoryCounts)
      .map(([k, v]) => `${k}(${v})`)
      .join(', ')}`
  );
  console.log('');

  // Analyze users
  const roleCounts = {};
  users.forEach((user) => {
    roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
  });

  console.log('  User Breakdown:');
  console.log(
    `    By Role: ${Object.entries(roleCounts)
      .map(([k, v]) => `${k}(${v})`)
      .join(', ')}`
  );
  console.log('');

  // Create QA fixtures
  section('🧪 Creating QA Test Fixtures');
  console.log('');

  const fixturesDir = path.join(__dirname, '../packages/qa/e2e-tests/fixtures');

  // Create fixtures for different test scenarios
  const fixtures = {
    'requests-all.json': requests,
    'users-all.json': users,
    'requests-pending.json': requests.filter((r) => r.status === 'pending'),
    'requests-in-progress.json': requests.filter(
      (r) => r.status === 'in-progress'
    ),
    'requests-high-priority.json': requests.filter(
      (r) => r.priority === 'high'
    ),
    'users-agents.json': users.filter((u) => u.role === 'agent'),
    'users-customers.json': users.filter((u) => u.role === 'customer'),
  };

  let fixturesCreated = 0;
  Object.entries(fixtures).forEach(([filename, data]) => {
    const fixturePath = path.join(fixturesDir, filename);
    if (writeJSON(fixturePath, data)) {
      success(`Created ${filename} (${data.length} records)`);
      fixturesCreated++;
    }
  });

  console.log('');
  success(
    `Created ${fixturesCreated} fixture files in packages/qa/e2e-tests/fixtures/`
  );
  console.log('');

  // Instructions for Backend team
  section('🔧 Backend Team - MongoDB Seeding');
  console.log('');
  info('Use the seed-database.ts utility:');
  console.log('');
  console.log('  1. Start MongoDB:');
  console.log('     docker-compose up -d');
  console.log('');
  console.log('  2. Run seed script:');
  console.log('     cd packages/backend');
  console.log('     npx ts-node src/utils/seed-database.ts');
  console.log('');
  console.log('  The script will:');
  console.log('    - Connect to MongoDB');
  console.log('    - Clear existing data');
  console.log('    - Insert users and requests from contracts/mock-data/');
  console.log('    - Create indexes');
  console.log('');

  // Instructions for BIA team
  section('📊 BIA Team - Data Loading');
  console.log('');
  info('Load data into your BI tool:');
  console.log('');
  console.log('  CSV Data: contracts/mock-data/requests.csv');
  console.log('  JSON Data: contracts/mock-data/requests.json, users.json');
  console.log('');
  console.log('  Or use the load-seed-data.js script:');
  console.log('     node packages/bia/data/load-seed-data.js');
  console.log('');
  console.log('  This will:');
  console.log('    - Convert JSON to CSV format');
  console.log('    - Generate sample SQL INSERT statements');
  console.log('    - Provide import instructions for your chosen BI tool');
  console.log('');

  // Instructions for Data Science team
  section('🔬 Data Science Team - Notebook Data');
  console.log('');
  info('Load data in your Jupyter notebooks:');
  console.log('');
  console.log('  Python code to load data:');
  console.log('');
  console.log('    import json');
  console.log('    import pandas as pd');
  console.log('');
  console.log('    # Load requests');
  console.log('    with open("../../contracts/mock-data/requests.json") as f:');
  console.log('        requests = json.load(f)');
  console.log('    df_requests = pd.DataFrame(requests)');
  console.log('');
  console.log('    # Load users');
  console.log('    with open("../../contracts/mock-data/users.json") as f:');
  console.log('        users = json.load(f)');
  console.log('    df_users = pd.DataFrame(users)');
  console.log('');
  console.log('  See notebooks/01-eda.ipynb for examples');
  console.log('');

  // Instructions for Frontend team
  section('💻 Frontend Team - Mock API Data');
  console.log('');
  info('Mock data is available via the mock API service:');
  console.log('');
  console.log('  The frontend uses src/services/mock-api.ts which:');
  console.log('    - Loads data from contracts/mock-data/');
  console.log('    - Simulates API responses');
  console.log('    - Supports CRUD operations in-memory');
  console.log('');
  console.log('  To switch to real backend API:');
  console.log('    - Update VITE_API_URL in .env');
  console.log('    - Use src/services/api.ts instead of mock-api.ts');
  console.log('');

  // Instructions for QA team
  section('🧪 QA Team - Test Fixtures');
  console.log('');
  success('Test fixtures have been created!');
  console.log('');
  info('Fixtures location: packages/qa/e2e-tests/fixtures/');
  console.log('');
  console.log('  Use in your tests:');
  console.log('');
  console.log('    import requests from "../fixtures/requests-all.json";');
  console.log('    import users from "../fixtures/users-agents.json";');
  console.log('');
  console.log('  Available fixtures:');
  Object.keys(fixtures).forEach((filename) => {
    console.log(`    - ${filename}`);
  });
  console.log('');

  // Summary
  console.log(
    `${colors.blue}========================================${colors.reset}`
  );
  console.log(`${colors.green}  Seeding Complete! ✓${colors.reset}`);
  console.log(
    `${colors.blue}========================================${colors.reset}`
  );
  console.log('');
  success('Mock data is ready for all disciplines');
  console.log('');
  info('Each discipline should follow their specific instructions above');
  console.log('');
}

// Run seeding
main();
