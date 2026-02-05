# Design Decisions

## Overview
This document captures key design decisions, rationale, and trade-offs for the Request Management System UI/UX.

---

## Decision Log

### DD-001: Single-Page vs. Multi-Page Application
**Date**: <!-- TODO: Add date -->  
**Decision**: Single-page application (SPA) with client-side routing  
**Rationale**:
- Faster navigation between views (no full page reloads)
- Better user experience for dashboard with real-time updates
- Aligns with modern web development practices
- Frontend team has experience with React/Vue SPA frameworks

**Alternatives Considered**:
- Multi-page app: Simpler but slower transitions
- Hybrid: Added complexity without significant benefit

**Trade-offs**:
- ✅ Pros: Fast, smooth UX; easier state management
- ❌ Cons: Larger initial bundle size; SEO less relevant for internal tool

**Status**: Approved

---

### DD-002: Component Library Choice
**Date**: <!-- TODO: Add date -->  
**Decision**: <!-- e.g., Material-UI, shadcn/ui, custom components -->  
**Rationale**: <!-- TODO: Document why a specific library or custom approach -->

**Options**:
1. **Material-UI**: Full-featured, accessible, well-documented
2. **shadcn/ui**: Modern, customizable, copy-paste components
3. **Custom**: Full control but requires more development time

**Recommendation**: Start with a library for speed, customize with design tokens

**Status**: <!-- TODO: To be decided by team -->

---

### DD-003: Form Layout - Single Page vs. Multi-Step
**Date**: <!-- TODO: Add date -->  
**Decision**: Single-page form for request submission (US-01)  
**Rationale**:
- Only 4 required fields (title, description, category, priority)
- Multi-step would add unnecessary friction
- User research indicated preference for "quick submit"
- Reduces abandonment rate

**Alternatives**:
- Multi-step wizard: Better for 10+ fields, overkill here
- Progressive disclosure: Show category first, then relevant fields - considered for Phase 2

**Status**: Approved

---

### DD-004: Priority Visualization - Colors and Icons
**Date**: <!-- TODO: Add date -->  
**Decision**: Use both color AND icon/label for priority  
**Rationale**:
- Accessibility: Color alone is not sufficient (WCAG 1.4.1)
- Icons provide quick visual scanning
- Text labels ensure clarity

**Implementation**:
- P0 Critical: Red background + "🔥" icon + "CRITICAL" label
- P1 High: Orange background + "⚡" icon + "HIGH" label
- P2 Medium: Blue background + "➡️" icon + "MEDIUM" label
- P3 Low: Green background + "⬇️" icon + "LOW" label

**Status**: Approved

---

### DD-005: Request Queue - Table vs. Card List
**Date**: <!-- TODO: Add date -->  
**Decision**: Table on desktop, cards on mobile  
**Rationale**:
- Desktop: Agents need to scan many requests quickly - table is efficient
- Mobile: Cards stack better, avoid horizontal scroll
- Responsive pattern: Table collapses to cards < 768px

**Trade-offs**:
- Requires two UI implementations
- Acceptable complexity for better UX on each device

**Status**: Approved

---

### DD-006: AI Suggestions - Display Approach
**Date**: <!-- TODO: Add date -->  
**Decision**: Show AI suggestions as badges with "AI Suggested" label + accept/reject buttons  
**Rationale**:
- Transparency: Users know it's AI-generated
- Control: Agent can override
- Trust: Clear attribution builds confidence
- Visual distinction: Dashed border around suggestion

**Mockup**:
```
Category: [IT Support ✓]  ← AI Suggested  [Accept] [Edit]
Priority: [P1 - High ✓]   ← AI Suggested  [Accept] [Edit]
```

**Status**: <!-- TODO: Validate with AI team -->

---

### DD-007: Dashboard Charts - Type Selection
**Date**: <!-- TODO: Add date -->  
**Decision**: 
- Volume over time: Line chart
- Category breakdown: Donut chart
- Agent performance: Horizontal bar chart

**Rationale**:
- Line chart: Shows trends effectively
- Donut chart: Easier to compare proportions than pie
- Horizontal bars: Agent names are readable (vertical would be cramped)

**Accessibility**:
- Each chart has data table alternative
- Color + patterns used for differentiation
- Hover tooltips show exact values

**Status**: <!-- TODO: Validate with stakeholders -->

---

### DD-008: Navigation Structure
**Date**: <!-- TODO: Add date -->  
**Decision**: Top navigation bar with role-based menu items  
**Rationale**:
- Simple hierarchy (3 main pages)
- Top nav is familiar pattern
- Role-based: Requester sees "Submit", Agents see "Triage", Managers see "Insights"

