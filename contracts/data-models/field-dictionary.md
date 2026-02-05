# Field Dictionary

Complete reference for all fields in the support request system with descriptions, types, validation rules, and usage guidelines.

## Request Fields

### id
- **Type**: `string`
- **Format**: `REQ-XXXXXX` (6-digit zero-padded number)
- **Required**: Yes (auto-generated)
- **Mutable**: No
- **Description**: Unique identifier for the request
- **Example**: `REQ-000001`, `REQ-123456`
- **Validation**: Must match pattern `^REQ-[0-9]{6}$`
- **Generation**: Auto-incremented sequence starting at REQ-000001

---

### title
- **Type**: `string`
- **Required**: Yes
- **Mutable**: Yes
- **Min Length**: 5 characters
- **Max Length**: 200 characters
- **Description**: Short summary of the request
- **Example**: `"Unable to login to account"`, `"Billing discrepancy on invoice"`
- **Validation**: 
  - Must not be empty or whitespace only
  - Should be descriptive and actionable
- **Best Practices**:
  - Start with action verb or problem statement
  - Avoid vague titles like "Help" or "Issue"

---

### description
- **Type**: `string`
- **Required**: Yes
- **Mutable**: Yes
- **Min Length**: 10 characters
- **Max Length**: 5000 characters
- **Description**: Detailed description of the issue or request
- **Example**: `"I've been trying to log in for the past hour but keep getting an error message 'Invalid credentials' even though I'm certain my password is correct. I tried resetting my password but didn't receive the reset email."`
- **Validation**:
  - Must provide sufficient context
  - Supports markdown formatting
- **Best Practices**:
  - Include steps to reproduce
  - Mention error messages received
  - Note any troubleshooting already attempted

---

### category
- **Type**: `string` (enum)
- **Required**: Yes
- **Mutable**: Yes (during triage)
- **Values**:
  - `technical` - Technical issues, bugs, integrations
  - `account` - Account management, access, permissions
  - `billing` - Payments, invoices, refunds, subscriptions
  - `general` - General inquiries, feedback, other
- **Description**: Category of the support request
- **Example**: `"technical"`, `"billing"`
- **Default**: `"general"` (if not specified)
- **Indexing**: Indexed for filtering and analytics

---

### priority
- **Type**: `string` (enum)
- **Required**: Yes (assigned during triage)
- **Mutable**: Yes (can be escalated/de-escalated)
- **Values**:
  - `P0` - Critical (system outage, data loss)
  - `P1` - High (major functionality broken)
  - `P2` - Medium (minor issue with workaround)
  - `P3` - Low (enhancement, minor inconvenience)
- **Description**: Priority level indicating urgency and SLA targets
- **Default**: Auto-assigned based on category and keywords
- **See Also**: [`priority-definitions.md`](priority-definitions.md)

---

### status
- **Type**: `string` (enum)
- **Required**: Yes
- **Mutable**: Yes (must follow valid transitions)
- **Values**:
  - `new` - Just created, not yet reviewed
  - `triaged` - Reviewed and categorized
  - `in_progress` - Actively being worked on
  - `waiting` - Waiting for customer/external input
  - `resolved` - Issue resolved, awaiting closure
  - `closed` - Final state, request complete
- **Description**: Current status in the request lifecycle
- **Default**: `"new"`
- **Validation**: Must follow valid state transitions
- **See Also**: [`request-lifecycle.md`](request-lifecycle.md)

---

