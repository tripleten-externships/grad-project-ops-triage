#!/usr/bin/env node

/**
 * Mock Data Generator for Support Requests
 *
 * Generates realistic seed data for testing and development.
 * Usage: node data-generator.js [count] [--output=file.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_COUNT = 50;
const OUTPUT_FILE = 'requests-generated.json';

// Data dictionaries
const categories = ['technical', 'account', 'billing', 'general'];
const _priorities = ['P0', 'P1', 'P2', 'P3'];
const statuses = [
  'new',
  'triaged',
  'in_progress',
  'waiting',
  'resolved',
  'closed',
];
const requesterTypes = ['free', 'paid', 'enterprise', 'internal'];
const channels = ['email', 'chat', 'phone', 'web_form', 'api'];
const _resolutionCodes = [
  'solved',
  'workaround',
  'duplicate',
  'wont_fix',
  'spam',
  null,
];

const agents = [
  'agent-001',
  'agent-002',
  'agent-003',
  'agent-004',
  'agent-005',
  'agent-006',
];

// Title templates by category
const titleTemplates = {
  technical: [
    'Cannot {action} {feature}',
    '{feature} not working',
    'Error when {action}',
    'Slow performance in {feature}',
    '{feature} crashes on {platform}',
    'Integration with {service} failing',
    'API {issue} errors',
    'Database connection {issue}',
    '{feature} timeout errors',
  ],
  account: [
    'Update {field} on account',
    'Cannot {action} team members',
    'User permissions not {state}',
    'Need to {action} subscription',
    'Delete my account and data',
    'Forgot {credential}',
    'Change {setting} settings',
    'Account {issue} issue',
  ],
  billing: [
    'Payment {issue}',
    '{issue} charge on credit card',
    'Invoice {action} for last month',
    'Billing cycle {action} request',
    'Refund request for {reason}',
    'Promo code not {state}',
    'Subscription {action} failed',
    'Need invoice with {requirement}',
  ],
  general: [
    'How to {action}',
    'Feature request: {feature}',
    'Request documentation for {topic}',
    'Question about {topic}',
    'Need training for {purpose}',
    'Request access to {feature}',
    'Feedback on {feature}',
    'Suggestion: {feature}',
  ],
};

// Value substitutions
const substitutions = {
  action: [
    'access',
    'login',
    'export',
    'import',
    'update',
    'change',
    'add',
    'remove',
    'configure',
  ],
  feature: [
    'dashboard',
    'reports',
    'analytics',
    'API',
    'mobile app',
    'notifications',
    'webhooks',
    'workflows',
  ],
  platform: [
    'iOS',
    'Android',
    'Chrome',
    'Firefox',
    'Safari',
    'Windows',
    'macOS',
    'Linux',
  ],
  service: [
    'Salesforce',
    'Slack',
    'Google Sheets',
    'Zapier',
    'HubSpot',
    'Jira',
    'GitHub',
  ],
  issue: [
    'failed',
    'timeout',
    'rate limit',
    'connection',
    'authentication',
    'authorization',
  ],
  field: ['email address', 'name', 'timezone', 'language', 'phone number'],
  state: ['applying', 'working', 'loading', 'syncing', 'enabled'],
  credential: ['password', 'username', 'API key', '2FA device'],
  setting: ['notification', 'privacy', 'security', 'team', 'billing'],
  reason: [
    'unused subscription',
    'duplicate charge',
    'cancellation',
    'service issue',
  ],
  requirement: ['VAT number', 'tax ID', 'PO number', 'billing address'],
  topic: [
    'pricing',
    'features',
    'API',
    'security',
    'compliance',
    'integrations',
  ],
  purpose: ['new team members', 'onboarding', 'advanced features', 'API usage'],
};

// Tag pools by category
const tagPools = {
  technical: [
    'bug',
    'performance',
    'api',
    'integration',
    'mobile',
    'web',
    'crash',
    'error',
    'timeout',
    'authentication',
    'authorization',
  ],
  account: [
    'account-management',
    'permissions',
    'team',
    'user',
    'subscription',
    'profile',
    'settings',
    'privacy',
  ],
  billing: [
    'payment',
    'invoice',
    'refund',
    'subscription',
    'pricing',
    'discount',
    'promo-code',
    'tax',
    'vat',
  ],
  general: [
    'how-to',
    'feature-request',
    'documentation',
    'training',
    'feedback',
    'question',
    'sales',
  ],
};

/**
 * Generate a random element from an array
 */
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate multiple random unique elements from an array
 */
