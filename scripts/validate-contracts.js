#!/usr/bin/env node

/**
 * validate-contracts.js - Validate JSON schemas and mock data
 * 
 * This script:
 * - Validates that JSON schemas are valid
 * - Validates mock data against schemas
 * - Reports validation results
 * - Returns exit code 0 on success, 1 on failure
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Helper functions for colored output
const error = (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`);
const success = (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`);
const info = (msg) => console.log(`${colors.blue}➜${colors.reset} ${msg}`);
const warn = (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);

// Initialize AJV with options
const ajv = new Ajv({ 
  allErrors: true,
  verbose: true,
  strict: false,  // Allow additional properties
});
addFormats(ajv);

// Track validation results
let hasErrors = false;

/**
 * Read JSON file
 */
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to read ${filePath}: ${err.message}`);
    hasErrors = true;
    return null;
  }
}

/**
 * Validate a schema is well-formed
 */
function validateSchema(schemaPath, schemaName) {
  info(`Validating schema: ${schemaName}`);
  
  const schema = readJSON(schemaPath);
  if (!schema) return null;
  
  try {
    ajv.compile(schema);
    success(`Schema ${schemaName} is valid`);
    return schema;
  } catch (err) {
    error(`Schema ${schemaName} is invalid: ${err.message}`);
    hasErrors = true;
    return null;
  }
}

/**
 * Validate data against schema
 */
function validateData(dataPath, schema, schemaName, dataName) {
  info(`Validating ${dataName} against ${schemaName}`);
  
  const data = readJSON(dataPath);
  if (!data) return;
  
  const validate = ajv.compile(schema);
  
  // If data is an array, validate each item
  if (Array.isArray(data)) {
    let validCount = 0;
    let invalidCount = 0;
    
    data.forEach((item, index) => {
      const valid = validate(item);
      if (!valid) {
        error(`  Item ${index} failed validation:`);
        validate.errors.forEach(err => {
          console.log(`    - ${err.instancePath} ${err.message}`);
        });
        invalidCount++;
        hasErrors = true;
      } else {
        validCount++;
      }
    });
    
    if (invalidCount === 0) {
      success(`All ${validCount} items in ${dataName} are valid`);
    } else {
      error(`${invalidCount} of ${data.length} items in ${dataName} failed validation`);
    }
  } else {
    // Single object validation
    const valid = validate(data);
    if (valid) {
      success(`${dataName} is valid`);
    } else {
      error(`${dataName} failed validation:`);
      validate.errors.forEach(err => {
        console.log(`  - ${err.instancePath} ${err.message}`);
      });
      hasErrors = true;
    }
  }
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Main validation function
 */
function main() {
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}  Contract Validation${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log('');
  
  // Define schema paths
  const requestSchemaPath = path.join(__dirname, '../contracts/schemas/request.schema.json');
  const userSchemaPath = path.join(__dirname, '../contracts/schemas/user.schema.json');
  
  // Define data paths
  const requestsDataPath = path.join(__dirname, '../contracts/mock-data/requests.json');
  const usersDataPath = path.join(__dirname, '../contracts/mock-data/users.json');
  
  // Validate schemas exist
  console.log(`${colors.blue}Step 1: Checking schema files...${colors.reset}`);
  console.log('');
  
  if (!fileExists(requestSchemaPath)) {
    error('request.schema.json not found');
    hasErrors = true;
  }
  
  if (!fileExists(userSchemaPath)) {
    error('user.schema.json not found');
    hasErrors = true;
  }
  
  if (hasErrors) {
    console.log('');
    error('Schema files are missing. Cannot proceed with validation.');
    process.exit(1);
  }
  
  console.log('');
  console.log(`${colors.blue}Step 2: Validating schemas...${colors.reset}`);
  console.log('');
  
  // Validate schemas are well-formed
  const requestSchema = validateSchema(requestSchemaPath, 'request.schema.json');
  const userSchema = validateSchema(userSchemaPath, 'user.schema.json');
  
  if (!requestSchema || !userSchema) {
    console.log('');
    error('Schema validation failed. Cannot proceed with data validation.');
    process.exit(1);
  }
  
  console.log('');
  console.log(`${colors.blue}Step 3: Validating mock data...${colors.reset}`);
  console.log('');
  
  // Validate mock data against schemas
  if (fileExists(requestsDataPath)) {
    validateData(requestsDataPath, requestSchema, 'request.schema.json', 'requests.json');
  } else {
    warn('requests.json not found - skipping validation');
  }
  
  console.log('');
  
  if (fileExists(usersDataPath)) {
    validateData(usersDataPath, userSchema, 'user.schema.json', 'users.json');
  } else {
    warn('users.json not found - skipping validation');
  }
  
  // Integration point schemas (optional validation)
  console.log('');
  console.log(`${colors.blue}Step 4: Validating integration schemas (optional)...${colors.reset}`);
  console.log('');
  
  const integrationSchemas = [
    'ai-automation-input.schema.json',
    'ds-model-output.schema.json',
    'webhook-events.schema.json',
  ];
  
  integrationSchemas.forEach(schemaFile => {
    const schemaPath = path.join(__dirname, '../contracts/integration-points', schemaFile);
    if (fileExists(schemaPath)) {
      validateSchema(schemaPath, schemaFile);
    } else {
      warn(`${schemaFile} not found - skipping`);
    }
  });
  
  // Print summary
  console.log('');
  console.log(`${colors.blue}========================================${colors.reset}`);
  if (hasErrors) {
    console.log(`${colors.red}  Validation Failed ✗${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log('');
    error('Some validations failed. Please fix the errors above.');
    console.log('');
    process.exit(1);
  } else {
    console.log(`${colors.green}  All Validations Passed ✓${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log('');
    success('All schemas and data are valid!');
    console.log('');
    process.exit(0);
  }
}

// Run validation
main();
