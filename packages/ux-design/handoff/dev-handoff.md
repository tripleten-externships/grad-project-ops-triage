# Developer Handoff Documentation

## Overview
This document provides frontend developers with everything needed to implement the designs for the Request Management System.

---

## Design Assets Location

### Figma Files
- **Main Prototype**: See [`../prototypes/figma-link.md`](../prototypes/figma-link.md)
- **Design System**: [Insert design system Figma link]

### Design Tokens
- **File**: [`../design-system/tokens.json`](../design-system/tokens.json)
- **Usage**: Import or convert to CSS custom properties

### Component Specs
- **File**: [`../design-system/components.md`](../design-system/components.md)
- **Details**: Dimensions, states, interactions for each component

---

## Implementation Priorities

### Phase 1: Foundation (Week 1-2)
1. Set up design tokens (CSS variables or theme config)
2. Create base components (Button, Input, Badge, Card)
3. Implement layout structure (Header, Container, Grid)

### Phase 2: User Stories (Week 3-5)
4. US-01: Submit Request form and flow
5. US-02: Agent Triage dashboard and detail view
6. US-03: Manager Insights dashboard

### Phase 3: Polish (Week 6)
7. Accessibility audit and fixes
8. Responsive design for mobile/tablet
9. Loading states, transitions, micro-interactions

---

## Design Tokens Integration

### Option A: CSS Custom Properties
Convert tokens.json to CSS:

```css
:root {
  /* Colors */
  --color-primary-500: #2196f3;
  --color-primary-600: #1e88e5;
  --color-neutral-white: #ffffff;
  
  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-4: 16px;
  
  /* Typography */
  --font-size-base: 16px;
  --font-weight-medium: 500;
  
  /* Border Radius */
  --border-radius-base: 8px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
```

### Option B: JavaScript/TypeScript Theme Object
For React/Vue component libraries:

```typescript
export const theme = {
  colors: {
    primary: {
      500: '#2196f3',
      600: '#1e88e5',
    },
    neutral: {
      white: '#ffffff',
      // ...
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    // ...
  },
  // ...
};
```

<!-- TODO: Choose approach based on frontend tech stack -->

---

## Component Implementation Guide

### Button Component

