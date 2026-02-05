#!/bin/bash

# build-all.sh - Build all packages with build scripts
# This script runs build commands for all packages that have them

set +e  # Don't exit on error, we want to report all failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Building All Packages${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to display success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to display error
error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to display info
info() {
    echo -e "${BLUE}➜${NC} $1"
}

# Track build results
TOTAL_BUILDS=0
SUCCESSFUL_BUILDS=0
FAILED_BUILDS=0
declare -a FAILED_PACKAGES

# Define packages that have build scripts
# Based on typical TypeScript packages in the project
BUILDABLE_PACKAGES=(
    "frontend"
    "backend"
    "shared"
)

# Check if package has a build script
has_build_script() {
    local package_name=$1
    local package_json="packages/$package_name/package.json"
    
    if [ ! -f "$package_json" ]; then
        return 1
    fi
    
    # Check if build script exists in package.json
    if grep -q '"build"' "$package_json"; then
        return 0
    else
        return 1
    fi
}

# Build a package
build_package() {
    local package_name=$1
    
    echo -e "${BLUE}Building: $package_name${NC}"
    
    # Run build using pnpm filter
    if pnpm --filter "$package_name" build 2>&1; then
        success "$package_name built successfully"
        ((SUCCESSFUL_BUILDS++))
        return 0
    else
        error "$package_name build failed"
        FAILED_PACKAGES+=("$package_name")
        ((FAILED_BUILDS++))
        return 1
    fi
}

# Build all packages
for package in "${BUILDABLE_PACKAGES[@]}"; do
    if has_build_script "$package"; then
        ((TOTAL_BUILDS++))
        build_package "$package"
        echo ""
    else
        info "Skipping $package (no build script)"
        echo ""
    fi
done

# Also try building using pnpm workspace build command
echo -e "${BLUE}Running workspace-wide build...${NC}"
echo ""

if pnpm build 2>&1; then
    success "Workspace build completed"
else
    error "Workspace build had some failures"
fi

echo ""

# Print summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Build Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $TOTAL_BUILDS -eq 0 ]; then
    info "No packages with build scripts found"
    echo ""
    info "Packages checked: ${BUILDABLE_PACKAGES[*]}"
    echo ""
    exit 0
fi

echo "  Total packages: $TOTAL_BUILDS"
echo "  Successful:     $SUCCESSFUL_BUILDS"
echo "  Failed:         $FAILED_BUILDS"
echo ""

if [ $FAILED_BUILDS -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  All Builds Successful! ✓${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    success "All $SUCCESSFUL_BUILDS package(s) built successfully"
    echo ""
    exit 0
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}  Some Builds Failed ✗${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    error "Failed packages:"
    for pkg in "${FAILED_PACKAGES[@]}"; do
        echo "  - $pkg"
    done
    echo ""
    info "Review the build errors above and fix any issues"
    echo ""
    exit 1
fi