function randomChoices(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Substitute placeholders in a template string
 */
function fillTemplate(template) {
  let result = template;
  const placeholders = template.match(/\{(\w+)\}/g);

  if (placeholders) {
    placeholders.forEach((placeholder) => {
      const key = placeholder.slice(1, -1); // Remove { }
      if (substitutions[key]) {
        const value = randomChoice(substitutions[key]);
        result = result.replace(placeholder, value);
      }
    });
  }

  return result;
}

/**
 * Generate a realistic description based on category
 */
function generateDescription(category, title) {
  const intros = [
    "I'm experiencing an issue where",
    'For the past few hours,',
    'Since this morning,',
    "I've noticed that",
    'When I try to',
    "I'm having trouble with",
  ];

  const details = [
    "This is affecting our team's productivity.",
    "I've tried the standard troubleshooting steps.",
    'This only started after the recent update.',
    'Other users in my organization are having the same issue.',
    "I've checked the documentation but couldn't find a solution.",
    "This is urgent as it's blocking our work.",
  ];

  const requests = [
    'Can you please help me resolve this?',
    'Please investigate as soon as possible.',
    'Any guidance would be appreciated.',
    'Looking forward to your response.',
    'Please let me know what information you need from me.',
  ];

  return `${randomChoice(intros)} ${title.toLowerCase()}. ${randomChoice(details)} ${randomChoice(requests)}`;
}

/**
 * Generate random timestamp within the last N days
 */
function randomDate(daysAgo = 7) {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime =
    past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime).toISOString();
}

/**
 * Determine if status requires assignment
 */
function requiresAssignment(status) {
  return ['triaged', 'in_progress', 'waiting', 'resolved', 'closed'].includes(
    status
  );
}

/**
 * Determine if status requires resolution code
 */
function requiresResolution(status) {
  return ['resolved', 'closed'].includes(status);
}

/**
 * Generate priority based on category and requester type
 */
function generatePriority(category, requesterType) {
  // Enterprise customers get higher priority baseline
  if (requesterType === 'enterprise') {
    return randomChoice(['P0', 'P1', 'P2']);
  }

  // Billing issues tend to be higher priority
  if (category === 'billing') {
    return randomChoice(['P1', 'P2', 'P2', 'P3']);
  }

  // Technical issues vary
  if (category === 'technical') {
    return randomChoice(['P0', 'P1', 'P1', 'P2', 'P2', 'P3']);
  }

  // General and account tend to be lower priority
  return randomChoice(['P2', 'P2', 'P3', 'P3', 'P3']);
}

/**
 * Generate a single request
 */
function generateRequest(index) {
  const category = randomChoice(categories);
  const requesterType = randomChoice(requesterTypes);
  const priority = generatePriority(category, requesterType);
  const status = randomChoice(statuses);
  const channel = randomChoice(channels);

  // Generate title
  const template = randomChoice(titleTemplates[category]);
  const title = fillTemplate(template);

  // Generate description
  const description = generateDescription(category, title);

  // Generate tags
  const numTags = 2 + Math.floor(Math.random() * 3); // 2-4 tags
  const tags = randomChoices(tagPools[category], numTags);

  // Timestamps
  const createdAt = randomDate(7);
  const updatedAt = status !== 'new' ? randomDate(5) : createdAt;

  // Assignment
  const assignedTo = requiresAssignment(status)
    ? randomChoice([...agents, null])
    : null;

  // Resolution code
  let resolutionCode = null;
  if (requiresResolution(status)) {
    resolutionCode = randomChoice([
      'solved',
      'workaround',
      'duplicate',
      'wont_fix',
    ]);
  }

  return {
    id: `REQ-${String(index + 1).padStart(6, '0')}`,
    title,
    description,
    category,
    priority,
    status,
    requester_type: requesterType,
    channel,
    created_at: createdAt,
    updated_at: updatedAt,
    assigned_to: assignedTo,
    resolution_code: resolutionCode,
    tags,
  };
}

/**
 * Generate multiple requests
 */
function generateRequests(count) {
  const requests = [];
  for (let i = 0; i < count; i++) {
    requests.push(generateRequest(i));
  }
  return requests;
}

/**
 * Write requests to file
 */
function writeToFile(requests, filename) {
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, JSON.stringify(requests, null, 2), 'utf-8');
  console.log(`✅ Generated ${requests.length} requests`);
  console.log(`📄 Written to: ${filepath}`);
}

/**
 * Print statistics
 */
function printStats(requests) {
  const stats = {
    byCategory: {},
    byPriority: {},
    byStatus: {},
    byRequesterType: {},
    byChannel: {},
  };

  requests.forEach((req) => {
    stats.byCategory[req.category] = (stats.byCategory[req.category] || 0) + 1;
    stats.byPriority[req.priority] = (stats.byPriority[req.priority] || 0) + 1;
    stats.byStatus[req.status] = (stats.byStatus[req.status] || 0) + 1;
    stats.byRequesterType[req.requester_type] =
      (stats.byRequesterType[req.requester_type] || 0) + 1;
    stats.byChannel[req.channel] = (stats.byChannel[req.channel] || 0) + 1;
  });

  console.log('\n📊 Statistics:');
  console.log('By Category:', stats.byCategory);
  console.log('By Priority:', stats.byPriority);
  console.log('By Status:', stats.byStatus);
  console.log('By Requester Type:', stats.byRequesterType);
  console.log('By Channel:', stats.byChannel);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  let count = DEFAULT_COUNT;
  let outputFile = OUTPUT_FILE;

  // Parse arguments
  args.forEach((arg) => {
    if (arg.startsWith('--output=')) {
      outputFile = arg.split('=')[1];
    } else if (!isNaN(parseInt(arg))) {
      count = parseInt(arg);
    }
  });

  console.log('🔧 Mock Data Generator');
  console.log(`Generating ${count} support requests...\n`);

  const requests = generateRequests(count);
  writeToFile(requests, outputFile);
  printStats(requests);

  console.log('\n✨ Done!');
}

main();