**Design Spec**: See [`components.md`](../design-system/components.md#buttons)

**React Example**:
```tsx
<Button 
  variant="primary" 
  size="medium"
  onClick={handleSubmit}
>
  Submit Request
</Button>
```

**Required Props**:
- `variant`: 'primary' | 'secondary' | 'text'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean (optional)
- `onClick`: function

**Accessibility Requirements**:
- Must support keyboard (Enter/Space)
- Focus indicator visible
- `aria-label` if icon-only
- Min 44x44px touch target

---

## Page-by-Page Implementation

### US-01: Submit Request Page

**Figma Frame**: [Link to Figma frame]

**Route**: `/submit` or `/intake`

**Components Needed**:
- Page header
- Form container
- Text input (title)
- Textarea (description)
- Dropdown (category)
- Dropdown (priority)
- Primary button (submit)
- Alert (success/error)

**Form Fields** (from `contracts/schemas/request.schema.json`):
```typescript
{
  title: string;        // Required, max 200 chars
  description: string;  // Required
  category: string;     // Required, from predefined list
  priority: string;     // Required, P0-P3
  requestedBy: string;  // Auto-filled from auth
}
```

**Validation**:
- All fields required
- Title: 10-200 characters
- Category: Must be from approved list
- Reference: `contracts/data-models/business-rules.md`

**User Flow**: See [`../user-flows/submit-request-flow.mmd`](../user-flows/submit-request-flow.mmd)

**TODO**:
- [ ] Implement form state management
- [ ] Add client-side validation
- [ ] Handle API errors gracefully
- [ ] Show confirmation on success
- [ ] Navigate to detail page after submission

---

### US-02: Agent Triage Page

**Figma Frame**: [Link to Figma frame]

**Route**: `/triage`

**Components Needed**:
- Request queue table
- Filter/sort controls
- Request detail panel
- Triage form (category, priority, assignment)
- AI suggestion badge (if available)
- Save button

**Data Structure**: See `contracts/schemas/request.schema.json`

**Features**:
1. **Queue View**: Table with columns for ID, title, status, priority, category, created date
2. **Filtering**: By priority, category, status, date range
3. **Sorting**: By any column
4. **AI Integration**: Show suggested category/priority if available (from `contracts/integration-points/ai-automation-input.schema.json`)
5. **Inline Editing**: Update fields without page reload

**User Flow**: See [`../user-flows/agent-triage-flow.mmd`](../user-flows/agent-triage-flow.mmd)

**TODO**:
- [ ] Implement table with sort/filter
- [ ] Fetch requests from API
- [ ] Display AI suggestions if available
- [ ] Update request on save
- [ ] Refresh queue after update

---

### US-03: Manager Insights Page

**Figma Frame**: [Link to Figma frame]

**Route**: `/insights` or `/dashboard`

**Components Needed**:
- Dashboard header with date range picker
- Metric cards (totals, trends)
- Volume chart (line/bar)
- Category breakdown (pie/donut)
- Agent performance table
- Export button

**Metrics** (see `packages/bia/docs/METRIC-DEFINITIONS.md`):
- Total requests
- Avg resolution time
- SLA compliance %
- Request volume by category
- Requests by agent

**Charts**:
- Use library: Chart.js, Recharts, or D3
- Apply design tokens for colors
- Ensure color is not the only differentiator (use patterns/labels)
- Provide data table alternative for accessibility

**User Flow**: See [`../user-flows/manager-insights-flow.mmd`](../user-flows/manager-insights-flow.mmd)

**TODO**:
- [ ] Implement dashboard layout
- [ ] Fetch analytics data from API
- [ ] Render charts with accessible alternatives
- [ ] Add date range filtering
- [ ] Implement export functionality

---

## Responsive Design

### Breakpoints
<!-- TODO: Define breakpoints based on design -->

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Considerations
- Form fields stack vertically
- Table becomes card list on mobile
- Charts resize or switch to simpler views
- Touch targets minimum 44x44px
- Hamburger menu for navigation

---

## States & Interactions

### Loading States
- Show skeleton screens or spinners while data loads
- Disable form during submission
- Use `role="status"` and `aria-live="polite"`

### Empty States
- No requests: Show friendly message and CTA
- No search results: Show "No results" message
- No data in charts: Show placeholder

### Error States
- Form validation errors: Inline with field
- API errors: Alert banner at top
- Network errors: Retry button

### Success States
- Form submission: Success alert + redirect or stay
- Update saved: Toast notification
- Export complete: Download prompt

---

## Animation & Transitions

### Micro-interactions
<!-- TODO: Define specific animations -->

- Button hover: Scale slightly or darken
- Card hover: Lift with shadow
- Form focus: Border color change + glow
- Modal: Fade in background, slide down content
- Toast: Slide in from top-right, auto-dismiss after 5s

### Performance
- Use CSS transforms (not layout properties)
- Prefer `transition` over `animation` for simple changes
- Avoid animating many elements simultaneously

---

## Accessibility Handoff

### Must-Haves
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (3:1 contrast)
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers
- [ ] ARIA roles/attributes for custom components
- [ ] Color contrast ≥ 4.5:1

### Testing Requirements
- Test with keyboard only (no mouse)
- Test with screen reader (NVDA, VoiceOver)
- Run Lighthouse accessibility audit (score ≥ 90)
- Validate HTML (no structural errors)

**Full Guidelines**: [`../accessibility/a11y-guidelines.md`](../accessibility/a11y-guidelines.md)

---

## Integration Points

### API Endpoints
Reference: `packages/backend/docs/API.md`

- `POST /api/requests` - Submit request
- `GET /api/requests` - Get request queue
- `PATCH /api/requests/:id` - Update request (triage)
- `GET /api/analytics` - Get dashboard metrics

### Data Contracts
- Request schema: `contracts/schemas/request.schema.json`
- User schema: `contracts/schemas/user.schema.json`
- API spec: `contracts/schemas/api-contract.yml`

### Mock Data
Use `contracts/mock-data/` for development before backend is ready.

---

## Design QA Checklist

Before marking a feature complete, verify:

- [ ] Matches Figma design (spacing, colors, typography)
- [ ] Uses design tokens (not hardcoded values)
- [ ] All states implemented (default, hover, focus, disabled, error, loading)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (keyboard, screen reader, contrast)
- [ ] Smooth animations/transitions
- [ ] No console errors or warnings
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

---

## Communication

### Questions & Clarifications
- Post questions in design-dev channel
- Tag @ux-designer for design-specific questions
- Schedule design review sessions weekly

### Feedback Loop
1. Developer implements feature
2. Post screenshot/video in channel
3. Designer reviews and provides feedback
4. Developer iterates
5. Designer signs off

### Design Changes
- Minor tweaks: Update Figma + notify in channel
- Major changes: Schedule sync meeting with team

---

## References

- **User Flows**: [`../user-flows/`](../user-flows/)
- **Design Tokens**: [`../design-system/tokens.json`](../design-system/tokens.json)
- **Components**: [`../design-system/components.md`](../design-system/components.md)
- **A11y Guidelines**: [`../accessibility/a11y-guidelines.md`](../accessibility/a11y-guidelines.md)
- **Design Decisions**: [`../docs/DESIGN-DECISIONS.md`](../docs/DESIGN-DECISIONS.md)
- **Contracts**: [`../../../contracts/`](../../../contracts/)
- **Frontend Package**: [`../../frontend/`](../../frontend/)
