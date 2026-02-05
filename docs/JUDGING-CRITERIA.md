# Judging Criteria & Evaluation Rubric

This document outlines how each discipline's deliverables will be evaluated. Use this as a checklist to ensure your work meets expectations.

## 📊 Overall Grading Structure

Each discipline is evaluated on:
- **Required Deliverables** (60%): Must-have items
- **Quality Criteria** (30%): How well it's done
- **Stretch Goals** (10%): Optional advanced features

**Total Project Score**: Average of completed discipline scores

---

## 🎨 UX/UI Design

**Overall Weight**: 14% of total project

### Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **User Research** | 10 | [`ux-design/research/`](../packages/ux-design/research/) | ✅ At least 2 personas defined<br>✅ Problem framing documented<br>✅ Success metrics identified |
| **User Flows** | 15 | [`ux-design/user-flows/`](../packages/ux-design/user-flows/) | ✅ All 3 core flows (Submit, Triage, Insights)<br>✅ Mermaid diagrams render correctly<br>✅ Decision points clearly marked |
| **Design System** | 10 | [`ux-design/design-system/`](../packages/ux-design/design-system/) | ✅ Color palette defined<br>✅ Typography scale<br>✅ Component specifications<br>✅ Design tokens (JSON) |
| **High-Fidelity Prototype** | 15 | [`ux-design/prototypes/`](../packages/ux-design/prototypes/) | ✅ Figma link provided<br>✅ All 3 core screens designed<br>✅ Interactive prototype<br>✅ Mobile & desktop views |
| **Accessibility Guidelines** | 5 | [`ux-design/accessibility/`](../packages/ux-design/accessibility/) | ✅ WCAG 2.1 AA compliance plan<br>✅ Color contrast checked<br>✅ Keyboard navigation considered |
| **Developer Handoff** | 5 | [`ux-design/handoff/`](../packages/ux-design/handoff/) | ✅ Component specs documented<br>✅ Measurements provided<br>✅ Asset export guide |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Design Quality** | 10 | Professional visual design, consistent styling, good use of whitespace |
| **Usability** | 10 | Intuitive flows, clear CTAs, minimal cognitive load, error prevention |
| **Documentation** | 5 | Clear explanations, rationale for decisions, easy to follow |
| **Accessibility** | 5 | Semantic HTML considerations, ARIA labels planned, inclusive design |

### Stretch Goals (10 points)

- [ ] **Interaction Design** (3pts): Micro-interactions, animations, loading states specified
- [ ] **Advanced Accessibility** (3pts): Screen reader testing, WCAG AAA considerations
- [ ] **Usability Testing** (4pts): Prototype tested with 3+ users, findings documented

**Total**: 100 points

---

## 💻 Software Engineering

**Overall Weight**: 28% of total project (14% Frontend + 14% Backend)

### Frontend - Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **Intake Page** | 12 | [`frontend/src/pages/intake/`](../packages/frontend/src/pages/intake/) | ✅ Form with all required fields<br>✅ Validation<br>✅ File upload (optional)<br>✅ Success feedback |
| **Triage Queue Page** | 15 | [`frontend/src/pages/triage/`](../packages/frontend/src/pages/triage/) | ✅ List of requests<br>✅ Filtering & sorting<br>✅ Status updates<br>✅ Assignment functionality |
| **Request Detail Page** | 10 | [`frontend/src/pages/detail/`](../packages/frontend/src/pages/detail/) | ✅ Full request display<br>✅ Edit capability<br>✅ Status history<br>✅ AI suggestions shown |
| **Insights Dashboard** | 8 | [`frontend/src/pages/insights/`](../packages/frontend/src/pages/insights/) | ✅ Key metrics displayed<br>✅ Charts/visualizations<br>✅ Data from backend API |
| **API Integration** | 10 | [`frontend/src/services/api.ts`](../packages/frontend/src/services/api.ts) | ✅ All CRUD operations<br>✅ Error handling<br>✅ TypeScript types<br>✅ Matches API contract |
| **Deployment** | 5 | Build works | ✅ `pnpm build` succeeds<br>✅ No console errors<br>✅ Environment config |

