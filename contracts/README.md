# Contract Pack

This directory serves as the **single source of truth** for all data contracts, API specifications, and shared domain models across the organization. It enables cross-functional teams (Engineering, Data Science, Product, QA) to work from a consistent understanding of the system.

## 📁 Structure

```
contracts/
├── schemas/              # Data schemas and API contracts
├── data-models/          # Domain models and business rules
├── user-stories/         # User stories documenting requirements
├── mock-data/            # Seed data for development and testing
└── integration-points/   # External integration contracts
```

## 🎯 Purpose

The contract pack ensures:
- **Consistency**: All teams work from the same data definitions
- **Documentation**: Self-documenting schemas with validation rules
- **Testing**: Shared mock data for realistic testing scenarios
- **Integration**: Clear contracts for cross-team dependencies
- **Version Control**: Track changes to domain models over time

## 📋 Contents

### Schemas (`schemas/`)
- **`request.schema.json`**: JSON Schema for support request/ticket objects
- **`request.schema.ts`**: TypeScript types derived from JSON schema
- **`user.schema.json`**: JSON Schema for user objects
- **`api-contract.yml`**: OpenAPI 3.0 specification for REST API
- **`event-contract.yml`**: Event schemas for webhooks and async messaging

### Data Models (`data-models/`)
- **`request-lifecycle.md`**: State machine for request status transitions
- **`priority-definitions.md`**: P0-P3 priority levels with SLA targets
- **`field-dictionary.md`**: Complete field reference with types and validation
- **`business-rules.md`**: Business logic and validation rules

### User Stories (`user-stories/`)
- **`US-01-submit-request.md`**: Requester submitting support tickets
- **`US-02-agent-triage.md`**: Agent triaging and assigning requests
- **`US-03-manager-dashboard.md`**: Manager viewing analytics and insights

### Mock Data (`mock-data/`)
- **`requests.json`**: 50 realistic seed requests
- **`requests.csv`**: Same data in CSV format
- **`users.json`**: Sample users with different roles
- **`data-generator.js`**: Script to generate additional test data
- **`README.md`**: Instructions for using and regenerating mock data

### Integration Points (`integration-points/`)
- **`ds-model-output.schema.json`**: Data Science model prediction schema
- **`ai-automation-input.schema.json`**: AI automation workflow input schema
- **`webhook-events.schema.json`**: Webhook event payload schemas

## 🚀 Usage

### For Backend Engineers
```bash
# Reference the OpenAPI spec for API implementation
cat schemas/api-contract.yml

# Use mock data for seeding local database
node mock-data/data-generator.js
```

### For Frontend Engineers
```typescript
// Import TypeScript types
import { Request, User } from '@project/contracts/schemas/request.schema';

// Use mock data for development
import requests from '@project/contracts/mock-data/requests.json';
```

### For Data Scientists
```bash
# Reference schemas for model input/output
cat integration-points/ds-model-output.schema.json

# Use realistic test data
cat mock-data/requests.json
```

### For QA/Test Engineers
```bash
# Use consistent test data across environments
cp mock-data/requests.json ../backend/test/fixtures/
cp mock-data/users.json ../backend/test/fixtures/
```

## 🔄 Updating Contracts

When updating contracts:
1. Update the relevant schema or spec file
2. Regenerate TypeScript types if needed
3. Update mock data to reflect schema changes
4. Notify dependent teams of breaking changes
5. Version bump if using semantic versioning

## 📚 Related Documentation

- **Field Dictionary**: See `data-models/field-dictionary.md`
- **Business Rules**: See `data-models/business-rules.md`
- **API Documentation**: See `schemas/api-contract.yml`
- **State Machine**: See `data-models/request-lifecycle.md`
