# Component Specifications

## Overview
This document defines the design specifications for reusable UI components in the Request Management System.

---

## Buttons

### Primary Button
**Usage**: Main call-to-action (e.g., Submit Request, Save)

**Specifications**:
- Background: `primary.600` (from tokens.json)
- Text: `neutral.white`
- Border Radius: `base` (8px)
- Padding: `spacing.3 spacing.6` (12px 24px)
- Font Size: `base` (16px)
- Font Weight: `medium` (500)

**States**:
- Hover: Background → `primary.700`
- Active: Background → `primary.800`, Shadow → `sm`
- Disabled: Background → `neutral.300`, Text → `neutral.500`, Opacity: 0.6
- Focus: Outline → 2px solid `primary.500`, Offset: 2px

**Accessibility**:
- Min touch target: 44x44px
- Focus indicator visible
- aria-label if icon-only

### Secondary Button
<!-- TODO: Define secondary button specs -->

### Text Button
<!-- TODO: Define text/ghost button specs -->

---

## Form Inputs

### Text Input
**Usage**: Single-line text entry (title, name)

**Specifications**:
- Border: 1px solid `neutral.300`
- Border Radius: `base` (8px)
- Padding: `spacing.3` (12px)
- Font Size: `base` (16px)
- Background: `neutral.white`

**States**:
- Focus: Border → `primary.500`, Shadow → `base`
- Error: Border → `error.main`, Background → `error.light` at 5% opacity
- Disabled: Background → `neutral.100`, Border → `neutral.200`, Cursor: not-allowed

**Accessibility**:
- Associated <label> with for/id
- aria-invalid="true" on error
- aria-describedby for error messages

### Textarea
**Usage**: Multi-line text entry (description)

<!-- TODO: Define textarea specs, minimum 3 rows -->

### Select Dropdown
**Usage**: Category, priority selection

<!-- TODO: Define select dropdown specs -->

### Date Picker
<!-- TODO: Define date picker specs if needed for request submission -->

---

## Cards

### Request Card
**Usage**: Display request summary in lists/queues

**Specifications**:
- Background: `neutral.white`
- Border: 1px solid `neutral.200`
- Border Radius: `lg` (12px)
- Padding: `spacing.4` (16px)
- Shadow: `sm` (hover: `md`)

**Content Structure**:
```
┌─────────────────────────────────────┐
│ [Priority Badge]  [Category Badge]  │
│                                     │
│ Title (fontSize: lg, fontWeight: semibold)
│                                     │
│ Description preview (2 lines max)   │
│ color: neutral.600                  │
│                                     │
│ ┌──────────┐  ┌─────────────────┐  │
│ │ Status   │  │ Created: date   │  │
│ └──────────┘  └─────────────────┘  │
└─────────────────────────────────────┘
```

**Accessibility**:
- Clickable card uses <button> or <a> with proper role
- Semantic HTML for content structure
- Keyboard navigable

---

## Badges

### Priority Badge
**Usage**: Display priority level (P0-P3)

**Specifications**:
- Font Size: `xs` (12px)
- Font Weight: `semibold` (600)
- Padding: `spacing.1 spacing.2` (4px 8px)
- Border Radius: `sm` (4px)
- Text Transform: uppercase

**Variants**:
- Critical (P0): Background: `priority.critical`, Text: `neutral.white`
- High (P1): Background: `priority.high`, Text: `neutral.white`
- Medium (P2): Background: `priority.medium`, Text: `neutral.white`
- Low (P3): Background: `priority.low`, Text: `neutral.white`

**Accessibility**:
- Use aria-label for screen readers: "Priority: Critical"

### Status Badge
<!-- TODO: Define status badge variants (Pending, In Progress, Resolved) -->

### Category Badge
<!-- TODO: Define category badge style -->

---

## Navigation

### Header Navigation
<!-- TODO: Define main navigation bar specs -->

### Tab Navigation
**Usage**: Switch between views (e.g., All Requests, My Requests)

<!-- TODO: Define tab component specs -->

---

## Data Display

### Table
**Usage**: Display request queue for agents

**Specifications**:
- Header Background: `neutral.100`
- Row Border: 1px solid `neutral.200`
- Row Hover: Background → `neutral.50`
- Cell Padding: `spacing.3` (12px)
- Font Size: `sm` (14px)

**Accessibility**:
- Use semantic <table>, <thead>, <tbody>, <th>, <td>
- scope="col" for headers
- aria-sort for sortable columns

### Chart/Graph
**Usage**: Manager insights visualizations

<!-- TODO: Define chart styling to match design tokens -->

---

## Feedback Components

### Alert/Notification
**Usage**: Success, error, warning messages

**Variants**:
- Success: Border-left: 4px solid `success.main`, Background: `success.light` at 10%
- Error: Border-left: 4px solid `error.main`, Background: `error.light` at 10%
- Warning: Border-left: 4px solid `warning.main`, Background: `warning.light` at 10%
- Info: Border-left: 4px solid `info.main`, Background: `info.light` at 10%

**Specifications**:
- Padding: `spacing.4` (16px)
- Border Radius: `base` (8px)
- Icon: 20x20px, aligned left

**Accessibility**:
- role="alert" for dynamic messages
- aria-live="polite" or "assertive"

### Loading Spinner
<!-- TODO: Define loading state component -->

### Toast Notification
<!-- TODO: Define toast notification for transient messages -->

---

## Modals/Dialogs

### Confirmation Dialog
**Usage**: Confirm destructive actions

<!-- TODO: Define modal overlay, backdrop, and content specs -->

---

## Layout Components

### Container
<!-- TODO: Define max-width container for content -->

### Grid
<!-- TODO: Define responsive grid system (12-column) -->

---

## Implementation Notes

### For Frontend Developers
1. Import design tokens from `tokens.json` or generated CSS variables
2. Create reusable components matching these specs
3. Use existing component library (Material-UI, shadcn/ui, etc.) as base, customize with tokens
4. Ensure all components are accessible (WCAG AA)

### Token Usage Example (CSS)
```css
.btn-primary {
  background-color: var(--color-primary-600);
  color: var(--color-neutral-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-base);
}
```

---

## References
- Design Tokens: [`tokens.json`](./tokens.json)
- Accessibility Guidelines: [`../accessibility/a11y-guidelines.md`](../accessibility/a11y-guidelines.md)
- User Flows: [`../user-flows/`](../user-flows/)
