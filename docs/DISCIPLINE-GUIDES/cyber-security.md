# Cyber Security Discipline Guide

## 🎯 Role Overview

As a **Cyber Security** specialist, you identify security risks, assess threats, and provide recommendations to protect the Ops Triage Application and its data. Your work ensures the system is secure by design and meets security best practices.

### Your Impact

- **User data is protected** through your security policies
- **Vulnerabilities are identified** before attackers exploit them
- **Compliance is achieved** through security controls
- **Trust is built** with secure design

## 📋 Required Deliverables

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **STRIDE Threat Model** | [`packages/security/threat-model/STRIDE-analysis.md`](../../packages/security/threat-model/STRIDE-analysis.md) | Comprehensive threat analysis |
| **Attack Vectors** | [`packages/security/threat-model/attack-vectors.md`](../../packages/security/threat-model/attack-vectors.md) | Specific attack scenarios |
| **Security Policies** | [`packages/security/policies/`](../../packages/security/policies/) | Authentication, data handling policies |
| **OWASP Top 10** | [`packages/security/checklists/owasp-top-10.md`](../../packages/security/checklists/owasp-top-10.md) | Checklist and remediation |
| **Security Summary** | [`packages/security/docs/SECURITY-SUMMARY.md`](../../packages/security/docs/SECURITY-SUMMARY.md) | Executive summary of findings |

## 🛠️ Tools & Frameworks

### Threat Modeling

- **STRIDE Framework**: Systematic threat identification
- **Microsoft Threat Modeling Tool**: Visual threat modeling (optional)
- **OWASP Threat Dragon**: Web-based threat modeling

### Security Assessment

- **OWASP Top 10**: Web application security risks
- **SANS Top 25**: Most dangerous software weaknesses
- **CWE**: Common Weakness Enumeration

### Tools (Optional)

```yaml
Static Analysis:
  - npm audit (Node.js vulnerabilities)
  - Snyk (dependency scanning)
  - SonarQube (code quality + security)

Dynamic Analysis:
  - OWASP ZAP (penetration testing)
  - Burp Suite (web security testing)
  
Browser Extensions:
  - WAVE (accessibility also covers some security)
  - Wappalyzer (technology detection)
```

## 🚀 Setup & Approach

### 1. Understand the System

Review:
- **Architecture**: [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md)
- **API Contract**: [`contracts/schemas/api-contract.yml`](../../contracts/schemas/api-contract.yml)
- **User Stories**: [`contracts/user-stories/`](../../contracts/user-stories/)
- **Code**: Browse through packages/frontend and packages/backend

### 2. Install Security Tools (Optional)

```bash
# Dependency scanning
npm install -g snyk
snyk auth

# Or use npm audit (built-in)
cd packages/backend && npm audit

# OWASP ZAP
# Download from https://www.zaproxy.org/download/
```

## 📖 Threat Modeling with STRIDE

### STRIDE Framework

**S** - Spoofing Identity  
**T** - Tampering with Data  
**R** - Repudiation  
**I** - Information Disclosure  
**D** - Denial of Service  
**E** - Elevation of Privilege

### STRIDE Analysis Template

**File**: [`threat-model/STRIDE-analysis.md`](../../packages/security/threat-model/STRIDE-analysis.md)

