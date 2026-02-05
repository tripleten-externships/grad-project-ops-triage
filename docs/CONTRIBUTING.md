# Contributing to Ops Triage Application

Thank you for contributing to the Ops Triage Application! This document provides guidelines for contributing code, documentation, and other improvements.

## 🎯 Getting Started

1. **Read the documentation**:
   - [`README.md`](./README.md) - Project overview
   - [`GETTING-STARTED.md`](./GETTING-STARTED.md) - Setup instructions
   - [`CONTRACTS.md`](./CONTRACTS.md) - Understand the contracts

2. **Set up your environment**:
   ```bash
   git clone <repo-url>
   cd grad-project-template
   pnpm install
   ```

3. **Choose your discipline**: See [`DISCIPLINE-GUIDES/`](./DISCIPLINE-GUIDES/)

## 🌿 Branching Strategy

### Branch Naming Convention

```
<type>/<discipline>/<short-description>

Examples:
- feature/frontend/add-intake-form
- fix/backend/request-validation
- docs/ux/update-personas
- test/qa/e2e-submit-flow
```

### Branch Types

- `feature/` - New functionality
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions/updates
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

### Main Branches

- **`main`** - Production-ready code
- **`develop`** - Integration branch for ongoing work
- **Feature branches** - Individual work

## 💻 Code Standards

### JavaScript/TypeScript

**Style**: Follow ESLint and Prettier configurations

```typescript
// ✅ Good
export async function createRequest(data: CreateRequestDTO): Promise<Request> {
  const validated = validateRequest(data);
  return await RequestModel.create(validated);
}

// ❌ Bad
export async function createRequest(data:any){
  return await RequestModel.create(data)
}
```

**Naming Conventions**:
- **Files**: `kebab-case.ts` (e.g., `request.service.ts`)
- **Classes**: `PascalCase` (e.g., `RequestService`)
- **Functions**: `camelCase` (e.g., `createRequest`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_TITLE_LENGTH`)
- **Interfaces**: `IPascalCase` or `PascalCase` (e.g., `IRequest`, `RequestDTO`)

**TypeScript Guidelines**:
- Always define types, avoid `any`
- Use interfaces for data structures
- Use type guards where appropriate
- Export types for reusability

```typescript
// Define interfaces
interface CreateRequestDTO {
  title: string;
  description: string;
  category: Category;
  submittedBy: string;
}

// Use types
function processRequest(data: CreateRequestDTO): Promise<Request> {
  // Implementation
}
```

### Python (Data Science)

**Style**: Follow PEP 8

```python
# ✅ Good
def preprocess_text(text: str) -> str:
    """Clean and normalize text for ML model."""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text.strip()

# ❌ Bad
def PreprocessText(text):
    text=text.lower()
    return text
```

**Naming Conventions**:
- **Files**: `snake_case.py` (e.g., `load_data.py`)
- **Functions**: `snake_case` (e.g., `preprocess_text`)
- **Classes**: `PascalCase` (e.g., `DataLoader`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FEATURES`)

### CSS/Styling

```css
/* ✅ Good - BEM naming */
.request-card {
  padding: 16px;
}

.request-card__title {
  font-size: 18px;
}

.request-card--urgent {
  border-color: red;
}

/* ❌ Bad */
.rc {
  padding: 16px;
}
```

## 📝 Commit Messages

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

### Examples

```bash
# Good commit messages
feat(frontend): add request intake form
fix(backend): resolve duplicate request creation
docs(ux): update user personas
test(qa): add E2E tests for submit flow
refactor(backend): simplify request validation logic
chore(deps): update dependencies

# With body and footer
feat(backend): add webhook service for AI automation

Implement WebhookService to emit events when requests are created,
updated, or resolved. This enables AI Automation to subscribe and
process requests asynchronously.

Closes #123
```

### Commit Message Guidelines

- ✅ **Use imperative mood**: "add feature" not "added feature"
- ✅ **Be specific**: "fix validation bug in request form" not "fix bug"
- ✅ **Keep subject < 72 characters**
- ✅ **Capitalize first letter**
- ❌ **Don't end with period**

## 🔀 Pull Request Process

### Before Creating PR

1. **Pull latest changes**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Update your branch**:
   ```bash
   git checkout feature/your-branch
   git merge develop
   ```

3. **Run tests**:
   ```bash
   # Frontend
   cd packages/frontend && pnpm lint && pnpm typecheck
   
   # Backend
   cd packages/backend && pnpm lint && pnpm typecheck && pnpm test
   
   # E2E (if applicable)
   cd packages/qa && pnpm test:e2e
   ```

4. **Validate contracts** (if you changed contracts):
   ```bash
   npm run validate:contracts
   ```

### Creating the PR

1. **Push your branch**:
   ```bash
   git push origin feature/your-branch
   ```

2. **Open PR on GitHub**:
   - Base: `develop`
   - Compare: `feature/your-branch`
   - Use PR template (if available)

