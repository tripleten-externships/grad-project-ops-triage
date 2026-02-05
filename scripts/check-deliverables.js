#!/usr/bin/env node

/**
 * check-deliverables.js - Validate discipline deliverables
 * 
 * Usage: node scripts/check-deliverables.js <discipline-name>
 * 
 * This script checks that expected files and directories exist
 * for a given discipline and provides a deliverables checklist.
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

// Deliverable status symbols
const PRESENT = `${colors.green}✓${colors.reset}`;
const MISSING = `${colors.red}✗${colors.reset}`;
const OPTIONAL = `${colors.yellow}⚠${colors.reset}`;

/**
 * Check if path exists
 */
function exists(filepath) {
  return fs.existsSync(filepath);
}

/**
 * Check if directory has files
 */
function hasFiles(dirpath) {
  if (!exists(dirpath)) return false;
  try {
    const files = fs.readdirSync(dirpath);
    return files.length > 0;
  } catch {
    return false;
  }
}

/**
 * Check deliverable and return result
 */
function checkDeliverable(basePath, item) {
  const fullPath = path.join(basePath, item.path);
  const itemExists = item.type === 'dir' ? exists(fullPath) : exists(fullPath);
  
  let status;
  let symbol;
  
  if (item.required) {
    if (itemExists) {
      status = 'present';
      symbol = PRESENT;
    } else {
      status = 'missing';
      symbol = MISSING;
    }
  } else {
    if (itemExists) {
      status = 'present';
      symbol = PRESENT;
    } else {
      status = 'optional';
      symbol = OPTIONAL;
    }
  }
  
  return { status, symbol, exists: itemExists };
}

/**
 * Define deliverables for each discipline
 */
