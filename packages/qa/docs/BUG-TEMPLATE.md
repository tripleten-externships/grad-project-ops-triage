# Bug Report Template

## Bug ID
<!-- Auto-generated or from issue tracker -->
BUG-XXX

---

## Summary
<!-- One-line description -->
**Example**: Submit button remains disabled after fixing validation errors

---

## Severity
<!-- Choose one -->
- [ ] P0 - Critical (System down, data loss, security breach)
- [ ] P1 - High (Major feature broken, no workaround)
- [ ] P2 - Medium (Minor issue, workaround available)
- [ ] P3 - Low (Cosmetic, documentation)

---

## Priority
<!-- Choose one -->
- [ ] Blocker (Must fix before release)
- [ ] High (Fix in current sprint)
- [ ] Medium (Fix in next sprint)
- [ ] Low (Backlog)

---

## Environment
- **URL**: https://staging.example.com
- **Browser**: Chrome 120.0.6099.109
- **OS**: macOS 14.1
- **Screen Resolution**: 1920x1080
- **Device**: Desktop / Mobile (specify model if mobile)
- **Build/Version**: v1.2.3 or commit SHA

---

## Steps to Reproduce
1. Navigate to `/submit` page
2. Fill in title: "Test"
3. Fill in description: "Test description"
4. Select category: "IT Support"
5. Click "Submit" button
6. See validation error: "Title too short"
7. Update title to: "Valid title here"
8. **Bug**: Submit button is still disabled

---

## Expected Result
- After fixing validation failure, submit button should become enabled
- User can click button to submit form

---

## Actual Result
- Submit button remains disabled
- User cannot submit form despite valid input

---

## Visual Evidence

### Screenshot
![Bug Screenshot](link-to-screenshot.png)

### Video (if applicable)
[Link to screen recording]

### Console Errors
```
ERROR: Cannot read property 'isValid' of undefined
    at FormValidator.js:45
```

### Network Errors (if applicable)
```
POST /api/requests - 400 Bad Request
Response: {"error": "Validation failed"}
```

---

## Impact

### User Impact
- Users cannot submit requests after validation errors
- Workaround: Refresh page and re-enter data

### Business Impact
- All new request submissions blocked
- Estimated 50 users affected per day

---

## Frequency
<!-- How often does this occur? -->
- [ ] Always (100%)
- [ ] Often (>50%)
- [ ] Sometimes (10-50%)
- [ ] Rarely (<10%)

---

## Reproducibility
- [ ] Always reproducible
- [ ] Intermittent (provide reproduction rate)
- [ ] Cannot reproduce

---

## Related Information

### Related User Story
US-01: Submit Request

### Related Test Case
TC-01-003: Validation - Empty Title

### Related Tickets
- BUG-XXX (duplicate)
- FEATURE-YYY (related)

---

## Suggested Fix (Optional)
<!-- If you have ideas on root cause or fix -->

**Root Cause**: Form validation state not updating after user corrects errors

**Possible Fix**: 
```typescript
// In FormValidator, add state update after validation passes
if (allFieldsValid) {
  setIsSubmitEnabled(true);
}
```

---

## Workaround (Optional)
Refresh the page and re-enter all form data without making validation mistakes.

---

## Additional Notes
- Bug introduced in commit abc123
- Only affects Chrome, works fine in Firefox
- Regression from v1.2.0 (bug did not exist in v1.1.0)

---

## Attachments
- [x] Screenshot
- [ ] Video
- [x] Console logs
- [ ] Network HAR file
- [ ] Database state dump

---

## Assignment & Tracking

**Reported By**: QA Engineer Name  
**Date Reported**: 2026-02-05  
**Assigned To**: <!-- Developer name -->  
**Target Fix Date**: <!-- Sprint end date -->  

**Status**: 
- [ ] New
- [ ] Triaged
- [ ] In Progress
- [ ] Fixed (awaiting verification)
- [ ] Verified (fixed and tested)
- [ ] Closed
- [ ] Won't Fix
- [ ] Duplicate (of BUG-XXX)

---

## Resolution (Filled by Developer)

**Root Cause**: <!-- Explain what caused the bug -->

**Fix**: <!-- Describe the fix implemented -->

**Fixed In**: <!-- Commit SHA or version -->

**Testing Notes**: <!-- Instructions for QA to verify fix -->

---

## Verification (Filled by QA)

**Verified By**: <!-- QA Name -->  
**Verified On**: <!-- Date -->  
**Build**: <!-- Build/version tested -->  
**Status**: ✅ Pass | ❌ Fail (reopen)

**Verification Notes**: <!-- Any additional observations -->
