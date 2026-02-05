# Business Rules

This document defines the business logic and validation rules for the support request system.

## Request Creation Rules

### REQ-001: Minimum Information Required
- **Rule**: All new requests must include `title`, `description`, `category`, `requester_type`, and `channel`
- **Validation**: Reject creation if any required field is missing
- **Error Code**: `MISSING_REQUIRED_FIELD`

### REQ-002: Auto-Assignment of Priority
- **Rule**: If priority is not specified during creation, assign based on:
  1. Category + keyword analysis
  2. Requester type (enterprise → minimum P2)
  3. Channel (phone → higher priority)
- **Default**: P3 if no rules match
- **Implementation**: Priority suggestion algorithm in backend

### REQ-003: Initial Status
- **Rule**: All new requests must start with status `new`
- **Exception**: Internal requests can be created with status `triaged` if pre-categorized
- **Validation**: Reject if client tries to create with different status

### REQ-004: ID Generation
- **Rule**: Request IDs are auto-generated in format `REQ-XXXXXX` with zero-padded sequential numbers
- **Implementation**: Database sequence starting at 000001
- **Validation**: Client cannot provide custom ID

---

## Assignment Rules

### ASN-001: Assignment Required for Work
- **Rule**: Requests must have `assigned_to` set when status transitions to `in_progress` or `waiting`
- **Validation**: Reject status transition if `assigned_to` is null
- **Error Code**: `ASSIGNMENT_REQUIRED`

### ASN-002: Agent Capacity Limits
- **Rule**: Agents can have maximum capacity based on priority:
  - P0: Maximum 2 concurrent requests
  - P1: Maximum 5 concurrent requests
  - P2: Maximum 10 concurrent requests
  - P3: Maximum 20 concurrent requests
