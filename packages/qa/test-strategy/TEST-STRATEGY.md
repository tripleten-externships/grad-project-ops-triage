# Test Strategy

## Overview
This document defines the overall testing approach for the Request Management System.

---

## Testing Objectives

1. **Validate Functionality**: Ensure all user stories work as specified
2. **Prevent Regressions**: Catch bugs before production
3. **Ensure Quality**: Meet non-functional requirements (performance, accessibility, security)
4. **Enable Confidence**: Allow rapid, safe deployments

---

## Scope

### In Scope
- Functional testing of US-01, US-02, US-03
- API endpoint testing
- Frontend-backend integration
- Accessibility (WCAG Level AA)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness (iPhone, Android)
- Error handling and edge cases

### Out of Scope
- Performance/load testing (separate initiative)
- Security penetration testing (Security team)
- Infrastructure testing (DevOps)
- Third-party service testing (LLM APIs)

---

## Test Levels

### 1. Unit Tests (60% of test effort)
**Owner**: Development teams  
**Tool**: Jest (backend), React Testing Library (frontend)  
**Coverage Target**: 80% code coverage  
**Scope**:
- Individual functions
- Component logic
- Utility functions
- Validation logic

**Location**: Within each package (`packages/*/src/**/*.test.ts`)

---

### 2. Integration Tests (30% of test effort)
**Owner**: QA + Dev teams  
**Tools**: Playwright, Postman, REST Client  
**Scope**:
- API endpoint functionality
- Database interactions
- Frontend-backend integration
- AI automation integration

**Location**: `packages/qa/api-tests/`

---

### 3. E2E Tests (10% of test effort)
**Owner**: QA team  
**Tool**: Playwright  
**Scope**:
- Critical user flows (happy path)
- US-01: Submit request end-to-end
- US-02: Agent triage flow
- US-03: Manager view dashboard

**Location**: `packages/qa/e2e-tests/`

---

## Test Types

### Functional Testing
- ✅ Happy path scenarios
- ✅ Alternative paths (optional fields, different inputs)
- ✅ Error handling (validation failures, network errors)
- ✅ Edge cases (boundary values, empty states)

### Non-Functional Testing
- ✅ **Accessibility**: WCAG AA compliance
- ✅ **Usability**: Intuitive navigation, clear error messages
- ⚠️ **Performance**: Basic response time checks (< 2s page load)
- ❌ **Load Testing**: Not in scope for MVP
- ⚠️ **Security**: Basic checks (XSS, input validation) - detailed testing by Security team

### Regression Testing
- Automated suite runs on every PR
- Full regression before releases

---

## Test Environment

### Development
- **URL**: http://localhost:5173 (frontend), http://localhost:3000 (backend)
- **Database**: Local PostgreSQL/MySQL with mock data
- **Purpose**: Developer testing

### Staging
- **URL**: https://staging.request-mgmt.example.com
- **Database**: Staging database (anonymized prod-like data)
- **Purpose**: QA testing, stakeholder demos

### Production
- **URL**: https://request-mgmt.example.com
- **Monitoring**: Only monitoring, no active testing
- **Smoke Tests**: Post-deployment validation

---

## Entry & Exit Criteria

### Entry Criteria (Start Testing)
- [ ] Feature code complete
- [ ] Unit tests passing
- [ ] Deployed to staging environment
- [ ] Test data available
- [ ] Test cases written

### Exit Criteria (Release to Production)
- [ ] All HIGH/CRITICAL bugs resolved
- [ ] ≥ 80% code coverage
- [ ] All acceptance criteria met
- [ ] E2E tests passing (smoke suite)
- [ ] Accessibility tests passing
- [ ] Stakeholder sign-off

---

## Defect Management

### Severity Classification
- **P0 (Critical)**: System down, data loss, security breach
- **P1 (High)**: Major feature broken, no workaround
- **P2 (Medium)**: Minor issue, workaround available
- **P3 (Low)**: Cosmetic, documentation

### Bug Lifecycle
1. **New**: Bug reported
2. **Triaged**: Severity assigned, owner identified
3. **In Progress**: Developer working on fix
4. **Fixed**: Code deployed to staging
5. **Verified**: QA confirms fix
6. **Closed**: Fix in production

### Bug Template
See `docs/BUG-TEMPLATE.md`

---

## Test Automation Strategy

### What to Automate
- ✅ Repetitive tests (regression suite)
- ✅ Critical user flows (E2E)
- ✅ API contracts
- ✅ Accessibility checks

### What NOT to Automate
- ❌ One-off exploratory tests
- ❌ Visual design reviews (UX team)
- ❌ Usability testing (user research)

### Automation Ratio (Target)
- 80% automated (unit + integration + E2E)
- 20% manual (exploratory, edge cases)

---

## Test Data Strategy

### Mock Data
- Use `contracts/mock-data/` for development/testing
- Generate additional data with `data-generator.js`

### Test Users
```json
{
  "requester": { "email": "requester@test.com", "password": "Test123!", "role": "requester" },
  "agent": { "email": "agent@test.com", "password": "Test123!", "role": "agent" },
  "manager": { "email": "manager@test.com", "password": "Test123!", "role": "manager" },
  "admin": { "email": "admin@test.com", "password": "Test123!", "role": "admin" }
}
```

### Data Reset
- Reset database before each E2E test run
- Use database transactions for isolation

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flaky E2E tests | Blocks CI/CD | Use explicit waits, retry logic |
| Test environment unstable | Delays testing | Automated environment provisioning |
| Insufficient test coverage | Bugs in production | Code coverage tracking, mandated tests |
| Slow test execution | Slows development | Parallelize tests, optimize |

---

## Testing Tools

| Type | Tool | Purpose |
|------|------|---------|
| E2E | Playwright | Browser automation |
| API | Postman, REST Client | API testing |
| Accessibility | axe-core, Lighthouse | WCAG compliance |
| Unit | Jest, React Testing Library | Component/function tests |
| Code Coverage | Istanbul/nyc | Coverage reporting |
| CI/CD | GitHub Actions / GitLab CI | Automated testing |

---

## Metrics & Reporting

### Track
- Test execution rate (pass/fail/skip)
- Code coverage percentage
- Bug count by severity
- Mean time to detect (MTTD)
- Mean time to resolve (MTTR)

### Reports
- Daily: Test execution summary
- Weekly: Bug status, coverage trends
- Per-release: Test sign-off report

---

## Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| **QA Lead** | Define test strategy, review coverage |
| **QA Engineer** | Write test cases, execute tests, log bugs |
| **SDET** | Build automation framework, write E2E tests |
| **Developer** | Write unit tests, fix bugs, support QA |
| **Product Owner** | Define acceptance criteria, sign off |

---

## Test Schedule

### Sprint Cycle (2 weeks)
- **Week 1**: Dev writes code + unit tests
- **Week 2**: QA writes test cases, executes, logs bugs
- **Week 2 (End)**: Bug fixes, regression, sign-off

### Continuous
- Unit tests: On every commit
- API tests: On every PR
- E2E tests (smoke): On every merge to main
- E2E tests (full): Nightly

---

## References

- Test Cases: `test-cases/`
- E2E Tests: `e2e-tests/`
- Bug Template: `docs/BUG-TEMPLATE.md`
- Traceability Matrix: `test-cases/traceability-matrix.md`
- User Stories: `contracts/user-stories/`
