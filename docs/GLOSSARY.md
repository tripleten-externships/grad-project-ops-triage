# Glossary

A comprehensive list of terms, acronyms, and definitions used throughout the Ops Triage Application project.

## A

### Agent
An IT support team member who triages and resolves requests. Has access to the triage queue and can update request status, priority, and assignments.

### API (Application Programming Interface)
A set of endpoints that allow the frontend to communicate with the backend. See [`api-contract.yml`](../contracts/schemas/api-contract.yml).

### API Contract
The formal specification of all API endpoints, including request/response formats, status codes, and error handling. Defined in OpenAPI (Swagger) format.

### Authentication (AuthN)
The process of verifying a user's identity (e.g., login with username/password).

### Authorization (AuthZ)
The process of determining what a user is allowed to do (e.g., only managers can view analytics).

## B

### Backend
The server-side application built with Express.js and Node.js. Handles business logic, data persistence, and API endpoints.

### BIA (Business Intelligence & Analytics)
The discipline responsible for creating dashboards, analyzing data, and generating insights from request data.

### Business Rules
Policies and logic that govern how the system behaves. See [`contracts/data-models/business-rules.md`](../contracts/data-models/business-rules.md).

## C

### Category
Classification of a request type: Hardware, Software, Network, Access, or Other.

### Contract
A formal agreement on data structures, API formats, or integration points that allows different teams to work independently. See [`CONTRACTS.md`](./CONTRACTS.md).

### CORS (Cross-Origin Resource Sharing)
Security mechanism that allows the frontend (running on port 5173) to make requests to the backend (running on port 3000).

### CRUD
**C**reate, **R**ead, **U**pdate, **D**elete - the four basic operations for data manipulation.

## D

### Data Science (DS)
The discipline responsible for building machine learning models to predict request categories and priorities.

### Deliverable
A required output from a discipline (e.g., trained ML model, dashboard, test suite).

### Discipline
A specialized role on the team: Software Engineering, UX/UI Design, Data Science, BIA, AI Automation, Cyber Security, or QA.

## E

### E2E (End-to-End) Testing
Testing complete user workflows from start to finish (e.g., submit request → view in queue → update status → mark resolved).

### EDA (Exploratory Data Analysis)
Initial data analysis to understand patterns, distributions, and relationships before building models.

### Endpoint
A specific URL path in the API (e.g., `POST /api/requests`).

### Environment Variables
Configuration values stored in `.env` files (e.g., database connection string, API keys). Never committed to Git.

## F

### FastAPI
Python web framework used to serve the Data Science model as a REST API.

### Frontend
The user-facing application built with React and TypeScript. Runs in the browser.

## G

### Guardrails
Safety and validation rules for AI Automation to prevent incorrect or harmful outputs.

## H

### Happy Path
The ideal scenario where everything works as expected (e.g., user submits valid request → successfully saved).

## I

### Integration
The process of connecting different components or disciplines (e.g., frontend calling backend API, backend calling DS model).

### Integration Point
A contract that defines how two components communicate. See [`contracts/integration-points/`](../contracts/integration-points/).

## J

### JSON (JavaScript Object Notation)
Data format used for API requests/responses and configuration files.

### JWT (JSON Web Token)
Authentication token format used to verify user identity across API requests.

## L

### LLM (Large Language Model)
AI model (like GPT-4, Claude) used for automated categorization and priority assignment.

## M

### Manager
An IT support supervisor who views team performance metrics and analytics.

### ML (Machine Learning)
Subset of AI used to build predictive models (e.g., category classification, priority prediction).

### Mock Data
Sample data used for development and testing. Located in [`contracts/mock-data/`](../contracts/mock-data/).

### Monorepo
A single repository containing multiple packages (frontend, backend, data-science, etc.) managed with pnpm workspaces.

### Mongoose
MongoDB ODM (Object Document Mapper) for Node.js. Provides schema validation and queries.

## N

### n8n
Low-code automation platform for building AI workflows (alternative to custom code).

## O

### ODM (Object Document Mapper)
Library (like Mongoose) that maps JavaScript objects to MongoDB documents.

### ORM (Object-Relational Mapper)
Library that maps code objects to database tables (SQL equivalent of ODM).

### OWASP (Open Web Application Security Project)
Non-profit focused on web security. OWASP Top 10 lists the most critical security risks.

### Ops Triage
Short for "Operations Triage" - the process of categorizing, prioritizing, and routing IT support requests.

## P

### Persona
A fictional character representing a user type, based on research (e.g., "Sarah the IT Agent").

### Playwright
End-to-end testing framework for web applications.

### pnpm
Fast, disk-space-efficient package manager for Node.js. Used for monorepo management.

### Priority
Urgency level of a request: P0 (Critical), P1 (High), P2 (Medium), P3 (Low). Determines SLA deadline.

### Prompt Engineering
The practice of designing effective prompts for LLMs to get desired outputs.

## Q

### QA (Quality Assurance)
The discipline responsible for testing, bug reporting, and ensuring the application works correctly.

## R

### RBAC (Role-Based Access Control)
Authorization model where permissions are assigned based on user roles (User, Agent, Manager).