```markdown
# STRIDE Threat Model - Ops Triage Application

## System Overview
Brief description of the system architecture, components, and data flows.

## Assets
1. **User Credentials**: Passwords, session tokens
2. **Request Data**: Potentially sensitive IT issues, user information
3. **Agent Data**: Performance metrics, assignments
4. **API Keys**: LLM API keys, database credentials
5. **Business Logic**: Triage algorithms, SLA calculations

## Threats by STRIDE Category

### S - Spoofing Identity

#### Threat S1: Impersonation of IT Agent
**Description**: Attacker gains access to agent credentials and approves/closes tickets fraudulently.

**Severity**: HIGH  
**Likelihood**: MEDIUM  
**Impact**: HIGH (unauthorized access, fraudulent activity)

**Attack Scenario**:
1. Attacker phishes agent credentials
2. Logs in as agent
3. Modifies or closes high-priority tickets
4. Covers tracks by deleting audit logs

**Mitigations**:
- [ ] Implement strong password policy (min 12 chars, complexity)
- [ ] Add multi-factor authentication (MFA)
- [ ] Session timeout after 30 minutes of inactivity
- [ ] Log all authentication attempts
- [ ] Rate limit login attempts

**Status**: ⚠️ Partial (passwords stored, no MFA)

---

#### Threat S2: API Authentication Bypass
**Description**: Attacker bypasses API authentication to access/modify requests.

**Severity**: CRITICAL  
**Likelihood**: MEDIUM  
**Impact**: CRITICAL (full data access)

**Mitigations**:
- [ ] Implement JWT-based authentication
- [ ] Validate JWT on every API request
- [ ] Use HTTPS only (reject HTTP)
- [ ] Short-lived tokens (1 hour expiry)

**Status**: ⚠️ Needs implementation

---

### T - Tampering with Data

#### Threat T1: Request Data Modification
**Description**: Unauthorized modification of request priority, status, or content.

**Severity**: HIGH  
**Likelihood**: MEDIUM  
**Impact**: HIGH (SLA violations, incorrect triage)

**Attack Scenario**:
1. Attacker intercepts API request
2. Modifies request JSON (e.g., changes priority P3 → P0)
3. Server processes tampered data

**Mitigations**:
- [ ] HTTPS/TLS for all communications
- [ ] Input validation on API endpoints
- [ ] Role-based access control (agents can't change their own tickets)
- [ ] Audit logging of all changes

**Status**: ⚠️ Partial (validation exists)

---

#### Threat T2: SQL/NoSQL Injection
**Description**: Attacker injects malicious queries to manipulate database.

**Severity**: CRITICAL  
**Likelihood**: LOW (with Mongoose)  
**Impact**: CRITICAL (data breach, deletion)

**Mitigations**:
- [x] Use Mongoose ORM (parameterized queries)
- [ ] Input validation and sanitization
- [ ] Principle of least privilege for DB user
- [ ] Regular security audits

**Status**: ✅ Using Mongoose (low risk)

---

### R - Repudiation

#### Threat R1: Denial of Actions
**Description**: User or agent claims they didn't perform an action.

**Severity**: MEDIUM  
**Likelihood**: LOW  
**Impact**: MEDIUM (disputes, compliance issues)

**Mitigations**:
- [ ] Comprehensive audit logging
- [ ] Log: Who, What, When, IP address
- [ ] Immutable audit trail
- [ ] Timestamp verification

**Status**: ⚠️ Needs implementation

---

### I - Information Disclosure

#### Threat I1: Unauthorized Data Access
**Description**: Attacker accesses sensitive request data they shouldn't see.

**Severity**: HIGH  
**Likelihood**: MEDIUM  
**Impact**: HIGH (privacy breach, compliance violation)

**Attack Scenario**:
1. User submits request with ID 123
2. Tries to access /api/requests/124 (someone else's)
3. Should be denied but might succeed if no authz check

**Mitigations**:
- [ ] Authorization checks on all GET endpoints
- [ ] Users can only see their own requests
- [ ] Agents can only see assigned requests (or manager sees all)
- [ ] Role-based access control (RBAC)

**Status**: ⚠️ Critical - implement immediately

---

#### Threat I2: Sensitive Data in Logs
**Description**: PII or credentials logged in plain text.

**Severity**: MEDIUM  
**Likelihood**: HIGH  
**Impact**: MEDIUM (data breach via log access)

**Mitigations**:
- [ ] Never log passwords, tokens, or API keys
- [ ] Sanitize logs before writing
- [ ] Secure log storage (encrypt at rest)
- [ ] Log rotation and retention policy

**Status**: ⚠️ Review needed

---

#### Threat I3: Exposed API Keys
**Description**: API keys committed to Git or exposed in client code.

**Severity**: HIGH  
**Likelihood**: MEDIUM  
**Impact**: HIGH (unauthorized API usage, cost)

**Mitigations**:
- [x] Use environment variables (.env)
- [x] .gitignore includes .env files
- [ ] Never send API keys to frontend
- [ ] Rotate keys regularly
- [ ] API key restrictions (allowed IPs, domains)

**Status**: ✅ Using .env correctly

---

### D - Denial of Service

#### Threat D1: API Rate Limit Abuse
**Description**: Attacker floods API with requests, making it unavailable.

**Severity**: MEDIUM  
**Likelihood**: MEDIUM  
**Impact**: MEDIUM (service unavailable)

**Mitigations**:
- [ ] Rate limiting (e.g., 100 requests per 15 minutes per IP)
- [ ] Request size limits
- [ ] Timeout on long-running queries
- [ ] CDN/Load balancer with DDoS protection

**Status**: ⚠️ Needs implementation

---

#### Threat D2: Database Resource Exhaustion
**Description**: Malicious queries consume all database resources.

**Severity**: MEDIUM  
**Likelihood**: LOW  
**Impact**: HIGH (service unavailable)

**Mitigations**:
- [ ] Query timeouts
- [ ] Pagination on list endpoints (max 100 per page)
- [ ] Index optimization
- [ ] Connection pooling

**Status**: ⚠️ Partial (pagination needed)

---

### E - Elevation of Privilege

#### Threat E1: Regular User Acts as Agent
**Description**: Regular user changes role to agent, accesses admin functions.

**Severity**: HIGH  
**Likelihood**: LOW  
**Impact**: HIGH (unauthorized admin actions)

**Mitigations**:
- [ ] Role verified on server, never trust client
- [ ] User roles immutable without admin approval
- [ ] All role checks server-side
- [ ] Audit log role changes

**Status**: ⚠️ Implement server-side checks

---

#### Threat E2: Agent Escalates to Manager
**Description**: Agent modifies own account to manager role.

**Severity**: MEDIUM  
**Likelihood**: LOW  
**Impact**: MEDIUM (access to analytics, team data)

**Mitigations**:
- [ ] Role changes require manager approval
- [ ] Separate admin API for role management
- [ ] Multi-factor auth for sensitive operations

**Status**: ⚠️ Needs implementation

---

## Summary

**Total Threats Identified**: 14  
**Critical**: 2  
**High**: 6  
**Medium**: 6  
**Low**: 0

**Immediate Actions Required**:
1. Implement authorization checks (Threat I1)
2. Add JWT authentication (Threat S2)
3. Implement rate limiting (Threat D1)
4. Add audit logging (Threats R1, T1)
5. Implement RBAC (Threats E1, E2)

**Risk Acceptance**:
- SQL Injection (T2): Low risk with Mongoose ORM
- Some threats acceptable for MVP but must document

## Next Steps
1. Prioritize mitigations by severity × likelihood
2. Create security policies for authentication, data handling
3. Review code for OWASP Top 10 vulnerabilities
4. Conduct security testing
```