### Backend - Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **Request API** | 15 | [`backend/src/routes/requests.routes.ts`](../packages/backend/src/routes/requests.routes.ts) | ✅ All CRUD endpoints<br>✅ Filtering & pagination<br>✅ Matches OpenAPI contract |
| **Triage API** | 10 | [`backend/src/routes/triage.routes.ts`](../packages/backend/src/routes/triage.routes.ts) | ✅ Manual triage endpoint<br>✅ Calls DS API<br>✅ Updates request |
| **Analytics API** | 10 | [`backend/src/routes/analytics.routes.ts`](../packages/backend/src/routes/analytics.routes.ts) | ✅ Summary metrics<br>✅ SLA calculations<br>✅ Category breakdown |
| **Database Models** | 10 | [`backend/src/models/`](../packages/backend/src/models/) | ✅ Request model matches schema<br>✅ User model<br>✅ Proper validation<br>✅ Indexes |
| **Webhook Service** | 10 | [`backend/src/services/webhook.service.ts`](../packages/backend/src/services/webhook.service.ts) | ✅ Emit events on changes<br>✅ Retry logic<br>✅ Matches event contract |
| **Seed Data** | 5 | [`backend/src/utils/seed-database.ts`](../packages/backend/src/utils/seed-database.ts) | ✅ Script works<br>✅ Uses mock data<br>✅ Idempotent |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Code Quality** | 8 | Clean code, proper separation of concerns, DRY principle, consistent style |
| **TypeScript Usage** | 6 | Proper typing, no `any`, interfaces for contracts |
| **Error Handling** | 6 | Try-catch blocks, meaningful error messages, HTTP status codes |
| **Testing** | 5 | At least unit tests for critical functions (optional but recommended) |
| **Documentation** | 5 | API docs, inline comments for complex logic, README completeness |

### Stretch Goals (10 points)

- [ ] **Authentication** (3pts): JWT-based auth, protected routes
- [ ] **Real-time Updates** (3pts): WebSockets for live queue updates
- [ ] **File Upload** (2pts): Handle attachment uploads/storage
- [ ] **Comprehensive Testing** (2pts): >70% code coverage

**Total**: 200 points (100 Frontend + 100 Backend)

---

## 📊 Data Science

**Overall Weight**: 14% of total project

### Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **Exploratory Data Analysis** | 10 | [`data-science/notebooks/01-eda.ipynb`](../packages/data-science/notebooks/01-eda.ipynb) | ✅ Data loaded and explored<br>✅ Visualizations<br>✅ Insights documented<br>✅ Missing data handled |
| **Feature Engineering** | 10 | [`data-science/notebooks/02-feature-engineering.ipynb`](../packages/data-science/notebooks/02-feature-engineering.ipynb) | ✅ Text features (TF-IDF, embeddings)<br>✅ Feature selection<br>✅ Preprocessing pipeline |
| **Model Training** | 15 | [`data-science/notebooks/03-model-training.ipynb`](../packages/data-science/notebooks/03-model-training.ipynb) | ✅ Category classification model<br>✅ Priority classification model<br>✅ Hyperparameter tuning<br>✅ Models saved |
| **Model Evaluation** | 10 | [`data-science/notebooks/04-model-evaluation.ipynb`](../packages/data-science/notebooks/04-model-evaluation.ipynb) | ✅ Accuracy, precision, recall, F1<br>✅ Confusion matrices<br>✅ Error analysis<br>✅ Model comparison |
| **Model API** | 10 | [`data-science/api/app.py`](../packages/data-science/api/app.py) | ✅ FastAPI endpoint `/predict`<br>✅ Loads trained models<br>✅ Returns predictions matching contract<br>✅ Error handling |
| **Model Card** | 5 | [`data-science/docs/MODEL-CARD.md`](../packages/data-science/docs/MODEL-CARD.md) | ✅ Model description<br>✅ Performance metrics<br>✅ Limitations documented<br>✅ Intended use |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Model Performance** | 12 | Category >80% accuracy, Priority >70% accuracy |
| **Code Quality** | 6 | Clean notebooks, reusable functions, proper imports |
| **Documentation** | 6 | Markdown cells explain steps, visualizations labeled, findings clear |
| **Reproducibility** | 6 | Requirements.txt complete, random seeds set, data paths configurable |