### Request
An IT support ticket submitted by a user describing a problem or asking for help.

### REST (Representational State Transfer)
Architectural style for APIs using HTTP methods (GET, POST, PATCH, DELETE).

## S

### Schema
Definition of data structure including field types, validation rules, and constraints.

### SLA (Service Level Agreement)
Commitment to resolve requests within a specific timeframe based on priority (e.g., P0 in 4 hours).

### Status
Current state of a request: Open, In Progress, Resolved, or Closed.

### STRIDE
Threat modeling framework: **S**poofing, **T**ampering, **R**epudiation, **I**nformation Disclosure, **D**enial of Service, **E**levation of Privilege.

### Stretch Goal
Optional, advanced feature beyond required deliverables.

## T

### TDD (Test-Driven Development)
Writing tests before implementing features.

### TF-IDF (Term Frequency-Inverse Document Frequency)
Text feature extraction technique used in ML to convert text to numbers.

### Triage
The process of categorizing, prioritizing, and assigning requests to appropriate agents.

### TypeScript
Typed superset of JavaScript that adds static type checking.

## U

### User Story
Description of a feature from a user's perspective. Format: "As a [role], I want [feature] so that [benefit]."

### UX (User Experience)
How users interact with and feel about the application.

### UI (User Interface)
Visual elements users interact with (buttons, forms, etc.).

## V

### Validation
Checking that data meets requirements (e.g., title is 5-200 characters).

## W

### WCAG (Web Content Accessibility Guidelines)
Standards for making web content accessible to people with disabilities. Levels: A, AA, AAA.

### Webhook
HTTP callback that allows one system to notify another when an event occurs (e.g., backend notifies AI Automation when request is created).

### Wireframe
Low-fidelity sketch or mockup of UI layout and structure.

## Acronyms Quick Reference

| Acronym | Full Form | Context |
|---------|-----------|---------|
| **A11y** | Accessibility | Web accessibility (11 letters between A and Y) |
| **API** | Application Programming Interface | Backend endpoints |
| **BIA** | Business Intelligence & Analytics | Discipline |
| **CORS** | Cross-Origin Resource Sharing | Web security |
| **CRUD** | Create, Read, Update, Delete | Database operations |
| **DS** | Data Science | Discipline |
| **E2E** | End-to-End | Testing type |
| **EDA** | Exploratory Data Analysis | Data science phase |
| **JWT** | JSON Web Token | Authentication |
| **LLM** | Large Language Model | AI (GPT, Claude) |
| **ML** | Machine Learning | Data science |
| **MFA** | Multi-Factor Authentication | Security |
| **ODM** | Object Document Mapper | MongoDB library |
| **ORM** | Object-Relational Mapper | Database library |
| **OWASP** | Open Web Application Security Project | Security standards |
| **P0-P3** | Priority 0 through 3 | Request urgency |
| **PII** | Personally Identifiable Information | Privacy/security |
| **QA** | Quality Assurance | Discipline |
| **RBAC** | Role-Based Access Control | Authorization |
| **REST** | Representational State Transfer | API style |
| **SLA** | Service Level Agreement | Support commitment |
| **STRIDE** | Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege | Threat model |
| **TDD** | Test-Driven Development | Testing approach |
| **TF-IDF** | Term Frequency-Inverse Document Frequency | NLP technique |
| **UI** | User Interface | Visual design |
| **US** | User Story | Requirement format |
| **UX** | User Experience | User-centered design |
| **WCAG** | Web Content Accessibility Guidelines | Accessibility standard |
| **XSS** | Cross-Site Scripting | Security vulnerability |

## Priority Levels

| Level | Name | SLA | Description |
|-------|------|-----|-------------|
| **P0** | Critical | 4 hours | Complete system outage, critical business impact |
| **P1** | High | 24 hours | Major functionality broken, multiple users affected |
| **P2** | Medium | 3 days | Minor issue, single user, workaround exists |
| **P3** | Low | 5 days | Enhancement request, cosmetic issue |

## Request Status

| Status | Description |
|--------|-------------|
| **Open** | Newly submitted, awaiting triage |
| **In Progress** | Agent is actively working on it |
| **Resolved** | Issue fixed, awaiting user confirmation |
| **Closed** | Confirmed resolved, no further action |

## User Roles

| Role | Access Level | Typical Tasks |
|------|--------------|---------------|
| **User** | Own requests only | Submit requests, view status |
| **Agent** | Assigned requests + queue | Triage, update, resolve requests |
| **Manager** | All requests + analytics | Monitor team, view metrics, assign agents |

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React + TypeScript | User interface |
| **Backend** | Express + Node.js | API server |
| **Database** | MongoDB | Data storage |
| **DS API** | FastAPI + Python | ML predictions |
| **Testing** | Playwright | E2E tests |
| **Package Manager** | pnpm | Monorepo management |
| **BI Tools** | Power BI / Tableau | Dashboards |
| **AI** | OpenAI / Anthropic | LLM integration |

---

**Need to add a term?** Submit a PR updating this glossary!
