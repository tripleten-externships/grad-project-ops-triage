# Ops Triage Application - Multi-Discipline Bootcamp Project Template

> **A collaborative bootcamp graduate project enabling independent work, clear contracts, and fair evaluation across 7+ disciplines**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

---

## Overview

This is a **comprehensive bootcamp graduate project template** designed to enable students from multiple disciplines to collaborate on building a real-world **Ops Triage Application** - a support request management system used by IT/operations teams.

**What makes this unique:**
- ✅ **Contract-driven development** - Shared schemas, APIs, and user stories ensure consistency
- ✅ **True independence** - Mock data and clear interfaces let you work alone or in teams
- ✅ **Fair evaluation** - Judging criteria tailored to each discipline, regardless of team composition
- ✅ **Industry patterns** - Monorepo architecture, API-first design, event-driven systems
- ✅ **Real-world complexity** - Authentic cross-functional collaboration challenges

**Who is this for?**
Bootcamp graduates from 7+ disciplines including Software Engineering, UX/UI Design, Data Science, Business Intelligence, AI/Automation, Cybersecurity, and QA.

---

## 🎯 Disciplines Involved

This template supports **8 distinct disciplines**, each with specific deliverables and evaluation criteria:

| Discipline | Focus Area | Key Deliverables |
|------------|------------|------------------|
| **💻 Software Engineering** | Full-stack application | React frontend + Express backend API |
| **🎨 UX/UI Design** | User experience & design | User research, flows, prototypes, design system |
| **📊 Data Science** | Machine learning & analytics | ML model for triage prediction, insights |
| **📈 Business Intelligence & Analytics** | Dashboards & metrics | Interactive dashboards, KPI tracking |
| **🤖 AI Automation** | LLM-powered workflows | Automated triage, categorization, summarization |
| **🔒 Cyber Security** | Security & compliance | Threat modeling, risk assessment, policies |
| **✅ Quality Assurance** | Testing & quality | Test strategy, E2E tests, API tests |
| **🔧 Shared** | Common utilities | Reusable types, validators, constants |

---

## ✨ Key Features

- **📋 Contract-Driven Development** - Single source of truth for data structures, APIs, and user stories
- **🔌 True Independence** - Mock data generators enable work without dependencies
- **🤝 Optional Integration** - Connect disciplines when ready (not required for evaluation)
- **⚖️ Fair Evaluation** - Discipline-specific rubrics ensure equitable assessment
- **🏗️ Industry-Standard Patterns** - Monorepo, API-first, event-driven architecture
- **📚 Comprehensive Documentation** - Detailed guides for every discipline
- **🚀 Quick Setup** - Automated scripts get you started in minutes
- **🧪 Testable** - Built-in validation and testing frameworks

---

## 📁 Project Structure

```
grad-project-template/
├── contracts/              # 📜 Single source of truth
│   ├── schemas/           # JSON schemas, TypeScript types, OpenAPI specs
│   ├── mock-data/         # Realistic seed data (JSON, CSV)
│   ├── user-stories/      # US-01, US-02, US-03
│   ├── data-models/       # Business rules, field dictionary
│   └── integration-points/ # Cross-discipline contracts
│
├── packages/              # 📦 Discipline workspaces
│   ├── frontend/          # React + Vite + TypeScript
│   ├── backend/           # Express + MongoDB + TypeScript
│   ├── data-science/      # Python + scikit-learn + FastAPI
│   ├── ux-design/         # Research, flows, design system
│   ├── bia/              # Dashboards (Power BI, Tableau, etc.)
│   ├── ai-automation/     # LLM workflows (OpenAI/Anthropic)
│   ├── security/         # Threat models, policies
│   ├── qa/               # Playwright, Postman, test strategy
│   └── shared/           # Common TypeScript utilities
│
├── docs/                  # 📖 Comprehensive documentation
│   ├── GETTING-STARTED.md
│   ├── CONTRACTS.md
│   ├── INTEGRATION.md
│   ├── JUDGING-CRITERIA.md
│   ├── ARCHITECTURE.md
│   └── DISCIPLINE-GUIDES/ # Guides for each discipline
│
├── scripts/               # 🛠️ Automation scripts
│   ├── setup.sh
│   ├── setup-discipline.sh
│   ├── validate-contracts.js
│   └── seed-all-data.js
│
└── .github/               # 🔄 CI/CD workflows
    └── workflows/         # GitHub Actions
```

---

## 🚀 Quick Start

Get up and running in **3 simple steps**:

