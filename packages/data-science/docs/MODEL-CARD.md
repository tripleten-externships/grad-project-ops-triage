# Model Card: Request Classification Models

## Model Details

### Developed By
Data Science team for Request Management System

### Model Date
<!-- TODO: Update when models are trained -->
**Trained**: [Date]  
**Last Updated**: [Date]

### Model Version
**v1.0.0**

### Model Type
- **Category Model**: Logistic Regression multi-class classifier
- **Priority Model**: Logistic Regression multi-class classifier

### Purpose
Predict the category and priority of incoming support requests based on title and description text.

---

## Intended Use

### Primary Use Cases
1. **Assisted Triage**: Suggest category/priority to agents during request triage
2. **Auto-categorization**: Automatically categorize low-complexity requests
3. **Quality Control**: Identify potentially mis-categorized requests

### Out-of-Scope Uses
- ❌ Fully automated request handling without human oversight
- ❌ High-stakes decisions (security incidents, legal issues)
- ❌ Requests in languages other than English
- ❌ Requests with insufficient text (< 10 words)

---

## Training Data

### Data Source
- Mock request data from `contracts/mock-data/`
- **Size**: <!-- TODO: ~1000 requests (update with actual size) -->
- **Time Period**: <!-- Simulated data representing typical requests -->

### Features
- **Input**: Text (title + description)
- **Feature Engineering**: TF-IDF vectors (1000 features, unigrams + bigrams)
- **Preprocessing**: Lowercase, remove special characters, remove stopwords, lemmatization

### Labels
**Category Classes**:
<!-- TODO: Update based on actual categories from data -->
- IT Support
- HR
- Facilities
- Finance
- Other

**Priority Classes**:
- P0 (Critical)
- P1 (High)
- P2 (Medium)
- P3 (Low)

### Data Splits
- **Training**: 80%
- **Test**: 20%
- **Stratification**: By category to maintain class distribution

---

## Performance

### Category Model

| Metric | Value |
|--------|-------|
| Overall Accuracy | <!-- TODO: e.g., 0.85 --> |
| Macro Avg F1-Score | <!-- TODO --> |
| Weighted Avg F1-Score | <!-- TODO --> |

**Per-Class Performance**:
<!-- TODO: Fill in from notebooks/04-model-evaluation.ipynb -->

| Category | Precision | Recall | F1-Score | Support |
|----------|-----------|--------|----------|---------|
| IT Support | - | - | - | - |
| HR | - | - | - | - |
| ... | - | - | - | - |

### Priority Model

| Metric | Value |
|--------|-------|
| Overall Accuracy | <!-- TODO: e.g., 0.72 --> |
| Macro Avg F1-Score | <!-- TODO --> |
| Weighted Avg F1-Score | <!-- TODO --> |

**Per-Class Performance**:
<!-- TODO -->

| Priority | Precision | Recall | F1-Score | Support |
|----------|-----------|--------|----------|---------|
| P0 | - | - | - | - |
| P1 | - | - | - | - |
| P2 | - | - | - | - |
| P3 | - | - | - | - |

### Confidence Calibration
- **Mean Confidence (Category)**: <!-- TODO: e.g., 0.78 -->
- **Mean Confidence (Priority)**: <!-- TODO: e.g., 0.65 -->
- **Predictions above 0.6 threshold**: <!-- TODO: e.g., 85% -->

---

## Limitations

### Known Limitations
1. **Class Imbalance**: Model may underperform on minority classes
2. **Short Text**: Performance degrades on very short requests (< 20 words)
3. **Novel Categories**: Cannot predict categories not seen during training
4. **Domain Specificity**: Trained on specific organization's request patterns
5. **Language**: English only; no multilingual support

### Edge Cases
- Requests with mixed/multiple categories → May predict primary category only
- Vague descriptions → Low confidence predictions
- Typos and abbreviations → May reduce accuracy

### Not Suitable For
- Requests requiring nuanced human judgment
- Sensitive/confidential requests
- Requests with attached files (not analyzed)
- Real-time critical incidents (human triage required)

---

## Ethical Considerations

### Potential Biases
<!-- TODO: Analyze if certain user groups or request types are treated differently -->
- **Training Data Bias**: Training data may reflect historical biases in manual categorization
- **Language Bias**: Technical jargon may favor certain departments
- **Workload Bias**: High-volume categories may be overpredicted

### Fairness
- Model should be monitored for disparate impact across user groups
- Agents can override predictions to correct biases
- Regular audits recommended

### Privacy
- No personally identifiable information (PII) used in features
- Request text may contain sensitive information → treat predictions as sensitive data

---

## Monitoring & Maintenance

### Production Monitoring
1. **Accuracy Tracking**: Compare predictions to agent's final classification
2. **Confidence Distribution**: Monitor for shifting confidence scores
3. **Category Distribution**: Detect unusual spikes in specific categories
4. **Error Analysis**: Review misclassified requests regularly

### Retraining Schedule
- **Quarterly**: Retrain with new data
- **Trigger-Based**: Retrain if accuracy drops below 75%
- **Data Drift**: Retrain if category distribution changes significantly

### Performance Thresholds
- **Minimum Accuracy**: 70% overall
- **Confidence Threshold**: 0.6 (adjustable based on precision/recall trade-offs)
- **Alert if**: Accuracy < 70% or mean confidence < 0.5

---

## Integration

### API Endpoint
```bash
POST /predict
Content-Type: application/json

{
  "title": "Password reset needed",
  "description": "I can't log into my account",
  "confidence_threshold": 0.6
}
```

### Response Schema
See `contracts/integration-points/ds-model-output.schema.json`

### Integration Points
- **Backend**: Consumes predictions during request creation/triage
- **AI Automation**: May work alongside LLM-based approach
- **BIA**: Tracks prediction accuracy metrics

### Deployment
- **Docker**: `docker build -f api/Dockerfile -t ds-model-api .`
- **Health Check**: `GET /health`
- **Documentation**: `GET /docs` (FastAPI auto-generated)

---

## References

- **Notebooks**: `packages/data-science/notebooks/`
- **Data Contract**: `contracts/schemas/request.schema.json`
- **Output Contract**: `contracts/integration-points/ds-model-output.schema.json`
- **Integration Guide**: `docs/INTEGRATION.md`

---

## Contact

For questions about the model:
- **Model Owner**: Data Science team lead
- **Integration Support**: Software Engineering team
- **Data Issues**: BIA team

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | <!-- Date --> | Initial model release |

<!-- TODO: Update this document after training and evaluation -->
