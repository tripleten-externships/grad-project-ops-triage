# Accessibility Guidelines

## Overview
This document outlines accessibility requirements and guidelines for the Request Management System to ensure WCAG 2.1 Level AA compliance.

---

## WCAG Principles (POUR)

### 1. Perceivable
Information and UI components must be presentable to users in ways they can perceive.

### 2. Operable
UI components and navigation must be operable.

### 3. Understandable
Information and operation of UI must be understandable.

### 4. Robust
Content must be robust enough to be interpreted reliably by assistive technologies.

---

## Checklist by Guideline

### Perceivable

#### Text Alternatives (1.1)
- [ ] All images have alt text
- [ ] Decorative images use alt="" or aria-hidden
- [ ] Form inputs have associated labels
- [ ] Icon buttons have aria-label or visually hidden text

#### Time-based Media (1.2)
- [ ] Videos have captions (if applicable)
- [ ] Audio content has transcripts (if applicable)

#### Adaptable (1.3)
- [ ] Semantic HTML (<header>, <nav>, <main>, <footer>, <article>, <section>)
- [ ] Headings are in logical order (h1 > h2 > h3)
- [ ] Lists use <ul>, <ol>, <li>
- [ ] Tables use <table>, <thead>, <tbody>, <th>, <td> with scope
- [ ] Form fields have programmatically associated labels
- [ ] Meaningful reading order when CSS is disabled
- [ ] Instructions don't rely solely on shape, size, location, or color

#### Distinguishable (1.4)
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text (18pt+)
- [ ] Information not conveyed by color alone
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] No background images behind text that reduce readability
- [ ] Focus indicators are visible and have ≥ 3:1 contrast

**Color Contrast Checks** (using tokens.json):
<!-- TODO: Test all color combinations -->
- Primary button text on primary background: ✓ / ✗
- Error messages: ✓ / ✗
- Links: ✓ / ✗

### Operable

#### Keyboard Accessible (2.1)
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Skip navigation link for keyboard users
- [ ] Custom controls (dropdowns, modals) keyboard operable

**Keyboard Shortcuts**:
<!-- TODO: Define keyboard shortcuts if any -->
- Tab: Move forward through interactive elements
- Shift+Tab: Move backward
- Enter/Space: Activate buttons, links
- Esc: Close modals

#### Enough Time (2.2)
- [ ] No time limits on interactions (or user can extend)
- [ ] Auto-updates can be paused/stopped (if applicable)

#### Seizures (2.3)
- [ ] No flashing content > 3 times per second

#### Navigable (2.4)
- [ ] Skip to main content link
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link text is descriptive (avoid "click here")
- [ ] Multiple ways to navigate (breadcrumbs, search, sitemap if applicable)
- [ ] Headings and labels are descriptive
- [ ] Focus is visible

#### Input Modalities (2.5)
- [ ] Touch targets ≥ 44x44px
- [ ] Gestures don't require precise paths
- [ ] Single pointer operation available (no multi-touch required)
- [ ] Labels match accessible names

### Understandable

#### Readable (3.1)
- [ ] Page language defined (<html lang="en">)
- [ ] Content is clear and concise
- [ ] Jargon is avoided or explained

#### Predictable (3.2)
- [ ] Focus doesn't trigger unexpected context changes
- [ ] Input doesn't trigger unexpected context changes
- [ ] Navigation is consistent across pages
- [ ] Components are identified consistently

#### Input Assistance (3.3)
- [ ] Form errors are clearly identified
- [ ] Labels and instructions provided
- [ ] Error messages suggest corrections
- [ ] Confirmation for critical actions (delete, submit)
- [ ] Form data can be reviewed before final submission

**Form Validation Example**:
```html
<label for="title">Request Title *</label>
<input
  id="title"
  type="text"
  required
  aria-invalid="false"
  aria-describedby="title-error"
/>
<span id="title-error" role="alert">
  <!-- Error message appears here -->
</span>
```

### Robust

#### Compatible (4.1)
- [ ] Valid HTML (no parsing errors)
- [ ] ARIA used correctly
- [ ] Status messages use role="status" or role="alert"
- [ ] Custom widgets have appropriate ARIA roles, states, properties

**ARIA Roles to Use**:
- `role="alert"` for dynamic error messages
- `role="status"` for loading states
- `role="navigation"` for nav (or use <nav>)
- `role="button"` for custom buttons (or use <button>)
- `aria-expanded` for collapsible sections
- `aria-label` for icon-only buttons

---

## Component-Specific Guidelines

### Forms (US-01: Submit Request)
- [ ] Required fields marked with * and aria-required="true"
- [ ] Field labels visible and associated (for/id or aria-labelledby)
- [ ] Validation messages announced to screen readers
- [ ] Focus moves to first error on submission failure

### Table (US-02: Request Queue)
- [ ] Table has <caption> or aria-label
- [ ] Headers use <th> with scope="col"
- [ ] Sortable columns indicate sort direction with aria-sort
- [ ] Row selection uses checkboxes with aria-label

### Dashboard (US-03: Insights)
- [ ] Charts have text alternatives (data table)
- [ ] Color-coded data has additional indicators (patterns, labels)
- [ ] Interactive elements have accessible names

---

## Testing Checklist

### Automated Testing
<!-- TODO: Run automated accessibility tests -->
- [ ] Lighthouse accessibility audit (score ≥ 90)
- [ ] axe DevTools (0 violations)
- [ ] WAVE browser extension

### Manual Testing
- [ ] Keyboard-only navigation through all flows
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] High contrast mode (Windows, browser extensions)
- [ ] Zoom to 200% text size
- [ ] Tab order is logical

### Assistive Technology Testing
<!-- TODO: Test with actual screen readers -->
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android - if mobile)

---

## Common Pitfalls to Avoid

1. **Missing alt text**: Every `<img>` needs alt attribute
2. **Div/span buttons**: Use `<button>` or `role="button"` + keyboard handling
3. **Placeholder as label**: Placeholder disappears, use `<label>`
4. **Color-only information**: "Click the green button" → Add text/icon
5. **Unlabeled form fields**: Every input needs associated label
6. **Poor contrast**: Test with contrast checker tools
7. **Custom dropdowns**: Ensure keyboard accessible, ARIA states
8. **Modals without focus trap**: Focus should move to modal and be contained
9. **Inline styles overriding focus**: Don't remove :focus outlines
10. **Auto-playing media**: Provide play/pause controls

---

## Resources

### Tools
- **Color Contrast**: https://webaim.org/resources/contrastchecker/
- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: Browser extension
- **Lighthouse**: Chrome DevTools
- **Screen Readers**: NVDA (free), VoiceOver (built-in macOS)

### Guidelines
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **WAI-ARIA**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM**: https://webaim.org/

---

## Sign-Off Criteria

Before launch, accessibility lead must verify:
- [ ] All WCAG 2.1 Level AA criteria met
- [ ] Automated tests pass (Lighthouse, axe)
- [ ] Manual keyboard testing complete
- [ ] Screen reader testing complete
- [ ] High contrast mode functional
- [ ] QA team has accessibility test cases

---

## References
- Design System: [`../design-system/components.md`](../design-system/components.md)
- QA Accessibility Tests: [`../../qa/accessibility-tests/a11y-checklist.md`](../../qa/accessibility-tests/a11y-checklist.md)