### Attack Vectors Document

**File**: [`threat-model/attack-vectors.md`](../../packages/security/threat-model/attack-vectors.md)

```markdown
# Attack Vectors

## 1. Frontend Attacks

### Cross-Site Scripting (XSS)
**Vector**: Malicious JavaScript injected via request title/description
**Example**:
```
Title: <script>alert('XSS')</script>
Description: <img src=x onerror="steal_cookies()">
```
**Mitigation**: React auto-escapes by default, but verify for dangerouslySetInnerHTML

### Client-Side Injection
**Vector**: Manipulating React props or localStorage
**Mitigation**: Validate all client-side data before sending to API

---

## 2. API Attacks

### Broken Authentication
**Vector**: Weak password policy, no MFA, session fixation
**Test**: Try accessing /api/requests without authentication

### Broken Authorization
**Vector**: Access other users' data by changing IDs in URL
**Test**:
```bash
# As user 1, try to access user 2's request
curl http://localhost:3000/api/requests/user2-request-id
```

### Mass Assignment
**Vector**: Sending extra fields to change restricted properties
**Example**:
```json
PATCH /api/requests/123
{
  "status": "Resolved",
  "role": "Manager"  // ← Should not be allowed
}
```
**Mitigation**: Whitelist allowed fields

---

## 3. Database Attacks

### NoSQL Injection
**Vector**: Manipulating MongoDB queries
**Example**:
```json
POST /api/auth/login
{
  "email": {"$ne": null},
  "password": {"$ne": null}
}
```
**Mitigation**: Mongoose sanitizes, but validate input types

---

## 4. Infrastructure Attacks

### Exposed Secrets
**Vector**: API keys in Git, environment exposed via error messages
**Check**:
```bash
# Search git history for secrets
git log --all --full-history --source -- **/.env
```

### Dependency Vulnerabilities
**Vector**: Vulnerable npm packages
**Check**:
```bash
npm audit
# or
snyk test
```
```

## 🔒 Security Policies

### Authentication Policy

**File**: [`policies/auth-policy.md`](../../packages/security/policies/auth-policy.md)

