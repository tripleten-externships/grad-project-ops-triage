# Authentication & Authorization Policy

## Authentication Requirements

### Password Policy
- **Minimum Length**: 8 characters (12+ recommended)
- **Complexity**: At least 3 of: uppercase, lowercase, numbers, symbols
- **Common Passwords**: Reject top 10,000 common passwords
- **Expiration**: Optional (90 days if required by policy)
- **History**: Cannot reuse last 3 passwords
- **MFA**: Strongly recommended, required for admin roles

### Session Management
- **Session Duration**: 30 minutes of inactivity
- **Token Type**: JWT or secure session cookie
- **Storage**: Server-side session store OR signed JWT
- **Transmission**: HTTPS only, Secure and HttpOnly flags
- **Logout**: Invalidate session server-side

### Account Lockout
- **Failed Login Attempts**: 5 failures within 15 minutes
- **Lockout Duration**: 15 minutes OR manual unlock by admin
- **Notification**: Email user about lockout
- **Logging**: Log all lockout events

---

## Authorization Model

### Roles
1. **Requester**: Submit requests, view own requests
2. **Agent**: Triage and resolve requests assigned to them
3. **Manager**: View dashboards, analytics
4. **Admin**: Full system access, user management

### Permissions Matrix

| Action | Requester | Agent | Manager | Admin |
|--------|-----------|-------|---------|-------|
| Submit request | ✅ | ✅ | ✅ | ✅ |
| View own requests | ✅ | ✅ | ✅ | ✅ |
| View all requests | ❌ | ❌ | ✅ | ✅ |
| Edit own request (before triage) | ✅ | ❌ | ❌ | ✅ |
| Triage request | ❌ | ✅ | ❌ | ✅ |
| Assign to agent | ❌ | ✅ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |

### Implementation

```typescript
// Middleware example
function requireRole(allowedRoles: string[]) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/analytics', requireRole(['manager', 'admin']), analyticsController);
app.patch('/api/requests/:id/triage', requireRole(['agent', 'admin']), triageController);
```

---

## Row-Level Security

Users can only access requests they:
1. Submitted (requestedBy = user.id)
2. Are assigned to (assignedTo = user.id)
3. Have role-based access (Manager/Admin)

```typescript
// Authorization check
function canAccessRequest(user: User, request: Request): boolean {
  if (user.role === 'admin' || user.role === 'manager') {
    return true;
  }
  if (request.requestedBy === user.id) {
    return true;
  }
  if (user.role === 'agent' && request.assignedTo === user.id) {
    return true;
  }
  return false;
}
```

---

## API Authentication

### Bearer Token
```
Authorization: Bearer <JWT_TOKEN>
```

### Token Structure (JWT)
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "agent",
  "iat": 1234567890,
  "exp": 1234569690
}
```

### Token Validation
- Verify signature
- Check expiration
- Validate issuer
- Check revocation list (if implemented)

---

## OAuth/SSO Integration (Optional)

If integrating with enterprise SSO:
- Support SAML 2.0 or OAuth 2.0/OIDC
- Map SSO groups to application roles
- Fallback to local auth if SSO unavailable

---

## Security Best Practices

1. **Never trust client**: Always validate auth on server
2. **Principle of least privilege**: Grant minimum necessary permissions
3. **Defense in depth**: Authorization at API layer AND data layer
4. **Audit everything**: Log all authorization decisions
5. **Fail securely**: Default to deny, not allow

---

## References
- Backend Auth Middleware: `packages/backend/src/middleware/auth.middleware.ts`
- User Schema: `contracts/schemas/user.schema.json`
- OWASP Authentication Guide: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
