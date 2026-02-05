# Frequently Asked Questions (FAQ)

Common questions and answers about the Ops Triage Application project template.

## 🎯 General Questions

### What is this project?

This is a graduate-level capstone project template that simulates building a real-world IT operations ticketing system. It's designed for multidisciplinary teams to practice collaboration, integrate different specialties, and deliver a production-ready application.

### Who is this for?

Graduate students or teams studying:
- Computer Science / Software Engineering
- UX/UI Design
- Data Science / Machine Learning
- Business Intelligence & Analytics
- AI/Automation
- Cyber Security
- Quality Assurance

### How long should this project take?

This is a **1-week intensive bootcamp project** (~7 days). Each discipline should budget:
- **8-12 hours** for required deliverables
- **+2-4 hours** for stretch goals (if time permits)

The fast-paced nature requires focused collaboration and rapid iteration.

### Do we need all 8 disciplines on our team?

**No.** The template is flexible:
- **Minimum viable team**: Software Engineering (Frontend + Backend)
- **Most common**: SE + UX + Data Science + QA
- **Full team**: All 8 disciplines

See "What if my team is missing a discipline?" below.

---

## 👥 Team Composition & Roles

### What if my team is missing a discipline?

You have several options:

**Option 1: One person wears multiple hats**
- **Common combinations**:
  - UX + Frontend Engineering
  - Backend + Security
  - Data Science + BIA
  - QA + one other role

**Option 2: Use simplified deliverables**
- **No UX?** Use provided wireframes in contracts, skip detailed design system
- **No Data Science?** Use rule-based triage (skip ML), focus on business logic
- **No AI Automation?** Skip webhook integration, manual triage only
- **No BIA?** Use basic frontend analytics page, skip BI tool
- **No Security?** Follow OWASP basics, document simple threat model
- **No QA?** Write manual test cases only, skip E2E automation

**Option 3: Focus on fewer user stories**
- Deeply implement 1-2 user stories instead of all 3
- Example: Perfect the submit + triage flow, skip manager dashboard

### Can team members work on multiple disciplines?

**Yes!** Flexibility is encouraged. Just ensure:
- Each discipline's required deliverables are completed
- Work is clearly documented in the right package
- Grading reflects actual work done

### How do we divide the work fairly?

**Strategy 1: By discipline**
- Each person owns their package directory
- Integrate at checkpoints

**Strategy 2: By user story**
- Each person implements one user story end-to-end
- Requires all disciplines per person

**Strategy 3: By day**
- Days 1-2: Research, planning & setup (UX, Security, Planning)
- Days 3-5: Core build & integration (SE, DS, AI)
- Days 6-7: Testing, polish & final deliverables (BIA, QA)

Choose what works for your team!

---

## 📜 Contracts & Requirements

### Can we change the contracts?

**Yes, but carefully.** Contracts should be **stable** to enable parallel work. 

**When changes are OK**:
- You discover a missing required field
- A specification is ambiguous or incorrect
- All affected teams agree to the change

**Process**:
1. Document why it needs to change
2. Propose the specific change
3. Get consensus from all affected disciplines
4. Update the contract files
5. Notify everyone
6. Update implementations

