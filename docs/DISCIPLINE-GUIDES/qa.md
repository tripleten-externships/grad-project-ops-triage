# Quality Assurance (QA) Discipline Guide

## 🎯 Role Overview

As a **QA Engineer**, you ensure the Ops Triage Application works correctly, reliably, and meets all requirements. You'll develop test strategies, write test cases, automate tests, and identify defects before users encounter them.

### Your Impact

- **Quality is assured** through systematic testing
- **Bugs are caught early** before production
- **User experience is validated** across scenarios
- **Confidence is built** in releases

## 📋 Required Deliverables

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **Test Strategy** | [`packages/qa/test-strategy/TEST-STRATEGY.md`](../../packages/qa/test-strategy/TEST-STRATEGY.md) | Overall testing approach |
| **Test Cases** | [`packages/qa/test-cases/`](../../packages/qa/test-cases/) | Detailed test scenarios |
| **E2E Tests** | [`packages/qa/e2e-tests/tests/`](../../packages/qa/e2e-tests/tests/) | Playwright automated tests |
| **API Tests** | [`packages/qa/api-tests/`](../../packages/qa/api-tests/) | REST API testing |
| **Test Guide** | [`packages/qa/docs/TEST-GUIDE.md`](../../packages/qa/docs/TEST-GUIDE.md) | How to run all tests |
| **Bug Template** | [`packages/qa/docs/BUG-TEMPLATE.md`](../../packages/qa/docs/BUG-TEMPLATE.md) | Standardized bug reporting |

## 🛠️ Tools & Technologies

### Test Automation

```yaml
E2E Testing:
  - Playwright (primary)
  - Alternative: Cypress, Selenium

API Testing:
  - Postman / Insomnia
  - REST Client (VS Code extension)
  - Supertest (code-based)

Unit Testing (optional):
  - Jest (JavaScript/TypeScript)
  - pytest (Python for DS)

Performance Testing (stretch):
  - Artillery
  - k6
  - Apache JMeter

Accessibility Testing:
  - axe-core / @axe-core/playwright
  - WAVE browser extension
  - Lighthouse
```

### Bug Tracking

- GitHub Issues (built-in)
- Jira (if available)
- Linear (modern alternative)
- Simple spreadsheet (minimum)

## 🚀 Setup Instructions

### 1. Install Playwright

```bash
cd packages/qa

# Install dependencies
pnpm install

# Install browser binaries
pnpm exec playwright install

# Verify installation
pnpm exec playwright --version
```

### 2. Set Up Test Environment

**Configure test URL** (`playwright.config.ts`):
```typescript
export default defineConfig({
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:5173',
  },
  webServer: {
    command: 'cd ../frontend && pnpm dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
```

**Environment variables** (`.env`):
```env
TEST_URL=http://localhost:5173
API_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_AGENT_EMAIL=agent@example.com
```

### 3. Verify Setup

```bash
# Run example test
pnpm test:e2e

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run with UI
pnpm exec playwright test --ui
```

## 📖 Test Strategy

### Test Levels

**File**: [`test-strategy/TEST-STRATEGY.md`](../../packages/qa/test-strategy/TEST-STRATEGY.md)