### Stretch Goals (10 points)

- [ ] **Advanced Models** (3pts): Try BERT, transformers, or ensemble methods
- [ ] **Confidence Scores** (2pts): Provide calibrated confidence with predictions
- [ ] **Agent Recommendation** (3pts): Suggest best agent based on expertise/availability
- [ ] **Model Monitoring** (2pts): Track prediction accuracy over time

**Total**: 100 points

---

## 📈 Business Intelligence & Analytics

**Overall Weight**: 14% of total project

### Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **Dashboard** | 25 | [`bia/dashboards/`](../packages/bia/dashboards/) | ✅ Working dashboard in chosen tool<br>✅ At least 5 visualizations<br>✅ Filters/slicers functional<br>✅ Professional design |
| **Metric Definitions** | 10 | [`bia/docs/METRIC-DEFINITIONS.md`](../packages/bia/docs/METRIC-DEFINITIONS.md) | ✅ All metrics defined<br>✅ Calculation formulas<br>✅ Business context |
| **SQL Queries** | 10 | [`bia/queries/`](../packages/bia/queries/) | ✅ Volume metrics query<br>✅ SLA metrics query<br>✅ Category analysis query<br>✅ Queries work on seed data |
| **Insights Memo** | 10 | [`bia/docs/INSIGHTS-MEMO.md`](../packages/bia/docs/INSIGHTS-MEMO.md) | ✅ 3+ actionable insights<br>✅ Data-driven recommendations<br>✅ Executive summary |
| **Dashboard Guide** | 5 | [`bia/docs/DASHBOARD-GUIDE.md`](../packages/bia/docs/DASHBOARD-GUIDE.md) | ✅ How to use dashboard<br>✅ Metric explanations<br>✅ Setup instructions |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Visual Design** | 8 | Clear charts, good color choices, proper chart types, readable |
| **Insights Quality** | 10 | Actionable, specific, supported by data, valuable to stakeholders |
| **Data Accuracy** | 6 | Calculations correct, metrics match definitions, no errors |
| **Usability** | 6 | Easy to navigate, filters intuitive, purpose clear |

### Stretch Goals (10 points)

- [ ] **Predictive Analytics** (4pts): Forecast future request volume or trends
- [ ] **Advanced Visualizations** (3pts): Heat maps, geo maps, custom visuals
- [ ] **Interactive Features** (3pts): Drill-through, what-if analysis, dynamic filtering

**Total**: 100 points

---

## 🤖 AI Automation

**Overall Weight**: 14% of total project

### Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **Categorization Prompt** | 12 | [`ai-automation/prompts/categorize-request.txt`](../packages/ai-automation/prompts/categorize-request.txt) | ✅ Clear instructions<br>✅ Examples provided<br>✅ Output format specified<br>✅ Achieves >85% accuracy |
| **Priority Assignment Prompt** | 12 | [`ai-automation/prompts/assign-priority.txt`](../packages/ai-automation/prompts/assign-priority.txt) | ✅ References SLA definitions<br>✅ Examples for each priority<br>✅ Achieves >80% accuracy |
| **Summarization Prompt** | 8 | [`ai-automation/prompts/summarize-request.txt`](../packages/ai-automation/prompts/summarize-request.txt) | ✅ Produces concise summaries<br>✅ Maintains key details<br>✅ Consistent format |
| **Guardrails** | 10 | [`ai-automation/prompts/guardrails.md`](../packages/ai-automation/prompts/guardrails.md) | ✅ Safety checks defined<br>✅ Validation rules<br>✅ Fallback strategies documented |
| **Automation Workflow** | 10 | [`ai-automation/workflows/`](../packages/ai-automation/workflows/) | ✅ Workflow documented<br>✅ Diagram provided<br>✅ Integration with backend<br>✅ Works end-to-end |
| **Integration Doc** | 8 | [`ai-automation/docs/INTEGRATION.md`](../packages/ai-automation/docs/INTEGRATION.md) | ✅ Setup instructions<br>✅ API key configuration<br>✅ Webhook integration explained |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Prompt Quality** | 10 | Clear, specific, few-shot examples, structured output, good results |
| **Accuracy** | 8 | Predictions align with expected categories/priorities |
| **Guardrails** | 6 | Handles edge cases, validates outputs, falls back gracefully |
| **Documentation** | 6 | Clear explanations, setup steps, troubleshooting guide |

