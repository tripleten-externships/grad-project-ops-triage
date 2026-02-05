#!/bin/bash

# setup-discipline.sh - Setup specific discipline workspace
# Usage: ./scripts/setup-discipline.sh <discipline-name>

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display error and exit
error_exit() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

# Function to display success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to display info
info() {
    echo -e "${BLUE}➜${NC} $1"
}

# Check if discipline argument is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Discipline name required${NC}"
    echo ""
    echo "Usage: ./scripts/setup-discipline.sh <discipline-name>"
    echo ""
    echo "Available disciplines:"
    echo "  - ux-design"
    echo "  - frontend"
    echo "  - backend"
    echo "  - data-science"
    echo "  - ai-automation"
    echo "  - qa"
    echo "  - security"
    echo "  - bia"
    exit 1
fi

DISCIPLINE=$1

# Define valid disciplines and their package paths
declare -A DISCIPLINES=(
    ["ux-design"]="packages/ux-design"
    ["frontend"]="packages/frontend"
    ["backend"]="packages/backend"
    ["data-science"]="packages/data-science"
    ["ai-automation"]="packages/ai-automation"
    ["qa"]="packages/qa"
    ["security"]="packages/security"
    ["bia"]="packages/bia"
)

# Validate discipline
if [ -z "${DISCIPLINES[$DISCIPLINE]}" ]; then
    error_exit "Invalid discipline: $DISCIPLINE"
fi

PACKAGE_PATH="${DISCIPLINES[$DISCIPLINE]}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Setting up: $DISCIPLINE${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if package directory exists
if [ ! -d "$PACKAGE_PATH" ]; then
    error_exit "Package directory not found: $PACKAGE_PATH"
fi

# Install dependencies for the specific workspace
echo -e "${BLUE}Installing dependencies...${NC}"
if pnpm install --filter "$DISCIPLINE"; then
    success "Dependencies installed for $DISCIPLINE"
else
    error_exit "Failed to install dependencies"
fi

echo ""

