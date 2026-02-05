#!/bin/bash

# generate-docs.sh - Generate project documentation
# This script generates various documentation artifacts

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Documentation Generation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to display success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to display info
info() {
    echo -e "${BLUE}➜${NC} $1"
}

# Function to display warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Generate table of contents for README
echo -e "${BLUE}Generating documentation...${NC}"
echo ""

# Count markdown files
MD_FILES=$(find . -name "*.md" -type f | wc -l | tr -d ' ')
info "Found $MD_FILES markdown files in project"

# Check for OpenAPI spec
if [ -f "contracts/schemas/api-contract.yml" ]; then
    info "OpenAPI spec found: contracts/schemas/api-contract.yml"
    
    # Check if swagger-cli or redoc-cli is available
    if command -v redoc-cli &> /dev/null; then
        echo ""
        info "Generating API documentation with ReDoc..."
        
        # Create docs directory if it doesn't exist
        mkdir -p docs/api
        
        # Generate HTML documentation
        redoc-cli bundle contracts/schemas/api-contract.yml -o docs/api/index.html
        success "API documentation generated: docs/api/index.html"
    else
        warning "redoc-cli not installed. Skipping API doc generation."
        echo "    Install with: npm install -g redoc-cli"
    fi
else
    warning "No OpenAPI spec found at contracts/schemas/api-contract.yml"
fi

echo ""

# Generate discipline documentation index
echo -e "${BLUE}Creating discipline documentation index...${NC}"
echo ""

DOC_INDEX="docs/DISCIPLINE-INDEX.md"
mkdir -p docs

cat > "$DOC_INDEX" << 'EOF'
# Discipline Documentation Index

This document provides links to documentation for each discipline in the project.

## 📋 Table of Contents

- [UX Design](#ux-design)
- [Frontend Development](#frontend-development)
- [Backend Development](#backend-development)
- [Data Science](#data-science)
- [AI Automation](#ai-automation)
- [Quality Assurance](#quality-assurance)
- [Security](#security)
- [Business Intelligence & Analytics](#business-intelligence--analytics)

---

## UX Design

**Location:** `packages/ux-design/`

### Key Documents
- [README](../packages/ux-design/README.md) - Overview and getting started
- [Design Decisions](../packages/ux-design/docs/DESIGN-DECISIONS.md) - Rationale for design choices
- [Personas](../packages/ux-design/research/personas.md) - User personas
- [Problem Framing](../packages/ux-design/research/problem-framing.md) - Problem definition
- [A11y Guidelines](../packages/ux-design/accessibility/a11y-guidelines.md) - Accessibility standards

### Deliverables
- User research and personas
- User flows (`.mmd` diagram files)
- Figma prototypes (linked)
- Design system documentation

---

## Frontend Development

**Location:** `packages/frontend/`

### Key Documents
- [README](../packages/frontend/README.md) - Setup and getting started
- [Architecture](../packages/frontend/docs/ARCHITECTURE.md) - Frontend architecture
- [Integration](../packages/frontend/docs/INTEGRATION.md) - API integration guide

### Deliverables
- React/TypeScript application
- UI components
- API service integration
- Responsive design

---

## Backend Development

**Location:** `packages/backend/`

### Key Documents
- [README](../packages/backend/README.md) - Setup and getting started
- [API Documentation](../packages/backend/docs/API.md) - API endpoints
- [Architecture](../packages/backend/docs/ARCHITECTURE.md) - Backend architecture

### Deliverables
- Express/Node.js REST API
- MongoDB data models
- Authentication & authorization
- Webhook integrations

---

## Data Science

**Location:** `packages/data-science/`

### Key Documents
- [README](../packages/data-science/README.md) - Setup and getting started
- [Model Card](../packages/data-science/docs/MODEL-CARD.md) - Model documentation
- [Integration](../packages/data-science/docs/INTEGRATION.md) - API integration

### Deliverables
- Jupyter notebooks (EDA, training, evaluation)
- Trained ML models
- Prediction API
- Model performance metrics

---

## AI Automation

**Location:** `packages/ai-automation/`

### Key Documents
- [README](../packages/ai-automation/README.md) - Overview and setup
- [Workflow](../packages/ai-automation/docs/WORKFLOW.md) - Automation workflow
- [Integration](../packages/ai-automation/docs/INTEGRATION.md) - Integration guide
- [Guardrails](../packages/ai-automation/prompts/guardrails.md) - Safety guidelines

### Deliverables
- LLM prompts for triage automation
- Automation workflows
- Confidence thresholds
- Safety guardrails

---

## Quality Assurance

**Location:** `packages/qa/`

### Key Documents
- [README](../packages/qa/README.md) - QA overview
- [Test Strategy](../packages/qa/test-strategy/TEST-STRATEGY.md) - Testing approach
- [Test Guide](../packages/qa/docs/TEST-GUIDE.md) - How to write tests
- [Bug Template](../packages/qa/docs/BUG-TEMPLATE.md) - Bug reporting format

### Deliverables
- Test cases documentation
- E2E tests (Playwright)
- API tests
- Bug reports

---

## Security

**Location:** `packages/security/`

### Key Documents
- [README](../packages/security/README.md) - Security overview
- [Security Summary](../packages/security/docs/SECURITY-SUMMARY.md) - Security analysis
- [STRIDE Analysis](../packages/security/threat-model/STRIDE-analysis.md) - Threat modeling
- [Attack Vectors](../packages/security/threat-model/attack-vectors.md) - Potential attacks
- [OWASP Checklist](../packages/security/checklists/owasp-top-10.md) - Security checklist

### Deliverables
- Threat model (STRIDE)
- Attack vector analysis
- Security policies
- OWASP Top 10 checklist

---

## Business Intelligence & Analytics

**Location:** `packages/bia/`

### Key Documents
- [README](../packages/bia/README.md) - BIA overview
- [Metric Definitions](../packages/bia/docs/METRIC-DEFINITIONS.md) - Key metrics
- [Dashboard Guide](../packages/bia/docs/DASHBOARD-GUIDE.md) - Dashboard usage
- [Insights Memo](../packages/bia/docs/INSIGHTS-MEMO.md) - Analysis and recommendations

### Deliverables
- SQL queries for metrics
- Dashboards (Tableau/Power BI/Looker/Spreadsheet)
- Metric definitions
- Business insights

---

## Shared Resources

All disciplines should reference the shared contracts:

- **Schemas:** `contracts/schemas/` - Data contracts and API specs
- **Mock Data:** `contracts/mock-data/` - Sample data for development
- **User Stories:** `contracts/user-stories/` - Requirements and scenarios
- **Data Models:** `contracts/data-models/` - Business rules and definitions

---

*Generated by scripts/generate-docs.sh*
EOF

success "Created discipline documentation index: $DOC_INDEX"

echo ""

# Future enhancements placeholder
echo -e "${BLUE}Future documentation tasks:${NC}"
echo ""
info "Generate API docs from OpenAPI spec (install redoc-cli)"
info "Auto-generate TypeScript documentation (install typedoc)"
info "Generate database schema diagrams"
info "Create project architecture diagrams"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Documentation Generation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
success "Documentation resources updated"
echo ""
info "View discipline index: docs/DISCIPLINE-INDEX.md"
echo ""
