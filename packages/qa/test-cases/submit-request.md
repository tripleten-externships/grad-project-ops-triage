# Test Cases: US-01 - Submit Request

## User Story
**As a** requester  
**I want to** submit a support request  
**So that** I can get help from the support team

**Acceptance Criteria**: See `contracts/user-stories/US-01-submit-request.md`

---

## Test Cases

### TC-01-001: Submit Valid Request (Happy Path)

**Preconditions**: User logged in as requester

**Steps**:
1. Navigate to submit request page
2. Enter title: "Need help with password reset"
3. Enter description: "I forgot my password and can't log in to my email"
4. Select category: "IT Support"
5. Select priority: "P1"
6. Click "Submit" button

**Expected Result**:
- Success message displayed: "Request submitted successfully"
- Request ID shown
- User redirected to request detail page OR stays on form with confirmation
- Request appears in "My Requests" list

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### TC-01-002: Submit Request with Minimum Required Fields

**Preconditions**: User logged in

**Steps**:
1. Navigate to submit request page
2. Enter title: "Test request"
3. Enter description: "This is a test"
4. Select category: "Other"
5. Select priority: "P3"
6. Click "Submit"

**Expected**:
- Request submitted successfully
- All fields saved correctly

---

### TC-01-003: Validation - Empty Title

**Steps**:
1. Navigate to submit request page
2. Leave title empty
3. Fill other fields
4. Click "Submit"

**Expected**:
- Error message: "Title is required"
- Form not submitted
- Focus moves to title field

---

### TC-01-004: Validation - Title Too Short

**Steps**:
1. Enter title: "Test" (< 10 characters)
2. Fill other fields
3. Click "Submit"

**Expected**:
- Error: "Title must be at least 10 characters"
- Form not submitted

---

### TC-01-005: Validation - Title Too Long

**Steps**:
1. Enter title: [201 characters]
2. Fill other fields
3. Click "Submit"

**Expected**:
- Error: "Title must not exceed 200 characters"
- OR: Input limited to 200 characters

---

### TC-01-006: Validation - Empty Description

**Steps**:
1. Fill title
2. Leave description empty
3. Click "Submit"

**Expected**:
- Error: "Description is required"

---

### TC-01-007: Validation - No Category Selected

**Steps**:
1. Fill title and description
2. Don't select category
3. Click "Submit"

**Expected**:
- Error: "Category is required"

---

### TC-01-008: Validation - No Priority Selected

**Steps**:
1. Fill title, description, category
2. Don't select priority
3. Click "Submit"

**Expected**:
- Error: "Priority is required"
- OR: Default priority (P2) applied

---

### TC-01-009: Special Characters in Title

**Steps**:
1. Enter title with special chars: "Can't access <system> & [tools]"
2. Fill other fields
3. Submit

**Expected**:
- Request submitted
- Special characters properly escaped/displayed
- No XSS vulnerability

---

### TC-01-010: Long Description (Edge Case)

**Steps**:
1. Fill title
2. Enter description: [5000 characters - max allowed]
3. Submit

**Expected**:
- Request submitted successfully
- Full description saved

---

### TC-01-011: Description Exceeds Max Length

**Steps**:
1. Enter description: [> 5000 characters]
2. Submit

**Expected**:
- Error: "Description too long"
- OR: Textarea limited to 5000 characters

---

### TC-01-012: Category Selection - All Options

**Steps**:
1. Click category dropdown
2. Verify all categories visible:
   - IT Support
   - HR
   - Facilities
   - Finance
   - Other

**Expected**:
- All categories listed
- Can select each one

---

### TC-01-013: Priority Selection - All Options

**Steps**:
1. Click priority dropdown
2. Verify options: P0, P1, P2, P3

**Expected**:
- All priorities listed with descriptions
- Tooltips explain each priority level

---

### TC-01-014: Form Reset/Cancel

**Steps**:
1. Fill form partially
2. Click "Cancel" or "Reset" button (if exists)

**Expected**:
- Form cleared OR confirmation dialog
- User can navigate away

---

### TC-01-015: Submit Multiple Requests

**Steps**:
1. Submit first request (TC-01-001)
2. Navigate back to form
3. Submit second request with different data

**Expected**:
- Both requests created
- Unique IDs assigned
- Both appear in "My Requests"

---

### TC-01-016: Network Error During Submit

**Preconditions**: Simulate network failure

**Steps**:
1. Fill valid form
2. Disconnect network (or mock API error)
3. Click "Submit"

**Expected**:
- Error message: "Network error, please try again"
- Form data NOT lost
- User can retry

---

### TC-01-017: Concurrent Submission (Double Click)

**Steps**:
1. Fill form
2. Click "Submit" twice rapidly

**Expected**:
- Only ONE request created
- Submit button disabled after first click

---

### TC-01-018: Accessibility - Keyboard Navigation

**Steps**:
1. Navigate form using only Tab key
2. Fill all fields
3. Press Enter to submit

**Expected**:
- All fields reachable via keyboard
- Tab order logical
- Form submits on Enter

---

### TC-01-019: Accessibility - Screen Reader

**Tools**: NVDA, JAWS, VoiceOver

**Steps**:
1. Navigate form with screen reader
2. Verify labels announced
3. Verify error messages announced

**Expected**:
- All fields have labels
- Errors announced to screen reader

---

### TC-01-020: AI Suggestion Display (if implemented)

**Preconditions**: AI automation enabled

**Steps**:
1. Fill title and description
2. Wait for AI suggestion (if auto-suggest)

**Expected**:
- Suggested category/priority shown
- User can accept or override
- Confidence score displayed

---

## Test Summary

| Total | Pass | Fail | Blocked | Not Run |
|-------|------|------|---------|---------|
| 20    | 0    | 0    | 0       | 20      |

**Tested By**: _____________  
**Date**: _____________  
**Build**: _____________

---

## Bugs Found

| Bug ID | Description | Severity | Status |
|--------|-------------|----------|--------|
| <!-- BUG-001 --> | <!-- Description --> | <!-- P1 --> | <!-- Open --> |

---

## References
- User Story: `contracts/user-stories/US-01-submit-request.md`
- Business Rules: `contracts/data-models/business-rules.md`
- Schema: `contracts/schemas/request.schema.json`