# Display discipline-specific setup instructions
case $DISCIPLINE in
    "ux-design")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  UX Design Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Review user research: packages/ux-design/research/"
        info "Check personas: packages/ux-design/research/personas.md"
        info "View user flows: packages/ux-design/user-flows/"
        info "Design system: packages/ux-design/design-system/"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Conduct user research and document findings"
        echo "  2. Create user personas and problem statements"
        echo "  3. Design user flows for key scenarios"
        echo "  4. Build prototypes (link in prototypes/figma-link.md)"
        echo "  5. Document accessibility guidelines"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/ux-design/README.md"
        info "Design decisions: packages/ux-design/docs/DESIGN-DECISIONS.md"
        ;;
    
    "frontend")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  Frontend Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Copy .env.example to .env: cp packages/frontend/.env.example packages/frontend/.env"
        info "Start dev server: cd packages/frontend && pnpm dev"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Review design mockups from UX team"
        echo "  2. Implement UI components using React + TypeScript"
        echo "  3. Integrate with backend API"
        echo "  4. Add form validation and error handling"
        echo "  5. Ensure responsive design and accessibility"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/frontend/README.md"
        info "Architecture: packages/frontend/docs/ARCHITECTURE.md"
        info "Integration: packages/frontend/docs/INTEGRATION.md"
        ;;
    
    "backend")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  Backend Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Copy .env.example to .env: cp packages/backend/.env.example packages/backend/.env"
        info "Start MongoDB: docker-compose up -d"
        info "Seed database: cd packages/backend && node src/utils/seed-database.ts"
        info "Start server: cd packages/backend && pnpm dev"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Implement REST API endpoints"
        echo "  2. Set up MongoDB models and schemas"
        echo "  3. Add authentication and authorization"
        echo "  4. Implement validation middleware"
        echo "  5. Add webhook integration for AI/DS services"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/backend/README.md"
        info "API docs: packages/backend/docs/API.md"
        info "Architecture: packages/backend/docs/ARCHITECTURE.md"
        ;;
    
    "data-science")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  Data Science Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Install Python dependencies: cd packages/data-science && pip install -r requirements.txt"
        info "Copy .env.example to .env: cp packages/data-science/.env.example packages/data-science/.env"
        info "Start Jupyter: cd packages/data-science && jupyter lab"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Explore mock data in notebooks/01-eda.ipynb"
        echo "  2. Engineer features for priority prediction"
        echo "  3. Train classification model"
        echo "  4. Evaluate model performance"
        echo "  5. Deploy prediction API (api/app.py)"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/data-science/README.md"
        info "Model card: packages/data-science/docs/MODEL-CARD.md"
        info "Integration: packages/data-science/docs/INTEGRATION.md"
        ;;
    
    "ai-automation")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  AI Automation Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Copy .env.example to .env: cp packages/ai-automation/.env.example packages/ai-automation/.env"
        info "Add OpenAI API key to .env file"
        info "Review prompts: packages/ai-automation/prompts/"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Review and refine LLM prompts"
        echo "  2. Implement automation workflows"
        echo "  3. Set confidence thresholds for auto-triage"
        echo "  4. Add guardrails for content safety"
        echo "  5. Test integration with backend"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/ai-automation/README.md"
        info "Workflow: packages/ai-automation/docs/WORKFLOW.md"
        info "Integration: packages/ai-automation/docs/INTEGRATION.md"
        ;;
    
    "qa")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  QA Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Install Playwright browsers: cd packages/qa && pnpm exec playwright install"
        info "Review test strategy: packages/qa/test-strategy/TEST-STRATEGY.md"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Document test cases in test-cases/"
        echo "  2. Write E2E tests using Playwright"
        echo "  3. Create API tests using REST client"
        echo "  4. Run tests: cd packages/qa && pnpm test"
        echo "  5. Document bugs using BUG-TEMPLATE.md"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/qa/README.md"
        info "Test guide: packages/qa/docs/TEST-GUIDE.md"
        info "Bug template: packages/qa/docs/BUG-TEMPLATE.md"
        ;;
    
    "security")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  Security Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Review threat model: packages/security/threat-model/"
        info "Check OWASP checklist: packages/security/checklists/owasp-top-10.md"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Complete STRIDE threat analysis"
        echo "  2. Identify attack vectors and mitigations"
        echo "  3. Document authentication policy"
        echo "  4. Review OWASP Top 10 checklist"
        echo "  5. Write security summary document"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/security/README.md"
        info "Security summary: packages/security/docs/SECURITY-SUMMARY.md"
        ;;
    
    "bia")
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  BIA Setup Complete!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${BLUE}Getting Started:${NC}"
        echo ""
        info "Load seed data: node packages/bia/data/load-seed-data.js"
        info "Review SQL queries: packages/bia/queries/"
        echo ""
        echo -e "${BLUE}Key Tasks:${NC}"
        echo "  1. Write SQL queries for key metrics"
        echo "  2. Build dashboards (choose your tool)"
        echo "  3. Analyze request volume and trends"
        echo "  4. Calculate SLA compliance metrics"
        echo "  5. Document insights and recommendations"
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        info "README: packages/bia/README.md"
        info "Dashboard guide: packages/bia/docs/DASHBOARD-GUIDE.md"
        info "Metric definitions: packages/bia/docs/METRIC-DEFINITIONS.md"
        info "Insights memo: packages/bia/docs/INSIGHTS-MEMO.md"
        ;;
esac

echo ""
echo -e "${BLUE}Shared Resources:${NC}"
info "Data contracts: contracts/schemas/"
info "Mock data: contracts/mock-data/"
info "User stories: contracts/user-stories/"
echo ""
echo -e "${GREEN}Ready to start! 🚀${NC}"
echo ""