See [`CONTRACTS.md`](./CONTRACTS.md#proposing-contract-changes) for details.

### What if a contract doesn't make sense for our implementation?

**First**, make sure you understand the contract's purpose. Review the [Contracts Guide](./CONTRACTS.md).

**If you still disagree**:
- Document your concerns
- Propose an alternative
- Discuss with your team/instructor
- Get approval before deviating

**Important**: Don't silently ignore contracts—this breaks integration.

### Do we need to implement ALL features in the user stories?

**Required**: Core functionality from each user story
- US-01: Submit request (basic form, save to backend)
- US-02: Triage queue (view list, update status)
- US-03: Manager insights (basic metrics)

**Optional**: Advanced features
- File attachments
- Real-time updates
- Email notifications
- Advanced filtering

Focus on **depth over breadth**—a polished core experience beats buggy full features.

---

## 🛠️ Technical Questions

### What technologies must we use?

**Required** (already set up in the template):
- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Data Science**: Python + Jupyter + FastAPI
- **Monorepo**: pnpm workspaces

**Flexible** (choose what you prefer):
- **BI Tool**: Power BI, Tableau, Looker, or Excel
- **AI Platform**: OpenAI, Anthropic, Cohere, or local models
- **Automation**: n8n, Zapier, or custom code
- **Testing**: Playwright (provided) or alternatives
- **Styling**: Any CSS framework (Tailwind, MUI, etc.)

### Can we use different frameworks?

**For core components (Frontend/Backend)**: No, stick with React and Express. The template is pre-configured.

**For everything else**: Yes!
- Use Vue or Angular if your instructor approves AND you set up from scratch
- Use different libraries (axios vs. fetch, etc.)
- Use different CSS frameworks

**Trade-off**: Switching major frameworks means more setup, less time for features.

### Do we need Docker?

**No, Docker is optional.** It's provided for:
- Consistent development environments
- Easy deployment
- Model serving (Data Science API)

You can run everything locally:
- MongoDB locally or MongoDB Atlas
- Services run with `pnpm dev`
- Deploy to VPS, Heroku, Vercel, etc.

### How do we handle authentication?

**Minimum** (acceptable for this project):
- Simple user selection (no passwords)
- Store user ID in localStorage
- No JWT/sessions

**Better**:
- JWT-based auth
- Login/logout functionality
- Protected API routes

**Best** (stretch goal):
- OAuth (Google, GitHub)
- Role-based access control
- Refresh tokens

Choose based on your time and Security discipline's involvement.

---

## 🔗 Integration Questions

### How do I test my work without other teams being done?

**Use mock data!** The template provides:
- [`contracts/mock-data/requests.json`](../contracts/mock-data/requests.json) - Sample requests
- [`contracts/mock-data/users.json`](../contracts/mock-data/users.json) - Sample users
- Mock API: [`frontend/src/services/mock-api.ts`](../packages/frontend/src/services/mock-api.ts)

**Each discipline can work independently**:
- **Frontend**: Use mock API, develop UI
- **Backend**: Seed database, test with Postman
- **Data Science**: Use CSV data, train models
- **BIA**: Use CSV in your BI tool

See [`INTEGRATION.md`](./INTEGRATION.md) for detailed patterns.

### When should we integrate?

**Recommended timeline for 1-week bootcamp**:
- **Day 1-2**: First integration test (basic API + Frontend)
- **Day 3-4**: Add Data Science model and AI Automation
- **Day 5-6**: Full system integration testing
- **Day 7**: Final bug fixes and polish

**Integration checkpoints**:
- Can frontend call backend API?
- Does backend receive valid data?
- Can backend call DS model?
- Do webhooks deliver?
- Does BIA tool connect to data?

### The integration isn't working. What do I check?

**Debugging checklist**:

1. **Contract compliance**
   ```bash
   npm run validate:contracts
   ```

2. **Network connectivity**
   - Services running? Check terminals
   - Correct URLs in `.env` files?
   - CORS configured on backend?

3. **Data format**
   - Log request/response bodies
   - Check field names match schema
   - Validate with JSON schema

4. **Error messages**
   - Check browser console (Frontend)
   - Check terminal logs (Backend)
   - Check API response status codes

5. **Environment variables**
   - All `.env` files created?
   - Correct API keys?
   - Database connection string valid?

See [`GETTING-STARTED.md#troubleshooting`](./GETTING-STARTED.md#troubleshooting) for common issues.

---

## 📊 Deliverables & Grading

### How do I know if my deliverables are complete?

**Use the checklists**:
1. Review [`JUDGING-CRITERIA.md`](./JUDGING-CRITERIA.md) for your discipline
2. Check required deliverables table
3. Ensure all files are in correct locations
4. Run the deliverables check script:
   ```bash
   node scripts/check-deliverables.js
   ```

### What if we can't finish everything?

**Priority order**:
1. **Required deliverables** (60% of grade) - Do these first!
2. **Quality criteria** (30% of grade) - Make it work well
3. **Stretch goals** (10% of grade) - Only if time permits

**Better to have**: Excellent implementation of core features than buggy full features.

### Can we submit early?

**Yes!** Benefits of finishing early:
- Time for polish and documentation
- Buffer for unexpected bugs
- Opportunity to attempt stretch goals
- Less stress

No penalty for early submission. Use extra time wisely!

### What format should documentation be in?

**All documentation must be**:
- Markdown (`.md` files)
- In the correct package directory
- Complete (no "TODO" or "Coming soon" placeholders)
- Well-formatted with headers, lists, code blocks

**Exception**: BI dashboards can include PDFs/screenshots if the tool doesn't export markdown.

---

## 🚨 Common Problems

### MongoDB connection fails

**Symptoms**: Backend won't start, database errors

**Solutions**:
1. **Local MongoDB**: 
   ```bash
   # Check if running
   brew services list | grep mongodb  # macOS
   sudo systemctl status mongodb      # Linux
   ```
   
2. **MongoDB Atlas**:
   - Check connection string in `.env`
   - Verify IP whitelist
   - Test with MongoDB Compass

3. **Fallback**: Use MongoDB Atlas free tier

See [`GETTING-STARTED.md`](./GETTING-STARTED.md#setting-up-mongodb) for setup.

### Data Science model won't load

**Symptoms**: 404 from DS API, predictions fail

**Solutions**:
1. Train and save model first:
   ```bash
   cd packages/data-science
   jupyter notebook
   # Run notebooks 01-04
   ```

2. Check model files exist in `models/` directory

3. Start FastAPI server:
   ```bash
   uvicorn api.app:app --reload
   ```

4. Test with curl:
   ```bash
   curl -X POST http://localhost:8000/predict \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test"}'
   ```

### Frontend won't load / blank page

**Symptoms**: White screen, console errors

**Solutions**:
1. Check browser console for errors
2. Verify backend is running
3. Check API URL in frontend `.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
4. Clear browser cache
5. Check for TypeScript errors:
   ```bash
   pnpm typecheck
   ```

### Playwright tests fail

**Symptoms**: E2E tests timeout or fail

**Solutions**:
1. Install browsers:
   ```bash
   pnpm exec playwright install
   ```

2. Start dev servers first:
   ```bash
   # Terminal 1: Backend
   cd packages/backend && pnpm dev
   
   # Terminal 2: Frontend  
   cd packages/frontend && pnpm dev
   
   # Terminal 3: Tests
   cd packages/qa && pnpm test:e2e
   ```

3. Increase timeouts in `playwright.config.ts`

4. Run in headed mode to see what's happening:
   ```bash
   pnpm exec playwright test --headed
   ```

---

## 🎨 Design & UX Questions

### We don't have a UX designer. What do we do?

**Options**:
1. **Use existing templates**: Bootstrap, Material-UI, Tailwind UI
2. **Simple and clean**: Focus on functionality, not fancy design
3. **Borrow designs**: Find inspiration from real ticketing systems (Zendesk, Jira)
4. **SE does basic UX**: Write simple user flows, create basic wireframes

**Minimum acceptable**:
- Functional UI (no broken layouts)
- Clear navigation
- Basic responsive design
- Readable text (contrast, font size)

### Where can we find design inspiration?

**Similar systems**:
- Zendesk (ticketing)
- Jira Service Management
- Freshdesk
- ServiceNow

**Component libraries**:
- Material-UI (MUI)
- Ant Design
- Chakra UI
- shadcn/ui

**Don't copy exactly**—use as inspiration!

---

## 🤖 AI & Data Science Questions

### What if we don't have labeled training data?

**You do!** Use the mock data:
- [`contracts/mock-data/requests.csv`](../contracts/mock-data/requests.csv) has categories and priorities
- Generate more with [`contracts/mock-data/data-generator.js`](../contracts/mock-data/data-generator.js)

**For better results**:
- Generate 1000+ samples
- Ensure balanced classes
- Add realistic variety

### Our model accuracy is low (<70%). What do we do?

**Debugging steps**:
1. **Check data quality**: Enough samples? Balanced classes?
2. **Try better features**: TF-IDF, word embeddings, BERT
3. **Try different models**: Random Forest, SVM, Neural Networks
4. **Tune hyperparameters**: Grid search, cross-validation
5. **Analyze errors**: Which categories/priorities are confused?

**Acceptable minimums**:
- Category classification: >75% accuracy
- Priority classification: >65% accuracy

**Document limitations** in your Model Card if accuracy is lower.

### Can we use ChatGPT / LLMs for everything instead of ML models?

**For AI Automation**: Yes, that's the point!

**For Data Science**: No. You must:
- Train a traditional ML model (scikit-learn, etc.)
- Document EDA, training, evaluation
- Serve via FastAPI

**Why?** The project teaches both traditional ML and modern LLM approaches.

---

## 🔐 Security Questions

### How much security do we need?

**Minimum** (acceptable):
- Basic input validation
- HTTPS in production
- Environment variables for secrets
- Simple threat model
- OWASP Top 10 awareness

**Better**:
- JWT authentication
- Rate limiting
- SQL injection prevention (parameterized queries)
- XSS prevention
- CSRF tokens

**Best** (stretch):
- Full security review of code
- Penetration testing
- Security headers (Helmet.js)
- Audit logging

**Balance**: Production-level security vs. time constraints. Document known limitations.

### Do we need penetration testing?

**Not required** but excellent stretch goal.

**Acceptable**:
- Threat modeling (STRIDE)
- Code review for common vulnerabilities
- OWASP checklist completion

**Great**:
- Automated scanning (npm audit, Snyk)
- Manual testing of auth flows

---

## 📈 Analytics & BI Questions

### Which BI tool should we use?

**Recommendation priority**:
1. **Power BI** - Free, powerful, good learning resource
2. **Tableau** - Student license available, industry-standard
3. **Looker Studio** (formerly Google Data Studio) - Free, web-based
4. **Excel/Google Sheets** - Fallback if others unavailable

**Choose based on**:
- What you have access to
- What you want to learn
- Team experience

All are acceptable!

### How do we connect the BI tool to MongoDB?

**Options**:
1. **Export to CSV**: Use provided scripts, import to BI tool
2. **Direct connection**: Power BI and Tableau support MongoDB connectors
3. **API**: Query backend analytics endpoints, import JSON
4. **ETL tool**: Use tool like Airbyte or custom scripts

**Easiest**: Export CSV, import to tool, set up auto-refresh.

---

## ⏱️ Timeline & Planning

### What's a realistic day-by-day plan?

**Sample 1-week intensive timeline**:

| Day | Focus | Deliverables |
|-----|-------|--------------|
| 1 | Kickoff, setup, planning | Environment set up, team roles assigned, contracts reviewed |
| 2 | UX + Backend foundation | Basic wireframes, user flows, core API endpoints |
| 3 | Frontend + Data Science | Submit form UI, DS model training started |
| 4 | Integration + AI automation | E2E flow working, model served, AI prompts integrated |
| 5 | Triage + Analytics | Agent queue, dashboard, security review |
| 6 | Testing + polish | E2E tests, bug fixes, documentation |
| 7 | Final integration + submission | All features integrated, final review, submission |

**This is an intensive bootcamp** — expect long days and rapid iteration!

### We're behind schedule. What should we cut?

**Keep** (critical for 1-week bootcamp):
- Basic submit request form → backend → database
- Basic triage queue
- Core documentation
- Manual testing

**Cut first** (nice-to-have in 1 week):
- Advanced UI polish
- Stretch goals
- Third user story (manager dashboard) — simplify to basic metrics
- Complex AI automation — use simpler rules
- Advanced analytics — focus on essential KPIs

**Don't cut**:
- Core user flow (submit → triage)
- Basic integration between components
- Required documentation
- At least smoke testing

**Remember**: In a 1-week intensive bootcamp, depth on core features beats breadth!

---

## 🎓 Learning & Skills

### What will I learn from this project?

**Technical skills**:
- Full-stack development
- API design and integration
- Machine learning pipelines
- BI dashboard creation
- Security best practices
- Test automation

**Soft skills**:
- Cross-functional collaboration
- Technical documentation
- Project planning
- Debugging complex systems
- Trade-off decisions

**Industry practices**:
- Contract-based development
- Microservices architecture
- DevOps fundamentals
- Agile workflows

### Can I use this as a portfolio project?

**Absolutely!** This project demonstrates:
- Full-stack capabilities
- Multiple technologies
- End-to-end ownership
- Professional deliverables

**Portfolio tips**:
- Deploy to a public URL
- Create demo video
- Write detailed README
- Showcase your specific contributions
- Include screenshots

---

## ❓ Still Have Questions?

**Check these resources**:
1. **Documentation**: Review all docs in `docs/` directory
2. **Package READMEs**: Each package has specific guides
3. **Contracts**: See [`contracts/README.md`](../contracts/README.md)
4. **Issues**: Check if it's a known issue in the repo

**Ask your team**:
- Daily standups
- Slack/Discord channels
- Pair programming sessions

**Ask your instructor**:
- Office hours
- Email with specific questions
- During class time

---

**Remember**: This project is a learning experience. Challenges are opportunities to grow! 🚀