### Stretch Goals (10 points)

- [ ] **Advanced Prompting** (3pts): Chain-of-thought, self-consistency, or other advanced techniques
- [ ] **Multi-step Workflow** (4pts): Complex workflow with conditional logic in n8n/Zapier
- [ ] **Feedback Loop** (3pts): Learn from corrections, adapt prompts based on accuracy

**Total**: 100 points

---

## 🔒 Cyber Security

**Overall Weight**: 14% of total project

### Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **STRIDE Threat Model** | 20 | [`security/threat-model/STRIDE-analysis.md`](../packages/security/threat-model/STRIDE-analysis.md) | ✅ All STRIDE categories covered<br>✅ 10+ threats identified<br>✅ Severity ratings<br>✅ Mitigations proposed |
| **Attack Vectors** | 10 | [`security/threat-model/attack-vectors.md`](../packages/security/threat-model/attack-vectors.md) | ✅ API attack vectors<br>✅ Frontend vulnerabilities<br>✅ Data exposure risks documented |
| **Security Policies** | 15 | [`security/policies/`](../packages/security/policies/) | ✅ Authentication policy<br>✅ Data handling policy<br>✅ Clear, actionable requirements |
| **OWASP Top 10 Checklist** | 10 | [`security/checklists/owasp-top-10.md`](../packages/security/checklists/owasp-top-10.md) | ✅ All 10 categories addressed<br>✅ Application-specific checks<br>✅ Remediation steps |
| **Security Summary** | 5 | [`security/docs/SECURITY-SUMMARY.md`](../packages/security/docs/SECURITY-SUMMARY.md) | ✅ Executive summary<br>✅ Key findings<br>✅ Risk prioritization<br>✅ Recommendations |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Threat Analysis Depth** | 10 | Realistic threats, considers actual system, detailed attack scenarios |
| **Mitigation Practicality** | 8 | Solutions are implementable, specific to this app, cost-effective |
| **Documentation Quality** | 6 | Clear writing, well-organized, actionable for developers |
| **Coverage** | 6 | All components reviewed (frontend, backend, API, data), no major gaps |

### Stretch Goals (10 points)

- [ ] **Code Review** (4pts): Actually review code for vulnerabilities, provide specific findings
- [ ] **Penetration Testing** (4pts): Attempt exploit, document findings
- [ ] **Security Automation** (2pts): Automated security scanning (SAST/DAST)

**Total**: 100 points

---

## 🧪 QA (Quality Assurance)

**Overall Weight**: 14% of total project

### Required Deliverables (60 points)

