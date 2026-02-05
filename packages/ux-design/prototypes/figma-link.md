# Figma Prototype

## Overview
This document provides instructions for linking to and embedding the Figma prototype for the Request Management System.

---

## Figma Project Link
<!-- TODO: Add link to your Figma project once created -->

**Project URL**: [Insert Figma link here]

**Access**: 
- Ensure the link is set to "Anyone with the link can view"
- For edit access, share with team members via email

---

## Prototype Screens

### US-01: Submit Request Flow
<!-- TODO: Add links to specific frames -->

- **Screen 1**: Request form (empty state)
- **Screen 2**: Request form (filled, showing validation)
- **Screen 3**: Confirmation screen
- **Screen 4**: Request detail view

**Prototype Link**: [Insert prototype link for US-01]

### US-02: Agent Triage Flow
<!-- TODO: Add links to specific frames -->

- **Screen 1**: Triage dashboard with request queue
- **Screen 2**: Request detail view (agent perspective)
- **Screen 3**: Triage form with AI suggestions
- **Screen 4**: Updated request confirmation

**Prototype Link**: [Insert prototype link for US-02]

### US-03: Manager Insights Flow
<!-- TODO: Add links to specific frames -->

- **Screen 1**: Insights dashboard (overview)
- **Screen 2**: Volume trends chart
- **Screen 3**: Agent performance metrics
- **Screen 4**: Export options

**Prototype Link**: [Insert prototype link for US-03]

---

## Design System Resources

### Design File
**URL**: [Insert design system Figma link]

### Included Components
- Buttons (primary, secondary, text)
- Form inputs (text, textarea, select, date)
- Cards
- Navigation
- Tables/Lists
- Charts placeholders
- Modals
- Alerts/notifications

### Design Tokens
See [`design-system/tokens.json`](../design-system/tokens.json) for exportable token values.

---

## How to Embed in Documentation

### Markdown Embed (won't render in all viewers)
```markdown
![Figma Prototype](https://www.figma.com/embed?embed_host=share&url=YOUR_FIGMA_URL)
```

### HTML iframe (for web documentation)
```html
<iframe 
  style="border: 1px solid rgba(0, 0, 0, 0.1);" 
  width="800" 
  height="450" 
  src="https://www.figma.com/embed?embed_host=share&url=YOUR_FIGMA_URL" 
  allowfullscreen>
</iframe>
```

### Image Export
If interactive prototype isn't viewable:
1. Export key screens as PNG/JPG from Figma
2. Add to `prototypes/images/` directory
3. Reference images in documentation

---

## Feedback Process

### Collecting Feedback in Figma
1. Enable comments on the Figma file
2. Share link with stakeholders
3. Reviewers can leave comments directly on designs
4. Consolidate feedback in `docs/DESIGN-DECISIONS.md`

### User Testing with Prototype
1. Share prototype link (not edit link)
2. Use Figma's presentation mode
3. Observe users completing tasks:
   - Submit a request
   - Triage requests as an agent
   - View insights as a manager
4. Document findings in `research/success-metrics.md`

---

## Version History
<!-- TODO: Track major design iterations -->

| Version | Date | Changes | Link |
|---------|------|---------|------|
| v0.1 | <!-- Date --> | Initial wireframes | <!-- Link --> |
| v0.2 | <!-- Date --> | High-fidelity mockups | <!-- Link --> |
| v1.0 | <!-- Date --> | Final designs for handoff | <!-- Link --> |

---

## Handoff to Frontend
See [`handoff/dev-handoff.md`](../handoff/dev-handoff.md) for detailed instructions on how frontend developers should use these designs.

---

## References
- User Stories: [`contracts/user-stories/`](../../../contracts/user-stories/)
- User Flows: [`user-flows/`](../user-flows/)
- Design System: [`design-system/`](../design-system/)
