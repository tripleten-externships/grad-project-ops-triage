import { test, expect } from '@playwright/test';

/**
 * E2E Test: Submit Request Flow (US-01)
 * 
 * Tests the happy path for submitting a support request.
 */

test.describe('Submit Request Flow (US-01)', () => {
  
  test.beforeEach(async ({ page }) => {
    // TODO: Navigate to app and log in
    await page.goto('/');
    
    // TODO: Implement login if authentication required
    // await page.fill('[data-testid="email"]', 'requester@test.com');
    // await page.fill('[data-testid="password"]', 'Test123!');
    // await page.click('[data-testid="login-button"]');
    
    // Navigate to submit request page
    await page.click('[data-testid="submit-request-link"]');
    // OR: await page.goto('/submit');
  });
  
  test('TC-01-001: Submit valid request (happy path)', async ({ page }) => {
    // Fill in the form
    await page.fill('[data-testid="request-title"]', 'Need help with password reset');
    await page.fill('[data-testid="request-description"]', 'I forgot my password and cannot log in to my email account');
    await page.selectOption('[data-testid="request-category"]', 'IT Support');
    await page.selectOption('[data-testid="request-priority"]', 'P1');
    
    // Submit the form
    await page.click('[data-testid="submit-button"]');
    
    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Request submitted successfully');
    
    // Verify request ID is displayed
    await expect(page.locator('[data-testid="request-id"]')).toBeVisible();
    
    // Optional: Verify redirect to detail page or request list
    // await expect(page).toHaveURL(/\/requests\/\w+/);
  });
  
  test('TC-01-003: Validation - empty title shows error', async ({ page }) => {
    // Leave title empty, fill other fields
    await page.fill('[data-testid="request-description"]', 'Test description');
    await page.selectOption('[data-testid="request-category"]', 'Other');
    await page.selectOption('[data-testid="request-priority"]', 'P3');
    
    // Click submit
    await page.click('[data-testid="submit-button"]');
    
    // Expect error message
    await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
    
    // Verify form not submitted (still on same page)
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
  });
  
  test('TC-01-006: Validation - empty description shows error', async ({ page }) => {
    await page.fill('[data-testid="request-title"]', 'Valid title here');
    // Leave description empty
    await page.selectOption('[data-testid="request-category"]', 'IT Support');
    await page.selectOption('[data-testid="request-priority"]', 'P2');
    
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="description-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="description-error"]')).toContainText('Description is required');
  });
  
  test('TC-01-009: Special characters in title handled correctly', async ({ page }) => {
    const titleWithSpecialChars = "Can't access <system> & [tools] #123";
    
    await page.fill('[data-testid="request-title"]', titleWithSpecialChars);
    await page.fill('[data-testid="request-description"]', 'Description with special chars: <script>alert("XSS")</script>');
    await page.selectOption('[data-testid="request-category"]', 'IT Support');
    await page.selectOption('[data-testid="request-priority"]', 'P2');
    
    await page.click('[data-testid="submit-button"]');
    
    // Should submit successfully
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify XSS not executed (page still normal)
    await expect(page).not.toHaveTitle(/XSS/);
  });
  
  test('TC-01-017: Double-click submit prevented (no duplicate requests)', async ({ page }) => {
    await page.fill('[data-testid="request-title"]', 'Test duplicate prevention');
    await page.fill('[data-testid="request-description"]', 'Testing double-click');
    await page.selectOption('[data-testid="request-category"]', 'Other');
    await page.selectOption('[data-testid="request-priority"]', 'P3');
    
    // Click submit button twice rapidly
    await page.click('[data-testid="submit-button"]');
    await page.click('[data-testid="submit-button"]').catch(() => {
      // Button might be disabled, that's okay
    });
    
    // Should only see one success message
    await expect(page.locator('[data-testid="success-message"]')).toHaveCount(1);
  });
  
  test('TC-01-018: Keyboard navigation works', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab'); // Focus on title
    await page.keyboard.type('Keyboard navigation test');
    
    await page.keyboard.press('Tab'); // Focus on description
    await page.keyboard.type('Testing keyboard-only interaction');
    
    // TODO: Test Tab through category and priority dropdowns
    // This depends on how dropdowns are implemented
    
    // Submit with Enter key
    await page.keyboard.press('Enter');
    
    // Should submit successfully
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
  
});

/**
 * TODO for QA team:
 * 1. Update selectors to match actual implementation (use data-testid attributes)
 * 2. Implement authentication if required
 * 3. Add more edge case tests
 * 4. Add accessibility tests with @axe-core/playwright
 * 5. Add visual regression tests if needed
 */