```bash
# 1. Clone the repository
git clone <repo-url>
cd grad-project-template

# 2. Run the initial setup
./scripts/setup.sh

# 3. Choose your discipline and set it up
./scripts/setup-discipline.sh <discipline-name>
# Options: frontend, backend, data-science, ux-design, bia, ai-automation, security, qa

# 4. Read your discipline-specific guide
# See docs/DISCIPLINE-GUIDES/<your-discipline>.md
```

**Next Steps:**
- 📖 Read the [Getting Started Guide](docs/GETTING-STARTED.md) for detailed onboarding
- 📋 Review [Understanding Contracts](docs/CONTRACTS.md) to learn the contract system
- 🎯 Check your discipline guide in [`docs/DISCIPLINE-GUIDES/`](docs/DISCIPLINE-GUIDES/)

---

## 📚 Documentation

### Core Documentation
- **[Getting Started Guide](docs/GETTING-STARTED.md)** - Detailed setup and onboarding
- **[Understanding Contracts](docs/CONTRACTS.md)** - How the contract system works
- **[Integration Guide](docs/INTEGRATION.md)** - How to integrate across disciplines
- **[Judging Criteria](docs/JUDGING-CRITERIA.md)** - Evaluation rubrics for each discipline
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and patterns
- **[FAQ](docs/FAQ.md)** - Common questions and troubleshooting
- **[Glossary](docs/GLOSSARY.md)** - Terms and definitions
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute

### Discipline-Specific Guides
Each discipline has a comprehensive guide with learning objectives, deliverables, and evaluation criteria:

- 💻 **[Software Engineering](docs/DISCIPLINE-GUIDES/software-engineering.md)** - Frontend & backend development
- 🎨 **[UX/UI Design](docs/DISCIPLINE-GUIDES/ux-ui.md)** - Research, flows, prototypes
- 📊 **[Data Science](docs/DISCIPLINE-GUIDES/data-science.md)** - ML models and analytics
- 📈 **[Business Intelligence & Analytics](docs/DISCIPLINE-GUIDES/bia.md)** - Dashboards and insights
- 🤖 **[AI Automation](docs/DISCIPLINE-GUIDES/ai-automation.md)** - LLM-powered workflows
- 🔒 **[Cyber Security](docs/DISCIPLINE-GUIDES/cyber-security.md)** - Threat modeling and policies
- ✅ **[Quality Assurance](docs/DISCIPLINE-GUIDES/qa.md)** - Testing strategies and execution

---

## 🎓 The Ops Triage Application

The **Ops Triage Application** is a support request management system similar to tools like Jira Service Desk, ServiceNow, or Zendesk. It helps IT/operations teams:

- 📥 **Receive and organize** support requests from end users
- 🎯 **Prioritize and categorize** requests efficiently
- 👥 **Assign work** to the right team members
- 📊 **Track metrics** like response times and resolution rates

### Core User Stories

The application is built around **3 primary user stories**:

1. **[US-01: Submit Request](contracts/user-stories/US-01-submit-request.md)** - End users submit support requests
2. **[US-02: Agent Triage](contracts/user-stories/US-02-agent-triage.md)** - Support agents review and triage requests
3. **[US-03: Manager Dashboard](contracts/user-stories/US-03-manager-dashboard.md)** - Managers view metrics and insights

Each user story is fully documented with acceptance criteria, mockups, and data requirements in the [`contracts/user-stories/`](contracts/user-stories/) directory.

---

## 🤝 How It Works

This template uses a **contract-driven approach** to enable independent work while maintaining consistency:

### 1. **Contracts Define the "What"**
   - Shared JSON schemas for data structures
   - OpenAPI specifications for REST APIs
   - Event schemas for async communication
   - User stories with clear acceptance criteria

### 2. **Each Discipline Builds Independently**
   - Use mock data from [`contracts/mock-data/`](contracts/mock-data/)
   - Build against defined contracts/schemas
   - Focus on your discipline's deliverables
   - No blockers waiting for other teams

### 3. **Optional Integration**
   - Connect disciplines when ready
   - Integration is **optional** for evaluation
   - Clear integration points documented
   - Event-driven architecture enables loose coupling

### 4. **Fair Evaluation**
   - Each discipline has specific rubrics
   - Evaluation criteria tailored to your role
   - Independent work evaluated fairly
   - Bonus points for successful integration

---

## 🛠 Available Scripts

Helpful automation scripts to streamline your workflow:

