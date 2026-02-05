# OWASP Top 10 Security Checklist

## Overview
Mapping of OWASP Top 10 (2021) vulnerabilities to the Request Management System with mitigation checklist.

---

## A01:2021 – Broken Access Control

**Risk**: Users accessing data/functions they shouldn't

### Checklist
- [ ] Authorization checks on ALL API endpoints
- [ ] Users can only view/edit their own requests OR assigned requests
- [ ] Managers have separate permissions
- [ ] Admin functions require admin role
- [ ] No client-side authorization (always validate server-side)
- [ ] Test: Try accessing another user's request → expect 403

**Code Review**:
```typescript
// ✅ Good: Check authorization
if (request.requestedBy !== currentUser.id && !currentUser.isAgent) {
  return res.status(403).json({ error: 'Forbidden' });
}

// ❌ Bad: No authorization check
const request = await db.requests.findById(req.params.id);
return res.json(request);
```

---

## A02:2021 – Cryptographic Failures

**Risk**: Sensitive data exposed due to weak/missing encryption

### Checklist
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] Database credentials encrypted
- [ ] Passwords hashed (bcrypt, Argon2)
- [ ] Sensitive fields encrypted at rest (if storing SSN, etc.)
- [ ] TLS 1.2+ only
- [ ] Secure cookie flags (Secure, HttpOnly, SameSite)

**Test**:
- Try accessing over HTTP → expect redirect to HTTPS
- Check password storage → expect hash, not plaintext

---

## A03:2021 – Injection

**Risk**: SQL, NoSQL, OS command injection

### Checklist
- [ ] Parameterized queries (NEVER string concatenation)
- [ ] ORM used correctly (Sequelize, TypeORM, Prisma)
- [ ] Input validation on all fields
- [ ] Whitelist allowed values for enums (category, priority, status)
- [ ] No `eval()` or `Function()` with user input
- [ ] LLM prompts sanitized (AI-specific injection)

**Code Review**:
```typescript
// ✅ Good: Parameterized query
const requests = await db.query(
  'SELECT * FROM requests WHERE category = $1',
  [userInput]
);

// ❌ Bad: String concatenation
const requests = await db.query(
  `SELECT * FROM requests WHERE category = '${userInput}'`
);
```

---

## A04:2021 – Insecure Design

**Risk**: Missing security controls by design

### Checklist
- [ ] Threat model completed (STRIDE)
- [ ] Security requirements defined
- [ ] Principle of least privilege applied
- [ ] Defense in depth (multiple layers of security)
- [ ] Security considered in architecture decisions

**See**: `threat-model/STRIDE-analysis.md`

---

## A05:2021 – Security Misconfiguration

**Risk**: Default configs, unnecessary features, verbose errors

### Checklist
- [ ] No default credentials
- [ ] Error messages don't expose stack traces in production
- [ ] Unnecessary HTTP methods disabled (e.g., TRACE)
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] Unused dependencies removed
- [ ] CORS properly configured (not `*` unless public API)

**Test**:
- Check response headers for security headers
- Trigger error → expect generic message, not stack trace

---

## A06:2021 – Vulnerable and Outdated Components

**Risk**: Using libraries with known vulnerabilities

### Checklist
- [ ] Regular `npm audit` (weekly)
- [ ] Dependencies updated (Dependabot, Renovate)
- [ ] No critical vulnerabilities in production
- [ ] Unused dependencies removed
- [ ] License compliance checked

**Automation**:
```bash
npm audit --audit-level=moderate
npm outdated
```

---

## A07:2021 – Identification and Authentication Failures

**Risk**: Weak authentication, session management

### Checklist
- [ ] Strong password policy (min 8 chars, complexity if no MFA)
- [ ] Multi-factor authentication (MFA) available
- [ ] Account lockout after 5 failed login attempts
- [ ] Session timeout (30 minutes)
- [ ] Secure session tokens (crypto.randomBytes, not Date.now())
- [ ] Password reset with email verification
- [ ] No credentials in URLs

**Test**:
- Try weak password → expect rejection
- Try brute force login → expect lockout

**See**: `policies/auth-policy.md`

---

## A08:2021 – Software and Data Integrity Failures

**Risk**: Unsigned/unverified code or data

### Checklist
- [ ] Dependencies from trusted sources (npm, not random CDN)
- [ ] Subresource Integrity (SRI) for CDN resources
- [ ] Code review process
- [ ] CI/CD pipeline security
- [ ] Webhook signature verification (AI automation)
- [ ] Audit logs immutable

---

## A09:2021 – Security Logging and Monitoring Failures

**Risk**: Attacks not detected due to insufficient logging

### Checklist
- [ ] Authentication events logged (login, logout, failures)
- [ ] Authorization failures logged
- [ ] Input validation failures logged
- [ ] Server errors logged
- [ ] Logs don't contain passwords or tokens
- [ ] Logs monitored for suspicious patterns
- [ ] Alerts for critical events (multiple failed logins, etc.)

**Log Example**:
```json
{
  "timestamp": "2026-02-05T00:00:00Z",
  "event": "login_failed",
  "user_email": "user@example.com",
  "ip_address": "192.168.1.1",
  "reason": "incorrect_password"
}
```

---

## A10:2021 – Server-Side Request Forgery (SSRF)

**Risk**: Server makes requests to unintended locations

### Checklist
- [ ] Validate URLs before making requests
- [ ] Whitelist allowed domains for webhooks
- [ ] No user-controlled URLs in backend HTTP requests
- [ ] Network segmentation (backend can't access internal-only services)

**Relevant for**:
- AI automation calling external LLM APIs
- Webhooks to backend from AI service

**Mitigation**:
- Validate webhook source
- Use API gateways

---

## Additional Checks (Beyond OWASP Top 10)

### Rate Limiting
- [ ] API rate limits configured
- [ ] Per-user and per-IP limits
- [ ] Gradual backoff for violations

### Input Validation
- [ ] Max length limits enforced
- [ ] Type validation (string, number, etc.)
- [ ] Format validation (email, UUID, etc.)
- [ ] Business logic validation

### Output Encoding
- [ ] React auto-escapes (default)
- [ ] API responses properly encoded
- [ ] No `dangerouslySetInnerHTML` without sanitization

---

## Testing

### Automated
```bash
# Dependency vulnerabilities
npm audit

# Static code analysis
npm run lint
npm run security-scan  # SonarQube, Snyk, etc.
```

### Manual
- Penetration testing (quarterly)
- Code review (all PRs)
- Security acceptance testing

---

## Sign-Off

Before production release:
- [ ] All HIGH and CRITICAL items addressed
- [ ] Security testing completed
- [ ] Security team review approved
- [ ] Documentation updated

**Approved by**: _______________ Date: _______

---

## References
- OWASP Top 10 (2021): https://owasp.org/Top10/
- OWASP API Security: https://owasp.org/www-project-api-security/
- Backend Code: `packages/backend/`
- STRIDE Analysis: `threat-model/STRIDE-analysis.md`
