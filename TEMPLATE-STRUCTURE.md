# Multi-Discipline Bootcamp Template Structure

## Overview

This template provides a structured monorepo approach for multi-discipline bootcamp projects where teams from different specializations (UX/UI, Software Engineering, Data Science, BIA, AI Automation, Cyber Security, and QA) can work independently on the same product while maintaining alignment through a shared contract system.

### Key Principles

- **Independent Deliverables**: Each discipline can complete their work without blocking others
- **Contract-First Development**: All teams align through a shared "Contract Pack" that defines data structures, user stories, and interfaces
- **Workspace Isolation**: Each discipline gets their own workspace with appropriate tooling
- **Flexible Team Composition**: Not all disciplines need to participate; template adapts to available teams
- **Real Integration Ready**: While teams can work independently, the structure supports eventual integration

## Complete Directory Structure

```
grad-project-template/
├── README.md                          # Main project documentation
├── TEMPLATE-STRUCTURE.md              # This file
├── package.json                       # Root package manager (NPM workspaces/pnpm)
├── .gitignore                         # Git ignore patterns
├── .env.example                       # Environment variables template
│
├── contract-pack/                     # The single source of truth
│   ├── README.md                      # How to use the contract pack
│   ├── schema/
│   │   ├── request.schema.json        # Core Request/Ticket object (JSON Schema)
│   │   ├── user.schema.json           # User/Agent object
│   │   ├── analytics.schema.json      # Analytics event schema
│   │   └── types.ts                   # TypeScript type definitions (optional)
│   ├── data/
│   │   ├── seed-requests.json         # 100-500 fake requests
│   │   ├── seed-requests.csv          # Same data in CSV format
│   │   ├── seed-users.json            # Sample users/agents
│   │   └── data-dictionary.md         # Field descriptions
│   ├── requirements/
│   │   ├── status-lifecycle.md        # New → Triaged → In Progress → Waiting → Done
│   │   ├── priority-definitions.md    # P0-P3 definitions and SLA targets
│   │   ├── required-fields.md         # Mandatory fields for each object
│   │   └── business-rules.md          # Validation rules and constraints
│   ├── user-stories/
│   │   ├── 001-requester-submits.md   # User story: Submit a request
│   │   ├── 002-agent-triages.md       # User story: Agent triage workflow
│   │   └── 003-manager-insights.md    # User story: Manager dashboard view
│   └── api-contract/
│       ├── openapi.yaml                # API specification (if applicable)
│       └── endpoints.md                # Endpoint descriptions
│
├── packages/                           # Discipline workspaces
│   ├── ux-ui/                         # UX/UI Design workspace
│   │   ├── README.md
│   │   ├── requirements.md            # Discipline-specific deliverables
│   │   ├── research/
│   │   │   ├── personas.md
│   │   │   ├── pain-points.md
│   │   │   └── success-metrics.md
│   │   ├── flows/
│   │   │   ├── submit-request.png
│   │   │   ├── agent-triage.png
│   │   │   └── manager-insights.png
│   │   ├── prototypes/
│   │   │   ├── figma-link.md
│   │   │   └── screenshots/
│   │   ├── accessibility/
│   │   │   ├── wcag-checklist.md
│   │   │   └── error-states.md
│   │   └── design-system/             # Optional stretch
│   │       └── components.md
│   │
│   ├── software-engineering/          # Full-stack development workspace
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── client/                     # Frontend (React/Vue/etc)
│   │   │   ├── src/
│   │   │   ├── public/
│   │   │   └── package.json
│   │   ├── server/                     # Backend (Node/Express/etc)
│   │   │   ├── src/
│   │   │   ├── tests/
│   │   │   └── package.json
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── docker-compose.yml
│   │   └── deployment/
│   │       └── README.md
│   │
│   ├── data-science/                  # Data Science workspace
│   │   ├── README.md
│   │   ├── requirements.txt            # Python dependencies
│   │   ├── environment.yml             # Conda environment (alternative)
│   │   ├── notebooks/
│   │   │   ├── 01-eda.ipynb
│   │   │   ├── 02-triage-model.ipynb
│   │   │   └── 03-evaluation.ipynb
│   │   ├── src/
│   │   │   ├── data_prep.py
│   │   │   ├── model.py
│   │   │   └── evaluation.py
│   │   ├── models/
│   │   │   └── triage_model.pkl
│   │   ├── outputs/
│   │   │   ├── model-card.md
│   │   │   └── output-spec.json       # Model output format
│   │   └── data/                       # Symlink to contract-pack/data
│   │
│   ├── business-intelligence/         # BIA workspace
│   │   ├── README.md
│   │   ├── metrics/
│   │   │   └── definitions.md         # Metric definitions (SSOT)
│   │   ├── dashboards/
│   │   │   ├── powerbi/
│   │   │   ├── tableau/
│   │   │   └── looker-studio/
│   │   ├── queries/
│   │   │   └── analytics.sql          # Sample queries
│   │   ├── insights/
│   │   │   └── insights-memo.md       # 1-page insights
│   │   └── data/                       # Symlink to contract-pack/data
│   │
│   ├── ai-automation/                 # AI/Automation workspace
│   │   ├── README.md
│   │   ├── requirements.txt
│   │   ├── workflows/
│   │   │   ├── triage-automation.md
│   │   │   └── workflow-diagram.png
│   │   ├── prompts/
│   │   │   ├── summarize.txt
│   │   │   ├── categorize.txt
│   │   │   ├── prioritize.txt
│   │   │   ├── guardrails.md
│   │   │   └── pii-handling.md
│   │   ├── integrations/
│   │   │   ├── n8n-export.json
│   │   │   └── zapier-config.json
│   │   ├── src/
│   │   │   └── automation_engine.py
│   │   └── testing/
│   │       └── failure-scenarios.md
│   │
│   ├── cybersecurity/                 # Security workspace
│   │   ├── README.md
│   │   ├── threat-modeling/
│   │   │   ├── stride-analysis.md
│   │   │   └── threat-diagram.png
│   │   ├── risk-assessment/
│   │   │   └── top-10-risks.md
│   │   ├── checklists/
│   │   │   ├── secure-defaults.md
│   │   │   ├── owasp-checklist.md
│   │   │   └── ai-security.md         # Prompt injection, data leakage
│   │   ├── code-review/
│   │   │   └── security-findings.md   # If reviewing SE code
│   │   └── test-plans/
│   │       └── security-tests.md
│   │
│   └── qa/                            # Quality Assurance workspace
│       ├── README.md
│       ├── strategy/
│       │   ├── test-strategy.md
│       │   └── risk-analysis.md
│       ├── test-cases/
│       │   ├── submit-request.md
│       │   ├── agent-triage.md
│       │   ├── manager-insights.md
│       │   └── edge-cases.md
│       ├── automation/
│       │   ├── api-tests/
│       │   │   └── postman_collection.json
│       │   └── e2e-tests/
│       │       ├── cypress/
│       │       └── playwright/
│       ├── reports/
│       │   └── bug-bash.md
│       └── traceability/
│           └── matrix.md              # User stories → tests mapping
│
├── docs/                              # Shared documentation
│   ├── project-overview.md
│   ├── getting-started.md
│   ├── integration-guide.md
│   └── glossary.md
│
└── scripts/                           # Automation scripts
    ├── init-workspace.sh              # Initialize a new discipline workspace
    ├── validate-contract.js           # Validate data against schemas
    ├── sync-data.sh                   # Sync contract data to workspaces
    └── generate-report.js             # Generate cross-discipline report
```