const deliverables = {
  'ux-design': {
    name: 'UX Design',
    basePath: 'packages/ux-design',
    items: [
      { path: 'research/personas.md', type: 'file', required: true, desc: 'User personas documented' },
      { path: 'research/problem-framing.md', type: 'file', required: true, desc: 'Problem statement defined' },
      { path: 'research/pain-points.md', type: 'file', required: true, desc: 'User pain points identified' },
      { path: 'user-flows', type: 'dir', required: true, desc: 'User flows created' },
      { path: 'user-flows/submit-request-flow.mmd', type: 'file', required: true, desc: 'Submit request flow' },
      { path: 'user-flows/agent-triage-flow.mmd', type: 'file', required: true, desc: 'Agent triage flow' },
      { path: 'prototypes/figma-link.md', type: 'file', required: true, desc: 'Figma prototypes linked' },
      { path: 'design-system', type: 'dir', required: true, desc: 'Design system documented' },
      { path: 'accessibility/a11y-guidelines.md', type: 'file', required: true, desc: 'Accessibility guidelines' },
      { path: 'docs/DESIGN-DECISIONS.md', type: 'file', required: false, desc: 'Design decisions documented' },
    ],
  },
  
  'frontend': {
    name: 'Frontend Development',
    basePath: 'packages/frontend',
    items: [
      { path: 'src/App.tsx', type: 'file', required: true, desc: 'Main application component' },
      { path: 'src/pages/intake/IntakePage.tsx', type: 'file', required: true, desc: 'Request intake page' },
      { path: 'src/pages/triage/TriagePage.tsx', type: 'file', required: true, desc: 'Triage dashboard page' },
      { path: 'src/pages/insights/InsightsPage.tsx', type: 'file', required: true, desc: 'Manager insights page' },
      { path: 'src/components', type: 'dir', required: true, desc: 'UI components created' },
      { path: 'src/services/api.ts', type: 'file', required: true, desc: 'API service integration' },
      { path: 'src/types.ts', type: 'file', required: true, desc: 'TypeScript types defined' },
      { path: 'docs/ARCHITECTURE.md', type: 'file', required: true, desc: 'Architecture documented' },
      { path: 'docs/INTEGRATION.md', type: 'file', required: true, desc: 'Integration guide' },
      { path: '.env', type: 'file', required: false, desc: 'Environment configured' },
    ],
  },
  
  'backend': {
    name: 'Backend Development',
    basePath: 'packages/backend',
    items: [
      { path: 'src/server.ts', type: 'file', required: true, desc: 'Server implemented' },
      { path: 'src/models/Request.ts', type: 'file', required: true, desc: 'Request model defined' },
      { path: 'src/models/User.ts', type: 'file', required: true, desc: 'User model defined' },
      { path: 'src/routes', type: 'dir', required: true, desc: 'API routes implemented' },
      { path: 'src/controllers', type: 'dir', required: true, desc: 'Controllers created' },
      { path: 'src/middleware', type: 'dir', required: true, desc: 'Middleware implemented' },
      { path: 'src/services', type: 'dir', required: true, desc: 'Business logic services' },
      { path: 'docs/API.md', type: 'file', required: true, desc: 'API documentation' },
      { path: 'docs/ARCHITECTURE.md', type: 'file', required: true, desc: 'Architecture documented' },
      { path: '.env', type: 'file', required: false, desc: 'Environment configured' },
      { path: 'Dockerfile', type: 'file', required: false, desc: 'Docker configuration' },
    ],
  },
  
  'data-science': {
    name: 'Data Science',
    basePath: 'packages/data-science',
    items: [
      { path: 'notebooks/01-eda.ipynb', type: 'file', required: true, desc: 'Exploratory data analysis' },
      { path: 'notebooks/02-feature-engineering.ipynb', type: 'file', required: true, desc: 'Feature engineering' },
      { path: 'notebooks/03-model-training.ipynb', type: 'file', required: true, desc: 'Model training' },
      { path: 'notebooks/04-model-evaluation.ipynb', type: 'file', required: true, desc: 'Model evaluation' },
      { path: 'src/models/train_model.py', type: 'file', required: true, desc: 'Training script' },
      { path: 'src/models/predict.py', type: 'file', required: true, desc: 'Prediction script' },
      { path: 'api/app.py', type: 'file', required: true, desc: 'Prediction API' },
      { path: 'docs/MODEL-CARD.md', type: 'file', required: true, desc: 'Model card documented' },
      { path: 'docs/INTEGRATION.md', type: 'file', required: true, desc: 'Integration guide' },
      { path: 'requirements.txt', type: 'file', required: true, desc: 'Dependencies listed' },
      { path: '.env', type: 'file', required: false, desc: 'Environment configured' },
    ],
  },
  
  'ai-automation': {
    name: 'AI Automation',
    basePath: 'packages/ai-automation',
    items: [
      { path: 'prompts/categorize-request.txt', type: 'file', required: true, desc: 'Categorization prompt' },
      { path: 'prompts/assign-priority.txt', type: 'file', required: true, desc: 'Priority assignment prompt' },
      { path: 'prompts/summarize-request.txt', type: 'file', required: true, desc: 'Summarization prompt' },
      { path: 'prompts/guardrails.md', type: 'file', required: true, desc: 'Safety guardrails defined' },
      { path: 'workflows/triage-automation.yml', type: 'file', required: true, desc: 'Automation workflow' },
      { path: 'src/automation.ts', type: 'file', required: true, desc: 'Automation logic' },
      { path: 'src/llm-client.ts', type: 'file', required: true, desc: 'LLM client implemented' },
      { path: 'config/confidence-thresholds.json', type: 'file', required: true, desc: 'Confidence thresholds' },
      { path: 'docs/WORKFLOW.md', type: 'file', required: true, desc: 'Workflow documented' },
      { path: 'docs/INTEGRATION.md', type: 'file', required: true, desc: 'Integration guide' },
      { path: '.env', type: 'file', required: false, desc: 'API keys configured' },
    ],
  },
  
  'qa': {
    name: 'Quality Assurance',
    basePath: 'packages/qa',
    items: [
      { path: 'test-strategy/TEST-STRATEGY.md', type: 'file', required: true, desc: 'Test strategy documented' },
      { path: 'test-cases', type: 'dir', required: true, desc: 'Test cases documented' },
      { path: 'e2e-tests/tests', type: 'dir', required: true, desc: 'E2E tests implemented' },
      { path: 'e2e-tests/tests/submit-flow.spec.ts', type: 'file', required: true, desc: 'Submit flow test' },
      { path: 'api-tests', type: 'dir', required: true, desc: 'API tests created' },
      { path: 'docs/TEST-GUIDE.md', type: 'file', required: true, desc: 'Test guide documented' },
      { path: 'docs/BUG-TEMPLATE.md', type: 'file', required: true, desc: 'Bug template created' },
      { path: 'playwright.config.ts', type: 'file', required: true, desc: 'Playwright configured' },
      { path: 'e2e-tests/fixtures', type: 'dir', required: false, desc: 'Test fixtures available' },
    ],
  },
  
  'security': {
    name: 'Security Analysis',
    basePath: 'packages/security',
    items: [
      { path: 'threat-model/STRIDE-analysis.md', type: 'file', required: true, desc: 'STRIDE analysis completed' },
      { path: 'threat-model/attack-vectors.md', type: 'file', required: true, desc: 'Attack vectors identified' },
      { path: 'policies/auth-policy.md', type: 'file', required: true, desc: 'Auth policy documented' },
      { path: 'checklists/owasp-top-10.md', type: 'file', required: true, desc: 'OWASP checklist completed' },
      { path: 'docs/SECURITY-SUMMARY.md', type: 'file', required: true, desc: 'Security summary written' },
    ],
  },
  
  'bia': {
    name: 'Business Intelligence & Analytics',
    basePath: 'packages/bia',
    items: [
      { path: 'queries/volume-metrics.sql', type: 'file', required: true, desc: 'Volume metrics query' },
      { path: 'queries/sla-metrics.sql', type: 'file', required: true, desc: 'SLA metrics query' },
      { path: 'queries/category-analysis.sql', type: 'file', required: true, desc: 'Category analysis query' },
      { path: 'dashboards', type: 'dir', required: true, desc: 'Dashboard created' },
      { path: 'docs/METRIC-DEFINITIONS.md', type: 'file', required: true, desc: 'Metrics defined' },
      { path: 'docs/DASHBOARD-GUIDE.md', type: 'file', required: true, desc: 'Dashboard guide' },
      { path: 'docs/INSIGHTS-MEMO.md', type: 'file', required: true, desc: 'Insights documented' },
      { path: 'data/load-seed-data.js', type: 'file', required: false, desc: 'Data loading script' },
    ],
  },
};

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`${colors.red}Error: Discipline name required${colors.reset}`);
    console.log('');
    console.log('Usage: node scripts/check-deliverables.js <discipline-name>');
    console.log('');
    console.log('Available disciplines:');
    Object.keys(deliverables).forEach(d => {
      console.log(`  - ${d}`);
    });
    process.exit(1);
  }
  
  const discipline = args[0];
  const config = deliverables[discipline];
  
  if (!config) {
    console.log(`${colors.red}Error: Invalid discipline: ${discipline}${colors.reset}`);
    console.log('');
    console.log('Available disciplines:');
    Object.keys(deliverables).forEach(d => {
      console.log(`  - ${d}`);
    });
    process.exit(1);
  }
  
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}  Deliverables Check: ${config.name}${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log('');
  
  // Check all deliverables
  let totalRequired = 0;
  let presentRequired = 0;
  let totalOptional = 0;
  let presentOptional = 0;
  const missingRequired = [];
  
  config.items.forEach(item => {
    const result = checkDeliverable(config.basePath, item);
    
    if (item.required) {
      totalRequired++;
      if (result.exists) presentRequired++;
      else missingRequired.push(item);
    } else {
      totalOptional++;
      if (result.exists) presentOptional++;
    }
    
    console.log(`${result.symbol} ${item.desc}`);
  });
  
  console.log('');
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.cyan}  Summary${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log('');
  
  const requiredScore = totalRequired > 0 ? Math.round((presentRequired / totalRequired) * 100) : 100;
  const optionalScore = totalOptional > 0 ? Math.round((presentOptional / totalOptional) * 100) : 100;
  
  console.log(`Required Deliverables: ${presentRequired}/${totalRequired} (${requiredScore}%)`);
  console.log(`Optional Deliverables: ${presentOptional}/${totalOptional} (${optionalScore}%)`);
  console.log('');
  
  if (missingRequired.length > 0) {
    console.log(`${colors.yellow}Missing Required Items:${colors.reset}`);
    missingRequired.forEach(item => {
      console.log(`  ${MISSING} ${item.desc}`);
      console.log(`     Path: ${config.basePath}/${item.path}`);
    });
    console.log('');
  }
  
  // Overall status
  if (presentRequired === totalRequired) {
    console.log(`${colors.green}✓ All required deliverables are present!${colors.reset}`);
    console.log('');
    
    if (presentOptional < totalOptional) {
      console.log(`${colors.yellow}⚠ Consider completing optional deliverables:${colors.reset}`);
      config.items.forEach(item => {
        if (!item.required) {
          const result = checkDeliverable(config.basePath, item);
          if (!result.exists) {
            console.log(`  - ${item.desc}`);
          }
        }
      });
      console.log('');
    }
    
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Missing ${missingRequired.length} required deliverable(s)${colors.reset}`);
    console.log('');
    console.log('Please complete the missing items above.');
    console.log('');
    process.exit(1);
  }
}

// Run check
main();
