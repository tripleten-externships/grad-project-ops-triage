# QA Test Execution Guide

## Overview
This guide explains how to run tests for the Request Management System.

---

## Prerequisites

### Software Required
- Node.js 18+
- npm or pnpm
- Git
- VS Code (recommended for REST Client tests)

### Setup
```bash
cd packages/qa
npm install
npx playwright install  # Install browsers (Chrome, Firefox, WebKit)
```

---

## Running Tests

### E2E Tests (Playwright)

**All tests**:
```bash
npm test
```

**Specific test file**:
```bash
npm test submit-flow
npm test triage-flow
npm test insights-flow
```

**Headed mode (see browser)**:
```bash
npm test -- --headed
```

**Debug mode (step through)**:
```bash
npm test -- --debug
```

**UI mode (interactive)**:
```bash
npm run test:ui
```

**Specific browser**:
```bash
npm test -- --project=chromium
npm test -- --project=firefox
npm test -- --project=webkit
```

**Generate test code** (record actions):
```bash
npm run test:codegen
```

---

### API Tests

**Option 1: VS Code REST Client**
1. Install extension: `humao.rest-client`
2. Open `api-tests/rest-client/requests.http`
3. Click "Send Request" above each request
4. Review response

**Option 2: Postman**
1. Import `api-tests/postman/collection.json`
2. Set environment variables (baseUrl, apiKey)
3. Run collection

**Option 3: Command Line** (curl):
```bash
# Create request
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer  YOUR_TOKEN" \
  -d '{"title":"Test","description":"Test desc","category":"IT Support","priority":"P2"}'
```

---

### Accessibility Tests

**Lighthouse** (Chrome DevTools):
1. Open page in Chrome
2. DevTools → Lighthouse tab
3. Select "Accessibility"
4. Click "Generate report"
5. Target: Score ≥ 90

**axe-core** (automated):
```typescript
// In Playwright test
import { injectAxe, checkA11y } from 'axe-playwright';

test('accessibility check', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

---

## Test Reports

### View Playwright HTML Report
```bash
npm run test:report
```

Opens interactive HTML report showing:
- Test results
- Screenshots on failure
- Videos on failure
- Traces

### CI/CD Reports
- JUnit XML: `test-results/junit.xml`
- HTML Report: `playwright-report/index.html`

---

## Writing New Tests

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup: navigate, login, etc.
    await page.goto('/');
  });
  
  test('should do something', async ({ page }) => {
    // Arrange: set up test data
    
    // Act: perform action
    await page.click('[data-testid="button"]');
    
    // Assert: verify result
    await expect(page.locator('[data-testid="message"]')).toBeVisible();
  });
  
});
```

### Best Practices
1. **Use data-testid**: `<button data-testid="submit-button">`
2. **Explicit waits**: `await expect(locator).toBeVisible()`
3. **Isolate tests**: Each test independent, no shared state
4. **Descriptive names**: `test('should show error when title is empty')`
5. **Arrange-Act-Assert**: Clear structure

---

## Debugging Tests

### Debug Single Test
```bash
npm test submit-flow -- --debug
```

### Debug in VS Code
1. Add breakpoint in test file
2. Run "Debug Current Test" from CodeLens
3. Step through code

### Inspect Element
```typescript
await page.pause();  // Pauses execution, opens Playwright Inspector
```

### Screenshots
```typescript
await page.screenshot({ path: 'debug.png' });
```

### Console Logs
```typescript
page.on('console', msg => console.log(msg.text()));
```

---

## CI/CD Integration

### GitHub Actions Example

``yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Data Management

### Reset Database
```bash
# Before test suite
npm run db:reset
npm run db:seed  # Load test data
```

### Test Users
See `README.md` for test user credentials.

### Mock Data
Use `contracts/mock-data/` for consistent test data.

---

## Troubleshooting

### Tests failing locally but pass in CI
- Different Node versions
- Missing environment variables
- Database state differences

**Fix**: Use `.env.test` file, ensure clean state

### Flaky tests (intermittent failures)
- Race conditions
- Timing issues
- Network delays

**Fix**:
- Use `await expect().toBeVisible()` instead of `waitForTimeout`
- Increase timeout for slow operations
- Add retry logic

### Browser not found
```bash
npx playwright install
```

### Port already in use
- Kill process using port 5173/3000
- OR change port in `playwright.config.ts`

---

## Test Coverage

### Backend Coverage
```bash
cd packages/backend
npm run test:coverage
```

Opens HTML coverage report.

**Target**: ≥ 80% coverage

### Frontend Coverage
```bash
cd packages/frontend
npm run test:coverage
```

---

## References

- Playwright Docs: https://playwright.dev/
- Test Strategy: `test-strategy/TEST-STRATEGY.md`
- Test Cases: `test-cases/`
- Bug Template: `BUG-TEMPLATE.md`
- User Stories: `contracts/user-stories/`