**Menu Structure**:
- **Requester**: My Requests | Submit Request
- **Agent**: Triage Queue | My Assignments | Submit Request
- **Manager**: Insights | Team Performance | Submit Request

**Status**: <!-- TODO: Finalize with product -->

---

### DD-009: Dark Mode Support
**Date**: <!-- TODO: Add date -->  
**Decision**: Light mode only for MVP, dark mode in Phase 2  
**Rationale**:
- Time constraint: Dark mode doubles design and testing effort
- User research: Not a top priority for internal business tool
- Can add later with design tokens structure in place

**Future Work**:
- Add dark mode toggle
- Define dark color palette in tokens.json
- Test contrast in both modes

**Status**: Deferred to Phase 2

---

### DD-010: Loading States
**Date**: <!-- TODO: Add date -->  
**Decision**: Skeleton screens over spinners for data-heavy views  
**Rationale**:
- Perceived performance: Skeleton shows structure immediately
- Reduces layout shift when content loads
- Modern UX pattern

**Where to Use**:
- Dashboard: Skeleton for charts and metrics
- Request queue: Skeleton rows
- Simple forms: Spinner is acceptable

**Status**: Approved

---

### DD-011: Mobile Experience Scope
**Date**: <!-- TODO: Add date -->  
**Decision**: <!-- TODO: Decide if full mobile parity or desktop-focused -->  
**Options**:
1. **Full mobile parity**: All features work perfectly on mobile
2. **Desktop-optimized**: Mobile is functional but "best viewed on desktop" message
3. **Progressive**: Start with US-01 mobile-friendly, add US-02/03 later

**Consideration**: Agent triage on mobile has limited use case (agents at desks)

**Status**: <!-- TODO: Decide with product team -->

---

### DD-012: Error Handling Strategy
**Date**: <!-- TODO: Add date -->  
**Decision**: Inline errors for forms, toast for async actions, banner for critical issues  
**Rationale**:
- **Inline**: User sees error next to offending field
- **Toast**: Non-blocking notification for background actions
- **Banner**: Persistent for global issues (auth failure, network down)

**Examples**:
- Form validation: Inline below field
- Save successful: Toast (auto-dismiss)
- API down: Banner at top (persistent, dismissible)

**Status**: Approved

---

## Design Principles

### 1. Clarity Over Cleverness
Prioritize clear, obvious UI patterns over novel designs. Users should understand interface without training.

### 2. Progressive Disclosure
Show essential information first, hide advanced options until needed. Reduces cognitive load.

### 3. Feedback & Affordance
Every action has visible feedback. Buttons look clickable, forms show validation, actions confirm success.

### 4. Consistency
Reuse patterns across pages. Same interaction should work the same way everywhere.

### 5. Accessibility First
Design for all users from the start. Don't retrofit accessibility later.

---

## Open Questions

<!-- TODO: Track unresolved design questions -->

1. **Q**: Should agents be able to batch-process requests (multi-select)?  
   **Status**: Pending product review

2. **Q**: Do we need request comments/notes thread?  
   **Status**: Deferred to Phase 2

3. **Q**: Should dashboard auto-refresh or manual refresh button?  
   **Status**: To discuss with stakeholders

4. **Q**: Export format for dashboard - PDF, CSV, or both?  
   **Status**: <!-- TODO -->

---

## Stakeholder Feedback

### Iteration 1 (Wireframes)
**Date**: <!-- TODO -->  
**Feedback**:
- [ ] <!-- e.g., Product: Need quick view of SLA status on dashboard -->
- [ ] <!-- e.g., Engineering: Form feels too long, simplify if possible -->

**Changes Made**:
- <!-- e.g., Added SLA indicator to dashboard -->

### Iteration 2 (High-Fidelity)
**Date**: <!-- TODO -->  
**Feedback**:
- [ ] <!-- TODO: Add feedback from design reviews -->

---

## User Testing Insights

### Test Round 1
**Date**: <!-- TODO -->  
**Participants**: <!-- 5 users (2 requesters, 2 agents, 1 manager) -->  
**Key Findings**:
- [ ] <!-- e.g., 3/5 users confused by priority selection - added tooltip -->
- [ ] <!-- e.g., Agents wanted keyboard shortcuts for triage - added to roadmap -->

**Changes Made**:
- <!-- e.g., Added priority helper text explaining P0-P3 -->

---

## References

- User Research: [`../research/`](../research/)
- User Flows: [`../user-flows/`](../user-flows/)
- Components: [`../design-system/components.md`](../design-system/components.md)
- A11y Guidelines: [`../accessibility/a11y-guidelines.md`](../accessibility/a11y-guidelines.md)