```markdown
# Test Strategy - Ops Triage Application

## Objectives
- Ensure all user stories work as specified
- Validate API contract compliance
- Verify UI usability and accessibility
- Catch defects before production

## Scope

### In Scope
- All 3 user stories (Submit, Triage, Insights)
- Frontend UI functionality
- Backend API endpoints
- Data validation
- Error handling
- Basic accessibility (WCAG A)

### Out of Scope
- Performance/load testing (stretch goal)
- Security penetration testing (Security team)
- Browser compatibility (focus on Chrome)

## Test Levels

### 1. Unit Testing (Optional)
**Owner**: Developers  
**Scope**: Individual functions, utilities  
**Tools**: Jest  
**Coverage Target**: 50% minimum

### 2. API Testing (Required)
**Owner**: QA  
**Scope**: All backend endpoints  
**Tools**: Postman, REST Client  
**Coverage**: All CRUD operations

### 3. E2E Testing (Required)
**Owner**: QA  
**Scope**: Complete user workflows  
**Tools**: Playwright  
**Coverage**: All user stories

### 4. Accessibility Testing (Required)
**Owner**: QA + UX  
**Scope**: Key pages  
**Tools**: Axe, WAVE  
**Standard**: WCAG 2.1 Level A minimum

## Test Approach

### Phase 1: Test Design (Week 1-2)
- Review requirements (user stories, contracts)
- Write test cases for each user story
- Design test data
- Set up test environment

### Phase 2: Manual Testing (Week 3-4)
- Execute test cases manually
- Document bugs
- Verify bug fixes
- Exploratory testing

### Phase 3: Test Automation (Week 5-6)
- Automate happy paths
- Automate critical flows
- Set up CI/CD integration
- Create test documentation

## Entry Criteria
- [ ] Frontend and backend deployed to test environment
- [ ] Test data available
- [ ] User stories finalized

## Exit Criteria
- [ ] All critical test cases pass
- [ ] No high-severity bugs open
- [ ] E2E tests automated for core flows
- [ ] Test report generated

## Risks
- **Late delivery**: May not have time for full automation
- **Environment instability**: Test environment downtime
- **Changing requirements**: Test cases may need updates

## Deliverables
1. Test cases document
2. E2E automated tests (Playwright)
3. API test collection (Postman)
4. Bug reports
5. Test execution report

## Schedule

| Week | Activity |
|------|----------|
| 1-2 | Test planning, case design |
| 3 | Manual testing, bug reporting |
| 4 | Test automation setup |
| 5 | E2E automation |
| 6 | Regression testing, final report |
```

## ✅ Writing Test Cases

### Test Case Template

**File**: [`test-cases/submit-request.md`](../../packages/qa/test-cases/submit-request.md)

```markdown
# Test Cases: Submit Request (US-01)

## TC-01: Submit Request - Happy Path

**Objective**: Verify user can successfully submit a new IT support request

**Preconditions**:
- User is logged in
- User is on the submit request page

**Test Steps**:
1. Enter "Laptop won't turn on" in Title field
2. Enter "Pressed power button multiple times, no response" in Description
3. Select "Hardware" from Category dropdown
4. Click "Submit" button

**Expected Results**:
- Success message displayed: "Request submitted successfully"
- Request ID is shown
- User is redirected to request detail page
- Request appears in database with status "Open"

**Test Data**:
- Title: "Laptop won't turn on"
- Description: "Pressed power button multiple times, no response"
- Category: Hardware

**Priority**: High  
**Status**: Pass ✅

---

## TC-02: Submit Request - Missing Required Fields

**Objective**: Verify validation prevents submission without required fields

**Test Steps**:
1. Leave Title field empty
2. Enter description
3. Click "Submit"

**Expected Results**:
- Error message: "Title is required"
- Form is not submitted
- User remains on submit page

**Test Data**: (empty title)

**Priority**: High  
**Status**: Pass ✅

---

## TC-03: Submit Request - Title Too Short

**Objective**: Verify title length validation (minimum 5 characters)

**Test Steps**:
1. Enter "Help" in Title (only 4 chars)
2. Enter description
3. Click "Submit"

**Expected Results**:
- Error message: "Title must be at least 5 characters"
- Form is not submitted

**Priority**: Medium  
**Status**: Pass ✅

---

## TC-04: Submit Request - XSS Attempt

**Objective**: Verify application sanitizes malicious input

**Test Steps**:
1. Enter `<script>alert('XSS')</script>` in Title
2. Enter normal description
3. Click "Submit"

**Expected Results**:
- Script is escaped/sanitized
- No alert popup appears
- Request is saved with escaped content

**Priority**: High (Security)  
**Status**: Pass ✅

---

## TC-05: Submit Request - Very Long Description

**Objective**: Verify description length limit (2000 chars)

**Test Steps**:
1. Enter valid title
2. Enter 2001 characters in description
3. Click "Submit"

**Expected Results**:
- Error message: "Description must be 2000 characters or less"
- Or: Field prevents typing beyond 2000 chars

**Priority**: Medium  
**Status**: Pass ✅

---

## TC-06: Submit Request - Network Error

**Objective**: Verify error handling when API is unavailable

**Test Steps**:
1. Stop backend server
2. Fill form completely
3. Click "Submit"

**Expected Results**:
- Error message: "Failed to submit request. Please try again."
- Form data is not lost
- User can retry

**Priority**: Medium  
**Status**: Pass ✅
```

