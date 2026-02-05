# STRIDE Threat Analysis

## Overview
STRIDE is a threat modeling methodology that categorizes threats into six categories: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.

---

## Application Components

### 1. Frontend (React Web App)
- User interface
- Request submission forms
- Triage dashboard
- Manager insights dashboard

### 2. Backend API (Node.js)
- RESTful API
- Authentication
- Request CRUD operations
- Webhook handling

### 3. Database (PostgreSQL/MySQL)
- Request data
- User data
- AI predictions

### 4. AI Automation Service
- LLM API integration
- Request categorization
- DS model integration

### 5. Data Science Model API
- Trained ML models
- Prediction endpoint

---

## STRIDE Analysis by Component

### Frontend (Web Application)

#### S - Spoofing Identity
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Session hijacking | Attacker steals user session token | HTTP-only, Secure cookies; short session timeout |
| Phishing | Fake login page tricks users | User training; multi-factor authentication |

#### T - Tampering with Data
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Client-side validation bypass | User modifies form data in browser | Server-side validation; never trust client input |
| Malicious JavaScript injection | XSS attack modifies page behavior | Content Security Policy (CSP); output encoding |

#### R - Repudiation
| Threat | Description | Mitigation |
|--------|-------------|------------|
| User denies submitting request | No proof of action | Audit logging; timestamped records |

#### I - Information Disclosure
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Sensitive data in browser storage | Confidential info exposed | Don't store sensitive data locally; encrypt if necessary |
| Error messages leak info | Stack traces expose system details | Generic error messages to users |

#### D - Denial of Service
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Flooding with requests | User spams submit button | Rate limiting; CAPTCHA for suspicious activity |

#### E - Elevation of Privilege
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Role manipulation | User changes role in local storage | Server-side authorization; validate roles on each request |

---

### Backend API

#### S - Spoofing Identity
| Threat | Description | Mitigation |
|--------|-------------|------------|
| API key theft | Stolen API keys used for unauthorized access | Rotate keys regularly; monitor for unusual activity |
| JWT token forgery | Fake authentication tokens | Strong signing algorithm (RS256); validate signature |

#### T - Tampering with Data
| Threat | Description | Mitigation |
|--------|-------------|------------|
| SQL injection | Malicious SQL in user inputs | Parameterized queries; ORM usage |
| Request parameter tampering | Modified request IDs to access others' data | Authorization checks; validate user owns resource |

#### R - Repudiation
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Admin denies deleting data | No audit trail | Comprehensive audit logging; immutable logs |

#### I - Information Disclosure
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Unauthorized data access | User accesses requests they shouldn't see | Row-level security; authorization middleware |
| API exposes sensitive fields | PII leaked in responses | Filter sensitive fields; field-level permissions |

#### D - Denial of Service
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Resource exhaustion | Overwhelming API with requests | Rate limiting; request throttling; load balancing |
| Expensive query attacks | Queries that consume excessive resources | Query timeout; pagination; query complexity limits |

#### E - Elevation of Privilege
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Role escalation | Regular user performs admin actions | Role-based access control (RBAC); principle of least privilege |
| Mass assignment | User sets unauthorized fields | Whitelist allowed fields; use DTOs |

---

### Database

#### S - Spoofing Identity
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Credential theft | Database credentials compromised | Secrets manager; rotate credentials; limit access |

#### T - Tampering with Data
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Direct database modification | Attacker modifies data directly | Network isolation; least privilege database users; audit logging |

#### R - Repudiation
| Threat | Description | Mitigation |
|--------|-------------|------------|
| No proof of data changes | Can't track who changed what | Database triggers for audit; change data capture (CDC) |

#### I - Information Disclosure
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Database backup exposure | Backups not encrypted | Encrypt backups; secure backup storage |
| SQL injection data exfiltration | Attacker extracts data via SQL injection | Parameterized queries; least privilege DB user |

#### D - Denial of Service
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Database resource exhaustion | Too many connections or large queries | Connection pooling; query timeout; resource limits |

#### E - Elevation of Privilege
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Database user privilege escalation | Attacker gains admin access | Principle of least privilege; separate app and admin users |

---

### AI Automation Service

#### S - Spoofing Identity
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Fake webhook requests | Attacker sends malicious triage requests | Webhook signature verification; API authentication |

#### T - Tampering with Data
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Prompt injection | Malicious input manipulates LLM output | Input sanitization; output validation; guardrails |
| Model poisoning | Training data compromised (DS model) | Data validation; anomaly detection |

#### R - Repudiation
| Threat | Description | Mitigation |
|--------|-------------|------------|
| AI prediction denial | No record of prediction made | Log all predictions; store in database |

#### I - Information Disclosure
| Threat | Description | Mitigation |
|--------|-------------|------------|
| Sensitive data in LLM training | PII used to train models | PII detection and redaction; data minimization |
| Prompt leakage | User extracts system prompts | Prompt protection; monitor for extraction attempts |

#### D - Denial of Service
| Threat | Description | Mitigation |
|--------|-------------|------------|
| API rate limit exhaustion | Overwhelming LLM API | Rate limiting; cost caps; request queuing |
| Expensive prompt attacks | Very long inputs drain quota | Input length limits; token budgeting |

#### E - Elevation of Privilege
| Threat | Description | Mitigation |
|--------|-------------|------------|
| LLM jailbreaking | Bypass guardrails to get unauthorized predictions | Strong guardrails; output validation; monitoring |

---

## Threat Summary

### Critical Threats (Address Immediately)
1. **SQL Injection** (Backend) - High likelihood, high impact
2. **Unauthorized Data Access** (Backend) - Medium likelihood, high impact
3. **Prompt Injection** (AI) - Medium likelihood, medium impact
4. **Session Hijacking** (Frontend) - Low likelihood, high impact

### High Priority
5. XSS attacks (Frontend)
6. Credential theft (Database)
7. API rate limiting bypass (Backend, AI)

### Medium Priority
8. Audit log tampering
9. Error message information leakage
10. Database backup exposure

---

## Next Steps

1. Review each threat with engineering team
2. Prioritize threats in `risk-assessment/top-10-risks.md`
3. Define mitigation strategies in `risk-assessment/mitigation-plan.md`
4. Implement security controls in code
5. Validate with security testing

---

## References
- Microsoft STRIDE: https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats
- OWASP Threat Modeling: https://owasp.org/www-community/Threat_Modeling
- Backend Code: `packages/backend/`
- AI Automation: `packages/ai-automation/`