- **Validation**: Warn (but don't block) when assigning beyond capacity
- **Implementation**: Advisory warning in UI

### ASN-003: Team-Based Routing
- **Rule**: Route requests based on category to team:
  - `technical` → technical team
  - `billing` → billing team
  - `account` → account team
  - `general` → general team
- **Implementation**: Default agent suggestion in triage UI
- **Override**: Manager can override routing

### ASN-004: Cannot Unassign Active Requests
- **Rule**: Cannot remove `assigned_to` when status is `in_progress` or `waiting`
- **Exception**: Can reassign to different agent (transfer)
- **Validation**: Reject if trying to set `assigned_to` to null for active requests
- **Error Code**: `CANNOT_UNASSIGN_ACTIVE`

---

## Status Transition Rules

### STS-001: Valid State Transitions Only
- **Rule**: Status transitions must follow the state machine defined in [`request-lifecycle.md`](request-lifecycle.md)
- **Validation**: Reject invalid transitions
- **Error Code**: `INVALID_STATUS_TRANSITION`
- **Error Message**: Include valid transitions from current status

### STS-002: Resolution Code Required for Closure
- **Rule**: `resolution_code` must be set when transitioning to `resolved` or `closed`
- **Validation**: Reject if `resolution_code` is null
- **Error Code**: `RESOLUTION_CODE_REQUIRED`

### STS-003: Auto-Closure Timer (Waiting)
- **Rule**: Requests in `waiting` status for more than 7 days automatically transition to `closed`
- **Resolution Code**: Set to `wont_fix`
- **Implementation**: Daily batch job
- **Notification**: Send email to customer before auto-closing (at 5 days)

### STS-004: Auto-Closure Timer (Resolved)
- **Rule**: Requests in `resolved` status for more than 3 days automatically transition to `closed`
- **Resolution Code**: Preserve existing resolution code
- **Implementation**: Daily batch job
- **Notification**: Send confirmation email to customer

### STS-005: Status Change Event
- **Rule**: Emit `request.status_changed` event on every status transition
- **Payload**: Include `from_status`, `to_status`, `changed_by`
- **Implementation**: Async event publishing

---

## Priority Rules

### PRI-001: Enterprise Minimum Priority
- **Rule**: Requests from `requester_type = enterprise` cannot have priority lower than P2
- **Validation**: Automatically upgrade to P2 if lower priority assigned
- **Override**: Requires manager approval to set to P3

### PRI-002: Priority Escalation on SLA Breach
- **Rule**: Auto-escalate priority when SLA breach threshold reached:
  - 75% of SLA time → Warning notification
  - 90% of SLA time → Escalate to next priority level
  - 100% (breach) → Alert manager + escalate
- **Exception**: Cannot escalate P0 (already highest)
- **Implementation**: Background job checking SLA every 5 minutes

### PRI-003: Cannot Downgrade Priority When In Progress
- **Rule**: Cannot decrease priority when status is `in_progress`
- **Exception**: Manager override with justification note
- **Validation**: Reject priority downgrade for active requests
- **Error Code**: `CANNOT_DOWNGRADE_ACTIVE_PRIORITY`

---

## Field Validation Rules

### VAL-001: Title and Description Quality
- **Rule**: Title and description must not be generic/unhelpful
- **Validation**: Reject if title is in blocklist:
  - "help", "issue", "problem", "urgent", "asap" (standalone)
- **Implementation**: Warning in UI, soft validation

### VAL-002: Tag Constraints
- **Rule**: Tags must be:
  - Lowercase only
  - No special characters except hyphen (-)
  - Maximum 50 characters each
  - Maximum 20 tags per request
  - No duplicates
- **Validation**: Sanitize tags on input (lowercase, trim)
- **Error Code**: `INVALID_TAG_FORMAT`

### VAL-003: Email Format for Notifications
- **Rule**: If request is created via API, must include valid `customer_email` for notifications
- **Validation**: Validate email format
- **Error Code**: `INVALID_EMAIL_FORMAT`

---

## SLA Calculation Rules

### SLA-001: Business Hours Only (P2/P3)
- **Rule**: SLA time for P2 and P3 only counts business hours (Mon-Fri, 9am-6pm local time)
- **Exclusions**: Weekends and holidays
- **Implementation**: Business hours calculator service

### SLA-002: Calendar Time (P0/P1)
- **Rule**: SLA time for P0 and P1 counts calendar time (24/7)
- **Implementation**: Simple timestamp difference

### SLA-003: Pause SLA in Waiting Status
- **Rule**: SLA timer pauses when request is in `waiting` status
- **Rationale**: Waiting for customer response, not our responsibility
- **Resume**: Timer resumes when status changes from `waiting`

### SLA-004: Third-Party Vendor Exclusion
- **Rule**: Time waiting for third-party vendor response can be excluded from SLA
- **Implementation**: Manual flag `external_dependency = true`
- **Approval**: Requires manager to mark as external dependency

---

## Automation Rules

### AUTO-001: Auto-Tag from Content
- **Rule**: Automatically extract and suggest tags from title and description
- **Implementation**: NLP keyword extraction
- **Action**: Suggest tags to agent during triage (not auto-applied)

### AUTO-002: Duplicate Detection
- **Rule**: Flag potential duplicates based on:
  - Similar title (>80% similarity)
  - Same requester
  - Created within 24 hours
- **Action**: Warn agent during triage
- **Resolution**: Agent can mark as duplicate with `resolution_code = duplicate`

### AUTO-003: Spam Detection
- **Rule**: Flag potential spam based on:
  - Known spam patterns in text
  - Suspicious email domains
  - Rate limiting violations (>10 requests/hour from same user)
- **Action**: Auto-set status to `closed` with `resolution_code = spam`
- **Review**: Daily review of auto-closed spam

### AUTO-004: Smart Assignment
- **Rule**: Suggest agent assignment based on:
  - Agent expertise (past successful resolutions in category)
  - Current workload (capacity)
  - SLA urgency
- **Implementation**: ML-based recommendation engine
- **Action**: Suggestion only, not auto-assigned

---

## Data Retention Rules

### RET-001: Closed Request Retention
- **Rule**: Closed requests retained for 2 years in primary database
- **Archive**: After 2 years, move to cold storage
- **Deletion**: Hard delete after 7 years (compliance)

### RET-002: PII Scrubbing
- **Rule**: After 90 days of closure, scrub personally identifiable information (PII)
- **Fields Affected**: Customer email, phone, IP address
- **Retention**: Keep category,