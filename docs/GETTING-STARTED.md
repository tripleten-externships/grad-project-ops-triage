# Getting Started Guide

This guide will help you set up your development environment and start working on the Ops Triage Application project.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Node.js** | 18+ | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **pnpm** | 8+ | Package manager | `npm install -g pnpm` |
| **Python** | 3.9+ | Data Science & ML | [python.org](https://python.org) |
| **Git** | 2.x | Version control | [git-scm.com](https://git-scm.com) |
| **Docker** | 20+ | Containerization (optional) | [docker.com](https://docker.com) |

### Optional but Recommended

- **MongoDB** (local or MongoDB Atlas account)
- **VS Code** with extensions: ESLint, Prettier, Python
- **Postman** or **Insomnia** for API testing

### Skills/Knowledge

- Basic command line usage
- Git fundamentals
- Your discipline-specific tools (see discipline guides)

## 🚀 5-Minute Quick Start

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd grad-project-template
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This installs dependencies for all packages in the monorepo.

### Step 3: Choose Your Discipline

Run the setup script to configure your workspace:

```bash
./scripts/setup-discipline.sh
```

Select your discipline when prompted:
- Software Engineering (Frontend + Backend)
- UX/UI Design
- Data Science
- Business Intelligence & Analytics
- AI Automation
- Cyber Security
- QA

The script will:
- ✅ Set up environment files
- ✅ Install discipline-specific dependencies
- ✅ Provide next steps for your role

### Step 4: Explore Your Workspace

Navigate to your discipline's directory:

```bash
cd packages/<your-discipline>/
```

Read the `README.md` in your package for specific setup instructions.

### Step 5: Start Working!

Follow the discipline-specific quick start below.

---

## 🎯 Discipline-Specific Quick Starts

### Software Engineering

```bash
# Frontend
cd packages/frontend
cp .env.example .env
pnpm dev
# Visit http://localhost:5173

# Backend (in a new terminal)
cd packages/backend
cp .env.example .env
# Edit .env with your MongoDB connection string
pnpm dev
# API runs on http://localhost:3000
```

**First tasks:**
1. Review [`packages/backend/docs/API.md`](../packages/backend/docs/API.md)
2. Explore the user stories in [`contracts/user-stories/`](../contracts/user-stories/)
3. Run the database seeding: `pnpm seed`

### UX/UI Design

```bash
cd packages/ux-design
```

**First tasks:**
1. Review existing personas in [`research/personas.md`](../packages/ux-design/research/personas.md)
2. Study user flows in [`user-flows/`](../packages/ux-design/user-flows/)
3. Set up Figma (see [`prototypes/figma-link.md`](../packages/ux-design/prototypes/figma-link.md))
4. Review accessibility guidelines in [`accessibility/a11y-guidelines.md`](../packages/ux-design/accessibility/a11y-guidelines.md)

### Data Science

```bash
cd packages/data-science

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Jupyter
jupyter notebook
# Open notebooks/01-eda.ipynb
```

**First tasks:**
1. Load and explore the request data
2. Review [`docs/MODEL-CARD.md`](../packages/data-science/docs/MODEL-CARD.md) template
3. Complete EDA in notebook 01
4. Review integration contract: [`contracts/integration-points/ds-model-output.schema.json`](../contracts/integration-points/ds-model-output.schema.json)

### Business Intelligence & Analytics

```bash
cd packages/bia

# Load seed data into your BI tool
node data/load-seed-data.js
```

**First tasks:**
1. Choose your BI tool (Power BI, Tableau, Looker, or Excel)
2. Review metric definitions in [`docs/METRIC-DEFINITIONS.md`](../packages/bia/docs/METRIC-DEFINITIONS.md)
3. Load sample data from [`contracts/mock-data/requests.csv`](../contracts/mock-data/requests.csv)
4. Review SQL queries in [`queries/`](../packages/bia/queries/)

### AI Automation

```bash
cd packages/ai-automation
cp .env.example .env
# Add your OpenAI or Anthropic API key to .env
```

**First tasks:**
1. Review prompts in [`prompts/`](../packages/ai-automation/prompts/)
2. Study the workflow diagram: [`workflows/workflow-diagram.mmd`](../packages/ai-automation/workflows/workflow-diagram.mmd)
3. Review guardrails: [`prompts/guardrails.md`](../packages/ai-automation/prompts/guardrails.md)
4. Test the automation: `pnpm test`

### Cyber Security

```bash
cd packages/security
```

**First tasks:**
1. Review the STRIDE analysis template: [`threat-model/STRIDE-analysis.md`](../packages/security/threat-model/STRIDE-analysis.md)
2. Study OWASP Top 10 checklist: [`checklists/owasp-top-10.md`](../packages/security/checklists/owasp-top-10.md)
3. Review authentication policy: [`policies/auth-policy.md`](../packages/security/policies/auth-policy.md)
4. Plan your threat modeling approach

### QA

```bash
cd packages/qa
cp .env.example .env  # If exists

# Install Playwright browsers
pnpm exec playwright install
```

**First tasks:**
1. Review test strategy: [`test-strategy/TEST-STRATEGY.md`](../packages/qa/test-strategy/TEST-STRATEGY.md)
2. Explore existing test cases: [`test-cases/`](../packages/qa/test-cases/)
3. Run sample E2E test: `pnpm test:e2e`
4. Review bug template: [`docs/BUG-TEMPLATE.md`](../packages/qa/docs/BUG-TEMPLATE.md)

---

## 🔧 Common Setup Tasks

### Setting Up MongoDB

**Option 1: MongoDB Atlas (Recommended for beginners)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `packages/backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ops-triage
   ```

**Option 2: Local MongoDB**
```bash
# macOS (with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# Use in .env
MONGODB_URI=mongodb://localhost:27017/ops-triage
```

### Seeding Sample Data

```bash
# Seed the database with sample requests and users
cd packages/backend
pnpm seed

# Or run the global seed script
npm run seed:all
```

### Running the Full Stack

```bash
# Terminal 1: Backend
cd packages/backend && pnpm dev

# Terminal 2: Frontend
cd packages/frontend && pnpm dev

# Terminal 3: Data Science API (optional)
cd packages/data-science && source venv/bin/activate && uvicorn api.app:app --reload
```

---

## 🧪 Verify Your Setup

### Frontend Check
```bash
cd packages/frontend
pnpm build
# Should build successfully
```

### Backend Check
```bash
cd packages/backend
pnpm lint
pnpm typecheck
# Should pass without errors
```

### Data Science Check
```bash
cd packages/data-science
python -c "import pandas, sklearn, fastapi; print('All imports successful')"
```

### Contract Validation
```bash
npm run validate:contracts
# Should validate all JSON schemas
```

---

## 🐛 Troubleshooting

### `pnpm install` fails

**Issue**: Dependencies fail to install

**Solutions**:
- Clear pnpm cache: `pnpm store prune`
- Delete `node_modules` and `pnpm-lock.yaml`, re-run `pnpm install`
- Ensure Node.js version is 18+: `node --version`

### MongoDB connection errors

**Issue**: Backend can't connect to MongoDB

**Solutions**:
- Verify `MONGODB_URI` in `packages/backend/.env`
- Check MongoDB is running: `mongosh` (local) or test connection string in MongoDB Compass
- Whitelist your IP in MongoDB Atlas Network Access

### Port already in use

**Issue**: `Error: listen EADDRINUSE :::3000`

**Solutions**:
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port in .env
PORT=3001
```

### Python package installation fails

**Issue**: `pip install -r requirements.txt` fails

**Solutions**:
- Ensure Python 3.9+: `python --version`
- Use virtual environment: `python -m venv venv`
- Install build tools (macOS): `xcode-select --install`
- Install build tools (Ubuntu): `sudo apt install python3-dev`

### TypeScript errors in IDE

**Issue**: VS Code shows import errors

**Solutions**:
- Reload VS Code: `Cmd+Shift+P` → "Reload Window"
- Ensure TypeScript is installed: `pnpm install -g typescript`
- Check `tsconfig.json` extends workspace config

### ESLint/Prettier conflicts

**Issue**: Code formatting changes constantly

**Solutions**:
- Install recommended VS Code extensions
- Run `pnpm lint --fix` to auto-fix
- Check `.eslintrc.js` and `.prettierrc` are present

---

## 📚 Next Steps

Now that your environment is set up:

1. **Read your discipline guide** in [`docs/DISCIPLINE-GUIDES/`](./DISCIPLINE-GUIDES/)
2. **Review the contracts** that define your inputs/outputs: [`docs/CONTRACTS.md`](./CONTRACTS.md)
3. **Understand the architecture**: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)
4. **Check the judging criteria**: [`docs/JUDGING-CRITERIA.md`](./JUDGING-CRITERIA.md)
5. **Start working on deliverables** listed in your discipline guide

---

## 🤝 Team Coordination

- **Daily standups**: Share progress and blockers
- **Use contracts**: Don't wait for other teams; use mock data
- **Document decisions**: Update relevant docs as you work
- **Integration checkpoints**: Test with other disciplines weekly

---

## ✅ Checklist: Are You Ready?

- [ ] Repository cloned
- [ ] All dependencies installed (`pnpm install`)
- [ ] Environment variables configured (`.env` files)
- [ ] Your discipline's tools installed (IDE, BI tool, etc.)
- [ ] Database accessible (for SE/BIA)
- [ ] Read your discipline guide
- [ ] Reviewed user stories and contracts
- [ ] Know where to find help (FAQ, discipline README)

**All checked?** You're ready to build! 🚀