3. **PR Title**: Follow commit message format
   ```
   feat(frontend): add request intake form
   ```

4. **PR Description**:
   ```markdown
   ## Description
   Implements the request intake form for US-01: Submit Request
   
   ## Changes
   - Created IntakePage component
   - Added form validation
   - Connected to API
   - Added error handling
   
   ## Testing
   - [x] Manual testing completed
   - [x] E2E test added
   - [x] Tested on Chrome
   
   ## Screenshots
   [Add screenshots if UI changes]
   
   ## Related Issues
   Closes #123
   
   ## Checklist
   - [x] Code follows style guidelines
   - [x] Self-reviewed code
   - [x] Tests pass
   - [x] Documentation updated
   ```

### PR Review Process

**Reviewer Checklist**:
- [ ] Code follows style guidelines
- [ ] Changes match requirements
- [ ] Tests are adequate
- [ ] No security vulnerabilities
- [ ] Documentation is updated
- [ ] Contracts are respected (if applicable)

**Requesting Changes**:
- Be constructive and specific
- Explain the "why" behind suggestions
- Suggest alternatives

**Approving**:
- At least 1 approval required
- All discussions resolved
- CI checks passing

### Merging

- Use **Squash and Merge** for feature branches
- Delete branch after merge
- Update related issues

## 🧪 Testing Requirements

### What to Test

- **New features**: Must include tests
- **Bug fixes**: Add test to prevent regression
- **Refactoring**: Existing tests must pass

### Test Coverage

- **Backend**: Aim for 70%+ coverage on critical paths
- **Frontend**: Test user interactions
- **E2E**: Cover happy paths and critical flows

### Running Tests

```bash
# Backend unit tests
cd packages/backend && pnpm test

# Frontend component tests (if applicable)
cd packages/frontend && pnpm test

# E2E tests
cd packages/qa && pnpm test:e2e

# All tests
npm run test:all
```

## 📚 Documentation

### When to Update Documentation

- **New features**: Update relevant docs
- **API changes**: Update API contract and docs
- **Breaking changes**: Update migration guide
- **User-facing changes**: Update user documentation

### Documentation Standards

- Use **Markdown** for all docs
- Include **code examples** where helpful
- Add **links** to related documentation
- Keep **README files** up to date in each package

## 🔐 Security Guidelines

### Sensitive Data

- ❌ **Never commit**:
  - API keys
  - Passwords
  - Private keys
  - `.env` files

- ✅ **Always**:
  - Use environment variables
  - Add sensitive files to `.gitignore`
  - Rotate exposed keys immediately

### Reporting Security Issues

**Do NOT open public issues for security vulnerabilities.**

Instead, email: security@example.com (or notify instructor privately)

## 🐛 Reporting Bugs

Use the bug template: [`packages/qa/docs/BUG-TEMPLATE.md`](../packages/qa/docs/BUG-TEMPLATE.md)

Include:
- Clear description
- Steps to reproduce
- Expected vs. actual behavior
- Environment details
- Screenshots if applicable

## 💬 Communication

### Daily Standup (Async or Sync)

Share:
- What you completed yesterday
- What you're working on today
- Any blockers

### Asking for Help

- Check documentation first
- Search existing issues
- Provide context and what you've tried
- Be specific about the problem

## 🏆 Best Practices

### Code Quality

✅ **Do**:
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Handle errors gracefully
- Validate all inputs

❌ **Don't**:
- Leave commented-out code
- Use magic numbers (use constants)
- Ignore linter warnings
- Copy-paste code (DRY principle)

### Performance

- Optimize only when needed (don't premature optimize)
- Use pagination for large datasets
- Add indexes to frequently queried fields
- Lazy load when appropriate

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast (4.5:1 minimum)
- Test with screen readers

## 📋 Checklists

### Pre-Commit Checklist

- [ ] Code compiles/runs without errors
- [ ] Linter passes
- [ ] Tests pass
- [ ] No console errors
- [ ] Sensitive data removed
- [ ] Self-reviewed changes

### Pre-PR Checklist

- [ ] Branch is up to date with develop
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] PR description is complete

### Pre-Merge Checklist (Reviewer)

- [ ] Code reviewed
- [ ] Tests adequate
- [ ] Documentation complete
- [ ] No security concerns
- [ ] CI checks passing

## 🎓 Learning Resources

- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **React**: [react.dev](https://react.dev)
- **Node.js**: [nodejs.org/docs](https://nodejs.org/en/docs/)
- **MongoDB**: [mongodb.com/docs](https://www.mongodb.com/docs/)
- **Git**: [git-scm.com/doc](https://git-scm.com/doc)

## ❓ Questions?

- **General**: Check [`FAQ.md`](./FAQ.md)
- **Setup**: See [`GETTING-STARTED.md`](./GETTING-STARTED.md)
- **Your discipline**: See discipline-specific guide
- **Team**: Ask in team chat or during standup

---

**Thank you for contributing!** Your work helps make this project better for everyone. 🎉
