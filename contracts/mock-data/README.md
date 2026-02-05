# Mock Data

This directory contains realistic seed data for development and testing purposes.

## 📁 Files

### [`requests.json`](requests.json)
50 realistic support requests with varied:
- **Categories**: technical, account, billing, general
- **Priorities**: P0 (critical) through P3 (low)
- **Statuses**: new, triaged, in_progress, waiting, resolved, closed
- **Requester Types**: free, paid, enterprise, internal
- **Channels**: email, chat, phone, web_form, api

### [`requests.csv`](requests.csv)
Same 50 requests in CSV format for spreadsheet analysis or importing into other tools.

### [`users.json`](users.json)
Sample users including:
- 2 managers (technical, billing teams)
- 6 agents (across different teams)
- 4 requesters (customers)

### [`data-generator.js`](data-generator.js)
Node.js script to generate additional seed data with realistic variations.

---

## 🚀 Usage

### Using Existing Mock Data

**Backend (Seed Database)**:
```bash
# Import JSON into database
cat mock-data/requests.json | mongoimport --db support --collection requests --jsonArray

# Or use in seed script
import requests from '@project/contracts/mock-data/requests.json';
await db.requests.insertMany(requests);
```

**Frontend (Development)**:
```typescript
import requests from '@project/contracts/mock-data/requests.json';
import users from '@project/contracts/mock-data/users.json';

// Use for component development
const mockData = {
  requests,
  users
};
```

**Testing**:
```typescript
import { test, expect } from 'vitest';
import requests from '@project/contracts/mock-data/requests.json';

test('should filter P0 requests', () => {
  const critical = requests.filter(r => r.priority === 'P0');
  expect(critical.length).toBeGreaterThan(0);
});
```

---

## 🔧 Generating Additional Data

### Generate Default (50 requests)
```bash
node data-generator.js
```
Output: [`requests-generated.json`](requests-generated.json)

### Generate Custom Count
```bash
# Generate 100 requests
node data-generator.js 100

# Generate 500 requests
node data-generator.js 500
```

### Custom Output File
```bash
node data-generator.js 200 --output=requests-large.json
```

### From Package Script
```bash
npm run generate-mock-data
```

---

## 📊 Data Distribution

The seed data represents a realistic support queue:

### By Priority
- **P0** (Critical): ~3% - System outages, security issues
- **P1** (High): ~20% - Major functionality broken
- **P2** (Medium): ~40% - Minor issues with workarounds
- **P3** (Low): ~37% - Requests, questions, enhancements

### By Category
- **Technical**: 40% - Bugs, performance, integrations
- **Billing**: 25% - Payments, invoices, subscriptions
- **Account**: 20% - User management, permissions
- **General**: 15% - Questions, documentation, feature requests

### By Status
- **new**: 10% - Just submitted, needs triage
- **triaged**: 15% - Categorized, awaiting assignment
- **in_progress**: 30% - Agent actively working
- **waiting**: 10% - Waiting for customer input
- **resolved**: 15% - Fixed, awaiting closure
- **closed**: 20% - Completed

### By Requester Type
- **enterprise**: 40% - Higher priority, more P0/P1 issues
- **paid**: 35% - Standard support
- **free**: 20% - Limited support, mainly P3
- **internal**: 5% - Internal team requests

---

## 🎯 Use Cases

### Development
- **Component Development**: Use as props for UI components
- **State Management**: Populate Redux/Zustand stores
- **API Mocking**: Return mock data from MSW handlers
- **Database Seeding**: Initial data for local development

### Testing
- **Unit Tests**: Test data transformations and filters
- **Integration Tests**: End-to-end flows with realistic data
- **Performance Testing**: Load testing with large datasets
- **Visual Regression**: Consistent data for screenshot tests

### Demos & Training
- **Product Demos**: Realistic data for client demos
- **User Training**: Training environment data
- **Documentation**: Examples in API documentation
- **Prototyping**: Quick prototypes with realistic data

---

## 🔄 Keeping Data Fresh

### Regenerate Periodically
```bash
# Regenerate with current date timestamps
node data-generator.js 50 --output=requests.json
```

### Version Control
- ✅ **DO** commit curated seed data (`requests.json`, `users.json`)
- ✅ **DO** commit the generator script (`data-generator.js`)
- ❌ **DON'T** commit generated files (`requests-generated.json`)
- ❌ **DON'T** commit large datasets (>1000 records)

Add to [`.gitignore`](../../.gitignore):
```
contracts/mock-data/requests-generated.json
contracts/mock-data/*-large.json
```

---

## 🛠️ Customizing the Generator

### Add New Title Templates
Edit [`data-generator.js`](data-generator.js):
```javascript
const titleTemplates = {
  technical: [
    'Cannot {action} {feature}',
    'Your new template here',
    // ...
  ]
};
```

### Add New Substitutions
```javascript
const substitutions = {
  action: ['access', 'login', 'your-action'],
  // ...
};
```

### Adjust Distributions
```javascript
function generatePriority(category, requesterType) {
  if (requesterType === 'enterprise') {
    return randomChoice(['P0', 'P1', 'P1', 'P2']); // More P1s
  }
  // ...
}
```

---

## 📋 Data Schema

All generated requests conform to the schema defined in [`../schemas/request.schema.json`](../schemas/request.schema.json).

**Required Fields**:
- `id`: REQ-XXXXXX format
- `title`: 5-200 characters
- `description`: 10-5000 characters
- `category`: enum (technical, account, billing, general)
- `priority`: enum (P0, P1, P2, P3)
- `status`: enum (new, triaged, in_progress, waiting, resolved, closed)
- `requester_type`: enum (free, paid, enterprise, internal)
- `channel`: enum (email, chat, phone, web_form, api)
- `created_at`: ISO 8601 datetime

**Optional Fields**:
- `updated_at`: ISO 8601 datetime
- `assigned_to`: Agent ID
- `resolution_code`: enum (solved, workaround, duplicate, wont_fix, spam)
- `tags`: Array of strings

---

## 🔍 Validation

### Validate Against Schema
```bash
# Using ajv-cli
npm install -g ajv-cli
ajv validate -s ../schemas/request.schema.json -d requests.json
```

### Check Data Quality
```javascript
import requests from './requests.json';

// Check all IDs are unique
const ids = requests.map(r => r.id);
console.assert(ids.length === new Set(ids).size, 'Duplicate IDs found');

// Check required fields
requests.forEach(req => {
  console.assert(req.title.length >= 5, `Invalid title: ${req.id}`);
  console.assert(req.description.length >= 10, `Invalid description: ${req.id}`);
});
```

---

## 💡 Tips

1. **Realistic Timestamps**: Generator creates requests within last 7 days
2. **Consistent State**: Status transitions follow the state machine
3. **Business Rules**: Enterprise requests have minimum P2 priority
4. **Assignment Logic**: Only in_progress/waiting/resolved/closed have assigned agents
5. **Resolution Codes**: Only resolved/closed requests have resolution codes

---

## 📚 Related Documentation

- **Schema Reference**: [`../schemas/request.schema.json`](../schemas/request.schema.json)
- **Field Dictionary**: [`../data-models/field-dictionary.md`](../data-models/field-dictionary.md)
- **Business Rules**: [`../data-models/business-rules.md`](../data-models/business-rules.md)
- **State Machine**: [`../data-models/request-lifecycle.md`](../data-models/request-lifecycle.md)