## Contract System

### What is the Contract Pack?

The **contract-pack/** directory is the single source of truth that enables all disciplines to work independently while maintaining alignment. It contains:

1. **Data Schemas** - JSON Schema definitions for all core objects
2. **Seed Data** - Realistic sample data in multiple formats (JSON, CSV)
3. **Requirements** - Business rules, status lifecycle, priorities, SLAs
4. **User Stories** - The 3 core user journeys everyone must support
5. **API Contract** - Optional API specification for integration scenarios

### How the Contract Pack Works

#### 1. Schema-First Design

All core objects are defined in JSON Schema format:

```json
// contract-pack/schema/request.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "category", "requesterType", "channel", "status", "priority"],
  "properties": {
    "id": { "type": "string" },
    "category": { "type": "string", "enum": ["technical", "billing", "access", "other"] },
    "requesterType": { "type": "string", "enum": ["customer", "partner", "internal"] },
    "channel": { "type": "string", "enum": ["email", "slack", "form", "phone"] },
    "status": { "type": "string", "enum": ["new", "triaged", "in_progress", "waiting", "done"] },
    "priority": { "type": "string", "enum": ["P0", "P1", "P2", "P3"] },
    "submittedAt": { "type": "string", "format": "date-time" },
    "description": { "type": "string" },
    "resolutionCode": { "type": "string" }
  }
}
```

#### 2. Seed Data

The contract pack includes 100-500 fake requests that:
- Follow the exact schema
- Cover all categories, priorities, channels
- Include realistic text and timestamps
- Available in both JSON and CSV formats

This allows **Data Science**, **BIA**, **AI Automation**, and **QA** teams to start work immediately without waiting for the **Software Engineering** team to build an API.

#### 3. Status Lifecycle

Defined in [`contract-pack/requirements/status-lifecycle.md`](contract-pack/requirements/status-lifecycle.md):

```
New → Triaged → In Progress → Waiting → Done
         ↓                           ↓
    (Can skip to Done)          (Can return to In Progress)
```

#### 4. User Stories

Three core stories that every discipline must consider:

1. **Requester Submits** - How users submit requests
2. **Agent Triages** - How agents process and route requests
3. **Manager Views Insights** - How leadership monitors the system

### Contract Validation

The [`scripts/validate-contract.js`](scripts/validate-contract.js) script validates that:
- All seed data conforms to schemas
- Required fields are present
- Enum values are valid
- Timestamps are properly formatted

Teams should run this before committing changes to the contract pack.

## Discipline Workspaces

### UX/UI Workspace

**Location**: [`packages/ux-ui/`](packages/ux-ui/)

**Purpose**: Design the user experience and interface for all three user stories

**Key Deliverables**:
- Problem framing document (personas, pain points, success metrics)
- User flows for submit, triage, and insights
- Clickable Figma prototype with all key screens
- Accessibility checklist and error state documentation

**Dependencies**: Only the contract pack (schemas, user stories)

**Tools**: Figma, Miro, FigJam, accessibility checkers

### Software Engineering Workspace

**Location**: [`packages/software-engineering/`](packages/software-engineering/)

**Purpose**: Build a working MVP (MERN stack or similar)

**Key Deliverables**:
- Full-stack CRUD application
- Triage queue with filtering and search
- Status update and notes functionality
- Basic authentication (or mocked auth)
- Seed data loader
- Docker deployment or live deployment

**Dependencies**: Contract pack (schemas, seed data, user stories)

**Tools**: React/Vue, Node.js, MongoDB/PostgreSQL, Docker

**Structure**:
- `client/` - Frontend application
- `server/` - Backend API
- `database/` - Migrations and seeds
- `docker-compose.yml` - Local development environment

### Data Science Workspace

**Location**: [`packages/data-science/`](packages/data-science/)

**Purpose**: Exploratory data analysis and triage assistance model

**Key Deliverables**:
- EDA notebook (categories, channels, patterns)
- Triage assist model (predict category/priority or routing)
- Model evaluation (accuracy, F1, confusion matrix)
- Model card lite (capabilities, limitations, bias notes)
- Output format specification

**Dependencies**: Only contract pack seed data

**Tools**: Python, Jupyter, pandas, scikit-learn, matplotlib

**Note**: The `data/` directory can be a symlink to `../../contract-pack/data/`

### Business Intelligence & Analytics Workspace

**Location**: [`packages/business-intelligence/`](packages/business-intelligence/)

**Purpose**: Define metrics and create insights dashboards

**Key Deliverables**:
- Metric definitions document (single source of truth for KPIs)
- Dashboard (Power BI, Tableau, Looker Studio, or spreadsheet)
- Filters: date range, category, priority, channel
- At least 3 visualizations + 1 table
- 1-page insights memo for ops leadership

**Dependencies**: Only contract pack seed data

**Tools**: Power BI, Tableau, Looker Studio, Excel, SQL

**Note**: The `data/` directory can be a symlink to `../../contract-pack/data/`

### AI Automation Workspace

**Location**: [`packages/ai-automation/`](packages/ai-automation/)

**Purpose**: Design and implement AI-powered automation workflows

**Key Deliverables**:
- Automation workflow diagram and documentation
- Prompt pack (3-5 prompts for summarization, categorization, prioritization)
- Guardrails and PII handling documentation
- Failure handling strategy (low confidence, tool failures)
- Optional: n8n/Zapier export or configuration

**Dependencies**: Contract pack (schemas, seed data for testing)

**Tools**: Python, OpenAI/Anthropic APIs, LangChain, n8n, Zapier

### Cybersecurity Workspace

**Location**: [`packages/cybersecurity/`](packages/cybersecurity/)

**Purpose**: Threat modeling and security assessment

**Key Deliverables**:
- Threat model (STRIDE or similar methodology)
- Top 10 risks with mitigations (prioritized)
- Secure-by-default checklist (secrets, auth, validation, logging, least privilege)
- Security review findings (if reviewing SE code)
- Optional: AI security concerns (prompt injection, data leakage)
- Optional: Security test plan (OWASP-oriented)

**Dependencies**: Contract pack (understanding data flows and requirements)

**Tools**: Threat modeling tools, OWASP resources, security scanners

### QA Workspace

**Location**: [`packages/qa/`](packages/qa/)

**Purpose**: Comprehensive testing strategy and execution

**Key Deliverables**:
- Test strategy document (what, how, why, risks)
- Test cases for 3 core flows plus edge cases
- Bug bash report
- One of: Postman API tests, Cypress/Playwright E2E tests, or manual regression checklist
- Optional: Traceability matrix (user stories → tests)
- Optional: Accessibility test checklist

**Dependencies**: Contract pack (user stories, schemas), optionally SE workspace for live testing

**Tools**: Postman, Cypress, Playwright, Jest, accessibility testing tools

## How Teams Work Independently

### Independence Through Contracts

Each discipline can complete their deliverables using only the contract pack:

| Discipline | Works With | Produces | Blocking? |
|------------|-----------|----------|-----------|
| UX/UI | User stories, schemas | Figma prototype, flows | No |
| Software Engineering | Schemas, seed data, user stories | Working MVP | No |
| Data Science | Seed data | Models, insights | No |
| BIA | Seed data | Dashboards, metrics | No |
| AI Automation | Schemas, seed data | Automation workflows | No |
| Cybersecurity | All contract docs | Threat model, checklists | No |
| QA | User stories, schemas, seed data | Test cases, automation | No |

### Example: Data Science Working Independently

1. Clone the repository
2. Navigate to `packages/data-science/`
3. Install Python dependencies: `pip install -r requirements.txt`
4. Access seed data at `../../contract-pack/data/seed-requests.csv`
5. Perform EDA in Jupyter notebooks
6. Build and evaluate triage model
7. Document output format in `outputs/output-spec.json`
8. Create model card in `outputs/model-card.md`
9. Submit deliverables - **no dependency on any other team**

### Example: UX/UI Working Independently

1. Clone the repository
2. Review contract pack:
   - Read user stories in `contract-pack/user-stories/`
   - Review data schema to understand fields
   - Check status lifecycle and priorities
3. Create personas and problem framing
4. Design user flows for all three stories
5. Build Figma prototype with key screens
6. Document accessibility requirements
7. Submit deliverables - **no dependency on any other team**

### Integration Points (Optional)

While teams work independently, integration is possible:

- **QA** can test the **SE** MVP if it exists
- **Cybersecurity** can review **SE** code if available
- **DS** model output can be consumed by **SE** API (via output spec)
- **BIA** dashboards can connect to **SE** database (if deployed)
- **AI Automation** can integrate with **SE** webhooks (if implemented)

The key is that integration is **optional**, not **required**.

## Configuration Files

### Root Package.json

```json
{
  "name": "grad-project-template",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "validate:contract": "node scripts/validate-contract.js",
    "sync:data": "bash scripts/sync-data.sh",
    "init:workspace": "bash scripts/init-workspace.sh"
  },
  "devDependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1"
  }
}
```

### .env.example

Template for environment variables:

```bash
# Software Engineering
DATABASE_URL=mongodb://localhost:27017/ops-triage
JWT_SECRET=your-secret-key-here
PORT=3000

# AI Automation
OPENAI_API_KEY=your-api-key-here
ANTHROPIC_API_KEY=your-api-key-here

# Business Intelligence
POWERBI_WORKSPACE_ID=your-workspace-id
```

### .gitignore

```gitignore
# Environment files
.env
.env.local

# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
dist/
build/
*.pyc

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Model files (large binaries)
*.pkl
*.h5
*.model
```

## Integration Scenarios

### Scenario 1: Full Team (All Disciplines)

**Team Composition**: UX/UI, SE, DS, BIA, AI, Sec, QA

**Workflow**:
1. All teams start simultaneously using contract pack
2. Teams work independently on deliverables
3. SE team builds MVP
4. QA tests MVP and finds issues
5. Sec reviews SE code and provides recommendations
6. DS model output spec is implemented by SE (optional)
7. BIA connects dashboard to live database (optional)
8. AI automation integrates with SE webhooks (optional)

**Result**: Fully integrated product with all perspectives

### Scenario 2: MVP Team (SE, UX, Sec, QA)

**Team Composition**: Software Engineering, UX/UI, Cybersecurity, QA

**Workflow**:
1. UX designs prototype based on user stories
2. SE builds MVP using contract schemas
3. Sec reviews for security issues
4. QA tests the application
5. Teams iterate based on findings

**Result**: Secure, tested MVP with good UX

### Scenario 3: Data-Focused Team (DS, BIA)

**Team Composition**: Data Science, Business Intelligence

**Workflow**:
1. Both teams use seed data from contract pack
2. BIA defines metrics and creates dashboards
3. DS performs EDA and builds triage model
4. Teams present insights and model capabilities
5. No application is built, but analysis is complete

**Result**: Deep analytical insights and ML model ready for future integration

### Scenario 4: Design + Analysis (UX, BIA)

**Team Composition**: UX/UI, Business Intelligence

**Workflow**:
1. BIA analyzes seed data to identify patterns
2. UX uses BIA insights to inform design decisions
3. UX creates data-driven prototype
4. BIA designs dashboard mockups

**Result**: Evidence-based design with planned analytics

### Scenario 5: Solo Discipline

**Team Composition**: Any single discipline

**Workflow**:
1. Team clones repository
2. Reviews contract pack
3. Completes their specific deliverables
4. Submits work independently

**Result**: Complete, valid submission for that discipline

## Tooling & Scripts

### init-workspace.sh

Initialize a new discipline workspace:

```bash
./scripts/init-workspace.sh data-engineering
```

Creates:
- Workspace directory structure
- README with requirements
- Symlinks to contract-pack/data
- Basic configuration files

### validate-contract.js

Validates contract pack integrity:

```bash
npm run validate:contract
```

Checks:
- All JSON files are valid
- Seed data matches schemas
- Required fields are present
- Enum values are correct
- Relationships are valid

### sync-data.sh

Syncs contract pack data to discipline workspaces:

```bash
npm run sync:data
```

Updates:
- Symlinks to seed data
- Schema files in relevant workspaces
- Documentation if contract pack is updated

### generate-report.js

Generates a cross-discipline status report:

```bash
node scripts/generate-report.js
```

Produces:
- Markdown report showing completion status
- List of deliverables by discipline
- Integration readiness checklist

## Key Benefits

### 1. **No Blocking Dependencies**

Each discipline can complete their work fully without waiting for others. This eliminates the common problem where one team's delays cascade to everyone else.

### 2. **Flexible Team Composition**

Whether you have all 7 disciplines or just 2, the template works. Teams self-select their workspace and work independently.

### 3. **Real-World Alignment**

Despite working independently, all teams align on:
- The same data model
- The same user stories
- The same business requirements

This mirrors real-world product development where teams work in parallel on a shared spec.

### 4. **Integration Ready**

While independence is the default, the structure supports integration:
- Shared schemas mean outputs can be combined
- API contracts enable data exchange
- Consistent user stories ensure feature alignment

### 5. **Learning-Focused**

Students learn to:
- Work from specifications (contract pack)
- Produce professional deliverables
- Consider other disciplines' needs
- Validate their work against standards

### 6. **Scalable Complexity**

The template supports:
- **Minimal**: Single discipline working alone
- **Standard**: 3-4 disciplines with light integration
- **Advanced**: All disciplines with full integration

### 7. **Realistic Seed Data**

High-quality seed data means:
- DS can build real models
- BIA can create meaningful dashboards
- QA can test with realistic scenarios
- AI can train on actual patterns

### 8. **Clear Evaluation Criteria**

Each discipline has:
- Explicit deliverables
- Contract conformance requirements
- Professional documentation standards

This makes grading objective and fair.

### 9. **Portfolio-Ready Outputs**

Students produce:
- Real prototypes and designs
- Working applications
- Trained models with evaluation
- Professional dashboards
- Security assessments
- Test suites

All of these are portfolio-worthy artifacts.

### 10. **Open Source Best Practices**

The monorepo structure teaches:
- Workspace organization
- Documentation standards
- Collaborative workflows (even when independent)
- Version control practices

---

## Getting Started

1. **Clone this template repository**
2. **Review the contract pack** to understand the product
3. **Navigate to your discipline's workspace** in `packages/`
4. **Read the workspace README.md** for specific requirements
5. **Install necessary dependencies** for your toolchain
6. **Begin working on deliverables** using the contract pack as your guide
7. **Validate your work** against schemas and requirements
8. **Submit deliverables** according to your bootcamp's process

## Questions or Issues?

- Review the contract pack documentation first
- Check your workspace's README.md for discipline-specific guidance
- Consult [`docs/getting-started.md`](docs/getting-started.md)
- Validate your data with [`scripts/validate-contract.js`](scripts/validate-contract.js)

---

**This template enables true parallel development across disciplines while maintaining professional standards and integration readiness.**
