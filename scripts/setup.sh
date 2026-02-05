#!/bin/bash

# setup.sh - Initial repository setup script
# This script checks for required tools, installs dependencies, and sets up the project

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Graduate Project Template Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check version
check_version() {
    local tool=$1
    local version=$2
    echo -e "${GREEN}✓${NC} $tool: $version"
}

# Function to display error
error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to display warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to display success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check for required tools
echo -e "${BLUE}Checking required tools...${NC}"
echo ""

MISSING_TOOLS=()

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    check_version "Node.js" "$NODE_VERSION"
else
    error "Node.js is not installed"
    MISSING_TOOLS+=("Node.js")
fi

# Check pnpm
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm --version)
    check_version "pnpm" "$PNPM_VERSION"
else
    error "pnpm is not installed"
    MISSING_TOOLS+=("pnpm")
fi

# Check Python (optional for data science work)
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    check_version "Python" "$PYTHON_VERSION"
else
    warning "Python 3 is not installed (required for data-science package)"
fi

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version)
    check_version "Git" "$GIT_VERSION"
else
    warning "Git is not installed"
fi

# Check Docker (optional)
if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    check_version "Docker" "$DOCKER_VERSION"
else
    warning "Docker is not installed (optional, used for backend deployment)"
fi

echo ""

# Exit if missing required tools
if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo -e "${RED}Missing required tools:${NC}"
    for tool in "${MISSING_TOOLS[@]}"; do
        echo "  - $tool"
    done
    echo ""
    echo -e "${YELLOW}Installation instructions:${NC}"
    echo "  Node.js: https://nodejs.org/"
    echo "  pnpm: npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo -e "${BLUE}Installing workspace dependencies...${NC}"
echo ""

if pnpm install; then
    success "Dependencies installed successfully"
else
    error "Failed to install dependencies"
    exit 1
fi

echo ""

# Ask about seeding data
echo -e "${BLUE}Do you want to seed mock data? (y/N)${NC}"
read -r SEED_DATA

if [[ "$SEED_DATA" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Seeding mock data...${NC}"
    if node scripts/seed-all-data.js; then
        success "Mock data seeded successfully"
    else
        warning "Failed to seed mock data (you can run 'node scripts/seed-all-data.js' later)"
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "  1. Review the project structure in TEMPLATE-STRUCTURE.md"
echo "  2. Read the project description in project-description.md"
echo "  3. Check contracts/README.md for shared data contracts"
echo ""
echo -e "${BLUE}Discipline-Specific Setup:${NC}"
echo ""
echo "  Run setup for your specific discipline:"
echo "    ./scripts/setup-discipline.sh ux-design"
echo "    ./scripts/setup-discipline.sh frontend"
echo "    ./scripts/setup-discipline.sh backend"
echo "    ./scripts/setup-discipline.sh data-science"
echo "    ./scripts/setup-discipline.sh ai-automation"
echo "    ./scripts/setup-discipline.sh qa"
echo "    ./scripts/setup-discipline.sh security"
echo "    ./scripts/setup-discipline.sh bia"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo ""
echo "  Validate contracts:  node scripts/validate-contracts.js"
echo "  Build all packages:  ./scripts/build-all.sh"
echo "  Check deliverables:  node scripts/check-deliverables.js <discipline>"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