### Create Test Cases for Each User Story

Minimum **15 test cases** covering:
- Happy paths (3-5 cases)
- Validation errors (3-5 cases)
- Edge cases (3-5 cases)
- Error scenarios (2-3 cases)

## 🤖 E2E Test Automation

### Playwright Test Example

**File**: [`e2e-tests/tests/submit-flow.spec.ts`](../../packages/qa/e2e-tests/tests/submit-flow.spec.ts)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Submit Request Flow', () => {
  test('should submit request successfully', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');
    
    // Click submit request button
    await page.click('text=Submit Request');
    
    // Fill form
    await page.fill('[name="title"]', 'Laptop not working');
    await page.fill('[name="description"]', 'Screen is black, tried restarting multiple times');
    await page.selectOption('[name="category"]', 'Hardware');
    
    // Submit
    await page.click('button:has-text("Submit")');
    
    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.request-id')).toContainText(/REQ-\d+/);
  });

  test('should show validation error for empty title', async ({ page }) => {
    await page.goto('http://localhost:5173/submit');
    
    // Try to submit without title
    await page.fill('[name="description"]', 'Some description');
    await page.click('button:has-text("Submit")');
    
    // Verify error
    await expect(page.locator('.error')).toContainText('Title is required');
  });

  test('should prevent XSS in title', async ({ page }) => {
    await page.goto('http://localhost:5173/submit');
    
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('[name="title"]', xssPayload);
    await page.fill('[name="description"]', 'Test description');
    await page.selectOption('[name="category"]', 'Software');
    await page.click('button:has-text("Submit")');
    
    // Should not execute script
    // Instead, should display as text
    await page.waitForSelector('.request-id');
    const title = await page.textContent('.request-title');
    expect(title).toBe(xssPayload); // Displayed as text, not executed
  });
});

test.describe('Agent Triage Flow', () => {
  test('should display triage queue', async ({ page }) => {
    await page.goto('http://localhost:5173/triage');
    
    // Verify table headers
    await expect(page.locator('th:has-text("Title")')).toBeVisible();
    await expect(page.locator('th:has-text("Priority")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    
    // Verify at least one request visible
    const requests = page.locator('[data-testid="request-row"]');
    await expect(requests.first()).toBeVisible();
  });

  test('should update request status', async ({ page }) => {
    await page.goto('http://localhost:5173/triage');
    
    // Click first request
    await page.click('[data-testid="request-row"]:first-child');
    
    // Change status
    await page.selectOption('[name="status"]', 'In Progress');
    await page.click('button:has-text("Save")');
    
    // Verify success
    await expect(page.locator('.status-badge')).toContainText('In Progress');
  });

  test('should filter by status', async ({ page }) => {
    await page.goto('http://localhost:5173/triage');
    
    // Apply filter
    await page.selectOption('[name="statusFilter"]', 'Open');
    
    // Verify filtered results
    const statuses = await page.locator('.status-badge').allTextContents();
    statuses.forEach(status => {
      expect(status).toBe('Open');
    });
  });
});
```

### Page Object Model (Advanced)

```typescript
// e2e-tests/pages/SubmitPage.ts
export class SubmitPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/submit');
  }

  async fillForm(data: {
    title: string;
    description: string;
    category: string;
  }) {
    await this.page.fill('[name="title"]', data.title);
    await this.page.fill('[name="description"]', data.description);
    await this.page.selectOption('[name="category"]', data.category);
  }

  async submit() {
    await this.page.click('button:has-text("Submit")');
  }

  async getSuccessMessage() {
    return this.page.locator('.success-message').textContent();
  }

  async getErrorMessage() {
    return this.page.locator('.error').textContent();
  }
}

