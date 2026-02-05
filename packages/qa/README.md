# QA Package

## Overview
This package provides testing strategy, test cases, and end-to-end test scaffolding for the Request Management System.

## Role of QA Team
- **Test Planning**: Define testing approach and strategy
- **Test Case Development**: Create detailed test cases for user stories
- **Test Automation**: Build E2E, API, and accessibility tests
- **Bug Reporting**: Document and track defects
- **Quality Assurance**: Ensure system meets requirements

---

## Team Deliverables

### Phase 1: Test Planning (Week 1)
- [ ] Test strategy document (`test-strategy/TEST-STRATEGY.md`)
- [ ] Test coverage plan (`test-strategy/test-pyramid.md`)
- [ ] Traceability matrix (`test-cases/traceability-matrix.md`)

### Phase 2: Test Case Development (Week 2-3)
- [ ] US-01 test cases (`test-cases/submit-request.md`)
- [ ] US-02 test cases (`test-cases/agent-triage.md`)
- [ ] US-03 test cases (`test-cases/manager-dashboard.md`)

### Phase 3: Test Automation (Week 3-5)
- [ ] E2E tests with Playwright (`e2e-tests/tests/`)
- [ ] API tests (`api-tests/`)
- [ ] Accessibility tests (`accessibility-tests/`)

### Phase 4: Execution & Reporting (Week 5-6)
- [ ] Execute test suite
- [ ] Log bugs (`docs/BUG-TEMPLATE.md`)
- [ ] Track to resolution
- [ ] Final test report

---

## Project Structure

```
qa/
├── test-strategy/           # Overall testing approach
├── test-cases/              # Manual test cases
├── api-tests/               # API test collections
├── e2e-tests/               # Playwright E2E tests
├── accessibility-tests/     # A11y testing
├── docs/                    # Test guide, bug template
├── package.json             # Playwright dependencies
└── playwright.config.ts     # Playwright configuration
```

---

## Quick Start

### Installation
```bash
cd packages/qa
npm install
npx playwright install  # Install browsers
```

### Run Tests
```bash
# All E2E tests
npm test

# Specific test file
npm test submit-flow

# Headed mode (see browser)
npm test -- --headed

# Debug mode
npm test -- --debug

# API tests (REST Client)
# Open api-tests/rest-client/requests.http in VS Code with REST Client extension
```

---

## Testing Approach

### Test Pyramid

```
        /\
       /  \  E2E Tests (10%)
      /    \  ↑ Slow, brittle, expensive
     /------\
    /        \  Integration Tests (30%)
   /          \  ↑ Medium speed
  /------------\
 /              \  Unit Tests (60%)
/______________\  ↑ Fast, reliable, cheap
```

**Strategy**:
- **Unit Tests**: 60% coverage (handled by dev teams in packages)
- **Integration Tests**: 30% (API tests, component tests)
- **E2E Tests**: 10% (critical user flows only)

---

## Test Scope

### In Scope
- User story acceptance criteria
- API functionality
- Frontend-backend integration
- Accessibility (WCAG AA)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Error handling

### Out of Scope (for MVP)
- Performance/load testing (separate effort)
- Security penetration testing (Security team)
- Mobile app testing (web only)
- Localization (English only)

---

## Test Types

### 1. E2E Tests (Playwright)
- **Purpose**: Validate end-to-end user flows
- **Tool**: Playwright
- **Scope**: US-01, US-02, US-03 happy paths
- **Location**: `e2e-tests/tests/`

### 2. API Tests
- **Purpose**: Validate backend endpoints
- **Tools**: Postman, VS Code REST Client
- **Scope**: All API routes
- **Location**: `api-tests/`

### 3. Accessibility Tests
- **Purpose**: WCAG compliance
- **Tools**: axe-core, Lighthouse
- **Scope**: All pages
- **Location**: `accessibility-tests/`

### 4. Manual Tests
- **Purpose**: Exploratory, edge cases
- **Documentation**: Test cases in `test-cases/`

---

## Test Coverage

| User Story | Unit Tests | Integration | E2E | Accessibility |
|------------|-----------|-------------|-----|---------------|
| US-01: Submit Request | Backend | API | ✅ | ✅ |
| US-02: Agent Triage | Backend | API | ✅ | ✅ |
| US-03: Manager Dashboard | Backend | API | ✅ | ✅ |

**Target Coverage**: 80% code coverage for backend, critical path coverage for frontend

---

## Defect Management

### Bug Severity Levels
- **Critical (P0)**: System unusable, data loss
- **High (P1)**: Major feature broken
- **Medium (P2)**: Minor feature issue, workaround exists
- **Low (P3)**: Cosmetic, documentation

### Bug Template
See `docs/BUG-TEMPLATE.md` for standardized bug reports.

---

## CI/CD Integration

### Pre-Commit
```bash
npm run lint
npm run type-check
```

### CI Pipeline
```yaml
- Run unit tests (all packages)
- Run API tests
- Run E2E tests (smoke suite)
- Run accessibility tests
- Generate coverage report
```

### Nightly
```yaml
- Full E2E regression suite
- Cross-browser testing
- Accessibility full scan
```

---

## References

- User Stories: `contracts/user-stories/`
- Frontend: `packages/frontend/`
- Backend: `packages/backend/`
- UX Design: `packages/ux-design/` (for expected UX)
- Playwright Docs: https://playwright.dev/

---

## Support

For QA questions:
- **Test Strategy**: QA lead
- **Test Automation**: SDET/QA engineer
- **Bug Triage**: Product owner + QA lead

---

## Next Steps

1. Review test strategy
2. Write test cases for US-01, US-02, US-03
3. Set up Playwright
4. Implement E2E tests
5. Run test suite and log bugs