### requester_type
- **Type**: `string` (enum)
- **Required**: Yes
- **Mutable**: No (set based on user's plan)
- **Values**:
  - `free` - Free tier user
  - `paid` - Paid individual plan
  - `enterprise` - Enterprise customer
  - `internal` - Internal employee or test account
- **Description**: Type of user submitting the request
- **Example**: `"paid"`, `"enterprise"`
- **Usage**: Affects priority assignment and SLA targets
- **Business Rules**:
  - Enterprise customers get minimum P2 priority
  - Internal requests can bypass normal triaging

---

### channel
- **Type**: `string` (enum)
- **Required**: Yes
- **Mutable**: No (set at creation)
- **Values**:
  - `email` - Submitted via email
  - `chat` - Live chat or chatbot
  - `phone` - Phone call
  - `web_form` - Web form submission
  - `api` - Programmatic submission via API
- **Description**: Channel through which request was submitted
- **Example**: `"web_form"`, `"email"`
- **Usage**: Used for channel effectiveness analytics
- **Business Rules**:
  - Phone requests often default to higher priority
  - API requests can skip certain validation

---

### created_at
- **Type**: `string` (ISO 8601 datetime)
- **Required**: Yes (auto-generated)
- **Mutable**: No
- **Format**: `YYYY-MM-DDTHH:mm:ss.sssZ` (UTC)
- **Description**: Timestamp when the request was created
- **Example**: `"2026-02-01T10:30:00.000Z"`
- **Indexing**: Indexed for time-based queries
- **Usage**: SLA calculations start from this timestamp

---

### updated_at
- **Type**: `string` (ISO 8601 datetime)
- **Required**: No
- **Mutable**: Yes (auto-updated)
- **Format**: `YYYY-MM-DDTHH:mm:ss.sssZ` (UTC)
- **Description**: Timestamp when the request was last updated
- **Example**: `"2026-02-01T15:45:00.000Z"`
- **Auto-Update**: Updated on any field change
- **Indexing**: Indexed for sorting recent activity

---

### assigned_to
- **Type**: `string` (nullable)
- **Required**: No
- **Mutable**: Yes
- **Format**: User ID (e.g., `agent-042`)
- **Description**: ID of the agent assigned to this request
- **Example**: `"agent-042"`, `null`
- **Default**: `null` (unassigned)
- **Validation**: Must be valid agent user ID
- **Business Rules**:
  - Required when status is `in_progress` or `waiting`
  - Cannot be removed while in those statuses
  - Assignment triggers `request.assigned` event

---

### resolution_code
- **Type**: `string` (enum, nullable)
- **Required**: No (required when status is `resolved` or `closed`)
- **Mutable**: Yes
- **Values**:
  - `solved` - Issue successfully resolved
  - `workaround` - Workaround provided
  - `duplicate` - Duplicate of another request
  - `wont_fix` - Won't fix (by design, out of scope)
  - `spam` - Spam or invalid request
  - `null` - Not yet resolved
- **Description**: Code indicating how the request was resolved
- **Example**: `"solved"`, `"workaround"`, `null`
- **Validation**: Can only be set when status is `resolved` or `closed`
- **Usage**: Used for resolution analytics and reporting

---

### tags
- **Type**: `array` of `string`
- **Required**: No
- **Mutable**: Yes
- **Max Items**: 20
- **Item Max Length**: 50 characters
- **Description**: Array of tags for categorization and search
- **Example**: `["login", "authentication"]`, `["payment", "refund"]`
- **Validation**:
  - Each tag must be lowercase
  - No duplicate tags
  - Special characters not allowed
- **Usage**:
  - Enhances searchability
  - Used for custom reporting
  - Can trigger automation rules

---

## User Fields

### id
- **Type**: `string`
- **Format**: `(user|agent|manager)-XXX` 
- **Required**: Yes
- **Description**: Unique identifier for the user
- **Example**: `"user-001"`, `"agent-042"`, `"manager-001"`

---

### name
- **Type**: `string`
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Description**: Full name of the user
- **Example**: `"John Doe"`, `"Jane Smith"`

---

### email
- **Type**: `string` (email format)
- **Required**: Yes
- **Format**: Valid email address
- **Description**: Email address of the user
- **Example**: `"john.doe@example.com"`
- **Validation**: Must be valid email format
- **Unique**: Yes (one email per user)

---

### role
- **Type**: `string` (enum)
- **Required**: Yes
- **Values**:
  - `requester` - Customer submitting requests
  - `agent` - Support agent handling requests
  - `manager` - Manager with oversight and analytics access
- **Description**: Role of the user in the system
- **Mutable**: Yes (with proper authorization)

---

### team
- **Type**: `string` (enum, nullable)
- **Required**: No (only for agents and managers)
- **Values**:
  - `technical` - Technical support team
  - `billing` - Billing/finance team
  - `account` - Account management team
  - `general` - General support team
  - `null` - Not applicable (for requesters)
- **Description**: Team the user belongs to
- **Usage**: Used for routing and assignment logic

---

## Indexing Strategy

### Primary Indexes
- `id` - Unique primary key
- `created_at` - Time-series queries
- `status` + `priority` - Triage queue
- `assigned_to` - Agent workload

### Secondary Indexes
- `category` - Filtering
- `requester_type` - Segmentation
- `tags` - Full-text search
- `updated_at` - Recent activity

---

## Validation Rules Summary

| Field | Min | Max | Pattern | Enum | Required | Mutable |
|-------|-----|-----|---------|------|----------|---------|
| id | - | - | `^REQ-[0-9]{6}$` | - | Yes | No |
| title | 5 | 200 | - | - | Yes | Yes |
| description | 10 | 5000 | - | - | Yes | Yes |
| category | - | - | - | Yes | Yes | Yes |
| priority | - | - | - | Yes | Yes | Yes |
| status | - | - | - | Yes | Yes | Yes |
| requester_type | - | - | - | Yes | Yes | No |
| channel | - | - | - | Yes | Yes | No |
| assigned_to | - | - | User ID | - | No | Yes |
| resolution_code | - | - | - | Yes | No | Yes |
| tags | 0 | 20 | - | - | No | Yes |