// Use in tests
test('submit with page object', async ({ page }) => {
  const submitPage = new SubmitPage(page);
  await submitPage.goto();
  await submitPage.fillForm({
    title: 'Test',
    description: 'Test desc',
    category: 'Software'
  });
  await submitPage.submit();
  
  const message = await submitPage.getSuccessMessage();
  expect(message).toContain('Success');
});
```

## 🔌 API Testing

### Postman/REST Client

**File**: [`api-tests/rest-client/requests.http`](../../packages/qa/api-tests/rest-client/requests.http)

```http
### Get all requests
GET http://localhost:3000/api/requests
Content-Type: application/json

### Get single request
GET http://localhost:3000/api/requests/{{requestId}}

### Create request
POST http://localhost:3000/api/requests
Content-Type: application/json

{
  "title": "Test request from REST client",
  "description": "This is a test",
  "category": "Software",
  "submittedBy": "user-123"
}

### Update request
PATCH http://localhost:3000/api/requests/{{requestId}}
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTo": "agent-456"
}

### Test validation - missing title
POST http://localhost:3000/api/requests
Content-Type: application/json

{
  "description": "Missing title",
  "category": "Software"
}

### Test invalid category
POST http://localhost:3000/api/requests
Content-Type: application/json

{
  "title": "Test",
  "description": "Test",
  "category": "InvalidCategory"
}
```

### Code-Based API Tests

```typescript
// api-tests/api.test.ts
import request from 'supertest';

const API_URL = 'http://localhost:3000';