```markdown
# Authentication & Access Control Policy

## Password Requirements

### Minimum Standards
- **Length**: Minimum 12 characters
- **Complexity**: Must include:
  - Uppercase letter (A-Z)
  - Lowercase letter (a-z)
  - Number (0-9)
  - Special character (!@#$%^&*)
- **History**: Cannot reuse last 5 passwords
- **Expiration**: Change every 90 days (recommended, not enforced in MVP)

### Prohibited Passwords
- Common passwords (password123, admin, etc.)
- User's name or email
- Sequential patterns (abc123, qwerty)

## Session Management

### JWT Tokens
- **Algorithm**: HS256 or RS256
- **Expiry**: 1 hour for access tokens
- **Refresh**: 7 days for refresh tokens
- **Storage**: HttpOnly cookies (never localStorage)
- **Claims**: Include user ID, role, issued/expiry timestamps

### Session Security
- Timeout after 30 minutes of inactivity
- Invalidate on logout
- Single session per user (optional: multi-device support)

## Multi-Factor Authentication (MFA)

### Requirement
- **Mandatory** for Manager role
- **Recommended** for Agent role
- **Optional** for User role

### Methods
- Time-based OTP (TOTP) - Google Authenticator, Authy
- SMS OTP (less secure, avoid if possible)
- Email OTP (backup method)

## Role-Based Access Control (RBAC)

### Roles
1. **User**: Submit and view own requests
2. **Agent**: View queue, update assigned requests
3. **Manager**: View all, analytics, team management

### Permissions Matrix
| Action | User | Agent | Manager |
|--------|------|-------|---------|
| Submit request | ✅ | ✅ | ✅ |
| View own requests | ✅ | ✅ | ✅ |
| View all requests | ❌ | ❌ | ✅ |
| Update status | Own only | Assigned | All |
| Assign to agent | ❌ | ✅ | ✅ |
| View analytics | ❌ | Limited | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## Account Lockout

### Brute Force Protection
- **Failed Login Threshold**: 5 attempts
- **Lockout Duration**: 15 minutes
- **Notification**: Email to account owner
- **Unlock**: Automatic after duration or admin reset

## Audit Requirements

### Log All Authentication Events
- Login (success and failure)
- Logout
- Password changes
- MFA enrollment/removal
- Role changes
- Account lockouts

### Log Format
```json
{
  "timestamp": "2026-02-05T10:30:00Z",
  "event": "login_success",
  "userId": "user-123",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```
```

### Data Handling Policy

**File**: [`policies/data-handling-policy.md`](../../packages/security/policies/data-handling-policy.md)

```markdown
# Data Handling & Privacy Policy

## Data Classification

### Public
- Marketing materials, public documentation
- **Handling**: No special requirements

### Internal
- Request metadata (non-PII), aggregated metrics
- **Handling**: Access logged, transmitted over HTTPS

### Confidential
- User credentials, request details, email addresses
- **Handling**: Encrypted at rest and in transit, access restricted by role

### Restricted
- API keys, database credentials, JWT secrets
- **Handling**: Environment variables only, never committed to Git, rotated regularly

## Encryption

### In Transit
- **Requirement**: TLS 1.2 or higher for all communications
- **Protocol**: HTTPS only, redirect HTTP to HTTPS
- **Certificates**: Valid SSL/TLS certificates (Let's Encrypt, etc.)

### At Rest
- **Database**: Enable MongoDB encryption at rest (Atlas provides this)
- **Backups**: Encrypted backups
- **Secrets**: Use secret management (AWS Secrets Manager, HashiCorp Vault, or encrypted .env)

## Data Retention

### Active Requests
- **Retention**: Indefinite
- **Backup**: Daily

### Resolved Requests
- **Retention**: 2 years
- **Archival**: After 1 year, move to archival storage
- **Deletion**: After 2 years, delete unless legal hold

### Audit Logs
- **Retention**: 90 days minimum
- **Storage**: Separate from application database

### User Accounts
- **Deactivation**: 90 days of inactivity
- **Deletion**: 1 year after deactivation (GDPR compliance)

## Personal Identifiable Information (PII)

### PII Fields
- Name, email, phone, department
- Request descriptions (may contain personal info)

### Handling Requirements
- Minimize collection (collect only what's needed)
- Never display full email in logs (user@***.com)
- Anonymize in analytics (aggregate only)
- Provide user data export (GDPR Article 15)
- Provide user data deletion (GDPR Article 17)

## Access Control

### Principle of Least Privilege
- Users access only what they need for their role
- Database user has minimal required permissions
- API keys with scope restrictions

### Segregation of Duties
- Developers don't have production database access
- Managers can't modify their own permissions
```

## ✅ OWASP Top 10 Checklist

**File**: [`checklists/owasp-top-10.md`](../../packages/security/checklists/owasp-top-10.md)

```markdown
# OWASP Top 10 Security Checklist

## A01: Broken Access Control

- [ ] Authorization checks on all API endpoints
- [ ] Users can only access their own data
- [ ] Role-based access control implemented
- [ ] No client-side role checks (server-side only)
- [ ] Test: Try accessing other users' requests

**Status**: ⚠️ NEEDS WORK  
**Remediation**: Add authz middleware to all routes

---

## A02: Cryptographic Failures

- [x] HTTPS enforced
- [ ] Passwords hashed with bcrypt (rounds ≥ 10)
- [ ] Sensitive data encrypted at rest
- [ ] No secrets in Git
- [ ] TLS 1.2+ only

**Status**: ⚠️ PARTIAL  
**Remediation**: Implement password hashing, verify HTTPS

---

## A03: Injection

- [x] Use Mongoose ORM (prevents SQL/NoSQL injection)
- [ ] Input validation on all endpoints
- [ ] Sanitize user input
- [ ] Parameterized queries only

**Status**: ✅ GOOD (Mongoose protects)  
**Remediation**: Add input validation for extra safety

---

## A04: Insecure Design

- [ ] Threat model completed (STRIDE)
- [ ] Security requirements defined
- [ ] Input validation design
- [ ] Rate limiting design

**Status**: ⚠️ IN PROGRESS  
**Remediation**: Complete this security review

---

## A05: Security Misconfiguration

- [ ] Remove default credentials
- [ ] Disable directory listing
- [ ] Remove unnecessary features/packages
- [ ] Security headers (Helmet.js)
- [ ] Error messages don't reveal system info

**Status**: ⚠️ NEEDS WORK  
**Remediation**: Add Helmet.js, sanitize errors

---

## A06: Vulnerable and Outdated Components

- [ ] Run `npm audit` regularly
- [ ] Keep dependencies updated
- [ ] Remove unused dependencies
- [ ] Monitor for security advisories

**Status**: ⚠️ NEEDS AUTOMATION  
**Remediation**: Add `npm audit` to CI/CD

---

## A07: Identification and Authentication Failures

- [ ] Strong password policy
- [ ] MFA available
- [ ] Session timeouts
- [ ] Brute force protection
- [ ] Secure password recovery

**Status**: ⚠️ NEEDS WORK  
**Remediation**: Implement auth policy requirements

---

## A08: Software and Data Integrity Failures

- [ ] Verify npm package integrity
- [ ] Code signing (optional)
- [ ] Validate JSON schemas
- [ ] Audit trails for data changes

**Status**: ⚠️ PARTIAL  
**Remediation**: Add audit logging

---

## A09: Security Logging and Monitoring Failures

- [ ] Log authentication events
- [ ] Log authorization failures
- [ ] Log data changes
- [ ] Alert on suspicious activity
- [ ] Regular log review

**Status**: ⚠️ NEEDS WORK  
**Remediation**: Implement comprehensive logging

---

## A10: Server-Side Request Forgery (SSRF)

- [ ] Validate URLs before fetching
- [ ] Whitelist allowed domains
- [ ] Don't expose internal services
- [ ] Network segmentation

**Status**: ✅ LOW RISK (no user-provided URLs)  
**Remediation**: Monitor if adding URL features

---

## Overall Status

**Compliant**: 2/10  
**Partial**: 4/10  
**Needs Work**: 4/10

**Priority Fixes**:
1. A01 - Broken Access Control
2. A07 - Authentication Failures
3. A09 - Logging
4. A05 - Security Misconfiguration
```

## 🎯 Deliverable Checklist

- [ ] **STRIDE Analysis**: All 6 categories covered, 10+ threats identified
- [ ] **Attack Vectors**: Specific attack scenarios documented
- [ ] **Security Policies**: Auth policy and data handling policy complete
- [ ] **OWASP Top 10**: All 10 reviewed with status and remediation
- [ ] **Security Summary**: Executive summary with prioritized recommendations
- [ ] **Optional**: Code review completed with findings
- [ ] **Optional**: Penetration testing performed

## 🎯 Stretch Goals

- [ ] **Code Review**: Review actual code for vulnerabilities
- [ ] **Penetration Testing**: Attempt to exploit vulnerabilities
- [ ] **Security Scanning**: Run automated tools (Snyk, OWASP ZAP)
- [ ] **Compliance**: Map to standards (ISO 27001, SOC 2)
- [ ] **Incident Response Plan**: How to handle security incidents
- [ ] **Security Training**: Recommendations for developer training

## 📚 Resources

- **STRIDE**: [microsoft.com/security/blog/stride](https://www.microsoft.com/en-us/security/blog/2007/09/11/stride-chart/)
- **OWASP Top 10**: [owasp.org/top10](https://owasp.org/www-project-top-ten/)
- **OWASP Cheat Sheets**: [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/)
- **Threat Modeling**: [shostack.org/resources](https://shostack.org/resources/threat-modeling)

---

**Security is everyone's responsibility!** 🔒🛡️