```bash
# Setup & Installation
./scripts/setup.sh                          # Initial project setup (installs dependencies)
./scripts/setup-discipline.sh <discipline>  # Setup specific discipline workspace

# Validation & Quality
node scripts/validate-contracts.js          # Validate all contract schemas
node scripts/check-deliverables.js <disc>   # Check your deliverables against rubric

# Data & Testing
node scripts/seed-all-data.js               # Seed mock data to all databases
./scripts/build-all.sh                      # Build all packages

# Documentation
./scripts/generate-docs.sh                  # Generate API documentation
```

**Discipline options:** `frontend`, `backend`, `data-science`, `ux-design`, `bia`, `ai-automation`, `security`, `qa`

---

## 📦 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling (optional)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **TypeScript** - Type safety

### Data Science
- **Python 3.11+** - Programming language
- **Jupyter** - Interactive notebooks
- **scikit-learn** - Machine learning
- **FastAPI** - ML model API

### Quality Assurance
- **Playwright** - E2E testing
- **Postman/REST Client** - API testing
- **Jest** - Unit testing

### AI Automation
- **OpenAI/Anthropic APIs** - LLM providers
- **TypeScript** - Workflow scripting

### Business Intelligence
- **Power BI / Tableau / Looker** - Dashboard tools
- **SQL** - Query language
- **Excel** - Spreadsheet analysis (optional)

### Infrastructure
- **pnpm Workspaces** - Monorepo management
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipelines

---

## 🎯 Learning Objectives

By completing this project, you will gain hands-on experience with:

### Technical Skills
- ✅ **Cross-functional collaboration** - Working with contracts and APIs
- ✅ **Contract-driven development** - API-first design patterns
- ✅ **Monorepo architecture** - Managing multi-package projects
- ✅ **API design & implementation** - RESTful services and OpenAPI
- ✅ **Testing strategies** - Unit, integration, E2E, and API testing
- ✅ **Security best practices** - OWASP Top 10, threat modeling
- ✅ **Data-driven decision making** - Analytics and metrics

### Professional Skills
- ✅ **Documentation** - Technical writing and handoff documents
- ✅ **Version control** - Git workflows and collaboration
- ✅ **CI/CD pipelines** - Automated testing and deployment
- ✅ **Code review** - Pull request templates and processes
- ✅ **Agile practices** - User stories, acceptance criteria

### Discipline-Specific Skills
Each discipline guide includes specific learning objectives aligned with industry standards and job requirements.

---

## 📋 Deliverables

Each discipline has **specific deliverables** that will be evaluated according to a detailed rubric. Deliverables vary by discipline but generally include:

- **Software Engineering:** Working frontend + backend with API integration
- **UX/UI Design:** User research, flows, prototypes, design system
- **Data Science:** Trained ML model, API, model card, notebooks
- **BI & Analytics:** Interactive dashboards, SQL queries, insights memo
- **AI Automation:** LLM-powered workflows, prompt engineering, validation
- **Cyber Security:** Threat model, risk assessment, security policies
- **Quality Assurance:** Test strategy, automated tests, bug reports

**For complete evaluation criteria, see:**
- 📊 [Judging Criteria](docs/JUDGING-CRITERIA.md) - Detailed rubrics for all disciplines
- 📖 [Discipline Guides](docs/DISCIPLINE-GUIDES/) - Specific requirements per discipline

---

## 🤔 Questions?

Need help getting started or have questions?

1. **Check the [FAQ](docs/FAQ.md)** - Common questions answered
2. **Review your discipline guide** - [Discipline-specific documentation](docs/DISCIPLINE-GUIDES/)
3. **Explore contract documentation** - [Understanding Contracts](docs/CONTRACTS.md)
4. **Read the Getting Started guide** - [Detailed onboarding](docs/GETTING-STARTED.md)

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

You are free to:
- ✅ Use this template for educational purposes
- ✅ Modify and adapt for your needs
- ✅ Share with other bootcamp cohorts
- ✅ Include in your portfolio

---

## 🙌 Acknowledgments

This template was created as a **bootcamp graduate project framework** to provide:
- A realistic, industry-relevant application scenario
- Clear separation of concerns across disciplines
- Fair evaluation mechanisms for diverse skill sets
- Hands-on experience with modern development practices

**Built for bootcamp graduates, by bootcamp graduates.** 🎓

For more information about the project concept and pedagogy, see the [project description](project-description.md).

---

## 🚀 Ready to Start?

1. Run `./scripts/setup.sh` to get started
2. Choose your discipline with `./scripts/setup-discipline.sh <discipline>`
3. Read your discipline guide in [`docs/DISCIPLINE-GUIDES/`](docs/DISCIPLINE-GUIDES/)
4. Start building! 🎉

**Good luck, and happy coding!** 💪