describe('Requests API', () => {
  test('GET /api/requests returns 200', async () => {
    const response = await request(API_URL)
      .get('/api/requests')
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('POST /api/requests creates request', async () => {
    const newRequest = {
      title: 'Test request',
      description: 'Test description',
      category: 'Software',
      submittedBy: 'user-123'
    };

    const response = await request(API_URL)
      .post('/api/requests')
      .send(newRequest)
      .expect(201);

    expect(response.body.title).toBe(newRequest.title);
    expect(response.body.status).toBe('Open');
  });

  test('POST /api/requests validates required fields', async () => {
    const invalidRequest = {
      description: 'Missing title'
    };

    const response = await request(API_URL)
      .post('/api/requests')
      .send(invalidRequest)
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  test('PATCH /api/requests/:id updates request', async () => {
    const requestId = 'existing-request-id';
    
    const response = await request(API_URL)
      .patch(`/api/requests/${requestId}`)
      .send({ status: 'Resolved' })
      .expect(200);

    expect(response.body.status).toBe('Resolved');
  });
});
```

## ♿ Accessibility Testing

### Automated A11y Tests

```typescript
// e2e-tests/tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('submit page should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:5173/submit');
    
    const accessibilityScan = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScan.violations).toEqual([]);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('http://localhost:5173/submit');
    
    // Check labels
    const titleLabel = await page.locator('label[for="title"]');
    await expect(titleLabel).toContainText('Title');
    
    const descLabel = await page.locator('label[for="description"]');
    await expect(descLabel).toContainText('Description');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('http://localhost:5173/submit');
    
    // Tab through form
    await page.keyboard.press('Tab'); // Title
    await page.keyboard.type('Test title');
    await page.keyboard.press('Tab'); // Description
    await page.keyboard.type('Test description');
    await page.keyboard.press('Tab'); // Category
    await page.keyboard.press('Tab'); // Submit button
    await page.keyboard.press('Enter');
    
    // Should submit successfully
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

## 🐛 Bug Reporting

**File**: [`docs/BUG-TEMPLATE.md`](../../packages/qa/docs/BUG-TEMPLATE.md)

```markdown
# Bug Report Template

## Bug ID: BUG-XXX

**Title**: [Short, descriptive title]

**Severity**: Critical / High / Medium / Low

**Priority**: P0 / P1 / P2 / P3

**Status**: Open / In Progress / Fixed / Closed

---

## Description
[Clear description of the issue]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Result
[What should happen]

## Actual Result
[What actually happens]

## Environment
- **OS**: macOS / Windows / Linux
- **Browser**: Chrome 120 / Firefox 115 / Safari 17
- **Screen Size**: 1920x1080
- **User Role**: User / Agent / Manager

## Screenshots/Videos
[Attach if applicable]

## Console Errors
```
[Paste any console errors]
```

## Additional Notes
[Any other relevant information]

## Example

---

## Bug ID: BUG-001

**Title**: Request status not updating after save

**Severity**: High

**Priority**: P1

**Status**: Open

---

## Description
When agent changes request status from "Open" to "In Progress" and clicks Save, the UI shows success message but status remains "Open" after page refresh.

## Steps to Reproduce
1. Login as agent
2. Navigate to /triage
3. Click on any Open request
4. Change status dropdown to "In Progress"
5. Click "Save" button
6. Refresh page

## Expected Result
- Status should be "In Progress"
- Status badge should show orange color
- Status persists after refresh

## Actual Result
- Status shows "Open" (unchanged)
- Status badge is blue
- Change was not saved

## Environment
- **OS**: macOS Sonoma 14.2
- **Browser**: Chrome 120
- **Screen Size**: 1920x1080
- **User Role**: Agent

## Screenshots
[Screenshot showing status still Open]

## Console Errors
```
PATCH /api/requests/123 returned 200
Response: { status: "In Progress" }
```

## Additional Notes
API returns 200 and correct status, but database may not be updating. Frontend may not be refetching after save.
```

## ✅ Deliverable Checklist

**Test Strategy**:
- [ ] Scope defined (in/out of scope)
- [ ] Test levels identified
- [ ] Entry/exit criteria
- [ ] Schedule with milestones

**Test Cases**:
- [ ] At least 15 test cases
- [ ] All 3 user stories covered
- [ ] Happy paths, negative cases, edge cases
- [ ] Clear steps and expected results

**E2E Automation**:
- [ ] Playwright configured
- [ ] Submit request flow automated
- [ ] Agent triage flow automated
- [ ] Tests pass consistently

**API Testing**:
- [ ] All CRUD endpoints tested
- [ ] REST client collection or code-based tests
- [ ] Positive and negative test cases

**Documentation**:
- [ ] Test guide (how to run tests)
- [ ] Bug template provided
- [ ] Test execution report (if bugs found, documented)

## 🎯 Stretch Goals

- [ ] **Visual Regression**: Screenshot comparison testing
- [ ] **Performance Testing**: Load test with Artillery or k6
- [ ] **CI/CD Integration**: Tests run on every commit
- [ ] **Test Coverage**: Measure test coverage (>70%)
- [ ] **Cross-Browser**: Test in Firefox, Safari, Edge
- [ ] **Mobile Testing**: Test responsive design
- [ ] **Accessibility**: Full WCAG AA compliance testing

## 📚 Resources

- **Playwright Docs**: [playwright.dev](https://playwright.dev)
- **Testing Best Practices**: [testingjavascript.com](https://testingjavascript.com/)
- **API Testing**: [restfulapi.net](https://restfulapi.net/rest-api-testing/)
- **Accessibility**: [webaim.org](https://webaim.org/)

---

**Test thoroughly, break things intentionally, ensure quality!** 🧪✅