| Deliverable | Points | Location | Criteria |
|-------------|--------|----------|----------|
| **Test Strategy** | 10 | [`qa/test-strategy/TEST-STRATEGY.md`](../packages/qa/test-strategy/TEST-STRATEGY.md) | ✅ Scope defined<br>✅ Test levels identified<br>✅ Entry/exit criteria<br>✅ Tools specified |
| **Test Cases** | 15 | [`qa/test-cases/`](../packages/qa/test-cases/) | ✅ 15+ test cases<br>✅ Cover all 3 user stories<br>✅ Clear steps & expected results<br>✅ Edge cases included |
| **E2E Tests** | 15 | [`qa/e2e-tests/tests/`](../packages/qa/e2e-tests/tests/) | ✅ Submit request flow automated<br>✅ Agent triage flow automated<br>✅ Tests pass<br>✅ Uses Playwright |
| **API Tests** | 10 | [`qa/api-tests/`](../packages/qa/api-tests/) | ✅ REST client collection OR code-based tests<br>✅ Cover main endpoints<br>✅ Positive & negative cases |
| **Test Guide** | 5 | [`qa/docs/TEST-GUIDE.md`](../packages/qa/docs/TEST-GUIDE.md) | ✅ How to run tests<br>✅ Environment setup<br>✅ Interpreting results |
| **Bug Reports** | 5 | [`qa/docs/BUG-TEMPLATE.md`](../packages/qa/docs/BUG-TEMPLATE.md) + actual bugs if found | ✅ Template provided<br>✅ If bugs found, reported properly |

### Quality Criteria (30 points)

| Criterion | Points | What We Look For |
|-----------|--------|------------------|
| **Test Coverage** | 10 | All critical paths tested, edge cases considered, good mix of test types |
| **Test Quality** | 8 | Tests are reliable (not flaky), clear assertions, good test data |
| **Documentation** | 6 | Test cases easy to understand, clear steps, reproducible |
| **Automation** | 6 | E2E tests run successfully, meaningful assertions, good selectors |

### Stretch Goals (10 points)

- [ ] **Visual Regression Testing** (3pts): Screenshot comparison tests
- [ ] **Performance Testing** (3pts): Load testing, response time benchmarks
- [ ] **Accessibility Testing** (2pts): Automated a11y tests with Axe
- [ ] **CI/CD Integration** (2pts): Tests run in GitHub Actions or similar

**Total**: 100 points

---

## 📋 Summary Scorecard

| Discipline | Required | Quality | Stretch | Total | Weight |
|------------|----------|---------|---------|-------|--------|
| **UX/UI Design** | 60 | 30 | 10 | 100 | 14% |
| **Frontend Engineering** | 60 | 30 | 10 | 100 | 14% |
| **Backend Engineering** | 60 | 30 | 10 | 100 | 14% |
| **Data Science** | 60 | 30 | 10 | 100 | 14% |
| **BIA** | 60 | 30 | 10 | 100 | 14% |
| **AI Automation** | 60 | 30 | 10 | 100 | 14% |
| **Cyber Security** | 60 | 30 | 10 | 100 | 14% |
| **QA** | 60 | 30 | 10 | 100 | 14% |

**Project Grade** = Weighted average of completed disciplines

---

## ✅ Minimum Passing Criteria

To pass the project:

1. **Required Deliverables**: At least 48/60 points (80%)
2. **Quality**: At least 18/30 points (60%)
3. **Overall**: At least 70/100 points per discipline
4. **Integration**: System must work end-to-end for at least one user story

---

## 🌟 Excellence Criteria (90+ points)

To achieve excellence:

- All required deliverables complete and high-quality
- Quality criteria consistently met
- At least one stretch goal completed
- Exceptional documentation
- Demonstrates deep understanding
- Goes beyond requirements in meaningful ways

---

## 🔍 Self-Assessment Checklist

Before submission, check:

- [ ] All required deliverables are in the correct locations
- [ ] Code/files follow naming conventions
- [ ] Documentation is complete and clear
- [ ] Work matches contract specifications
- [ ] Tests pass (if applicable)
- [ ] Integration points work
- [ ] No placeholder/TODO content in deliverables
- [ ] README for your discipline is updated

---

## 📊 How to Use This Document

**As a Student**:
1. Review criteria for your discipline before starting
2. Use as a checklist while working
3. Self-assess before final submission
4. Aim for required deliverables first, then quality, then stretch

**As an Instructor**:
1. Use as grading rubric
2. Provide specific feedback per criterion
3. Adjust weights if needed for your course
4. Share with students at project start

---

**Remember**: The goal is learning, not just points. Focus on building something meaningful and understanding how it all fits together! 🎯
