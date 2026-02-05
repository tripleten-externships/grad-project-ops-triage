# Data Science Package

## Overview
This package provides scaffolding for the Data Science team to develop machine learning models for the Request Management System. The primary use case is intelligent request categorization and priority prediction.

## Objectives
- Build ML models to predict request category and priority
- Provide model API endpoint for integration with backend
- Document model performance and limitations
- Enable collaboration between DS and Software Engineering teams

---

## Project Structure
```
data-science/
├── notebooks/          # Jupyter notebooks for exploration
├── src/                # Production-ready Python code
│   ├── data/           # Data loading and preprocessing
│   └── models/         # Model training and prediction
├── api/                # FastAPI model serving
├── docs/               # Documentation
└── requirements.txt    # Python dependencies
```

---

## Team Deliverables

### Phase 1: Data Exploration (Week 1-2)
- [ ] Load and explore mock data from `contracts/mock-data/`
- [ ] Exploratory data analysis (EDA) in `notebooks/01-eda.ipynb`
- [ ] Identify features for category/priority prediction
- [ ] Document data quality issues

### Phase 2: Feature Engineering (Week 2-3)
- [ ] Text preprocessing (title, description)
- [ ] Feature extraction (TF-IDF, embeddings)
- [ ] Feature engineering notebook: `notebooks/02-feature-engineering.ipynb`

### Phase 3: Model Development (Week 3-4)
- [ ] Train classification models (category, priority)
- [ ] Evaluate model performance
- [ ] Model training notebook: `notebooks/03-model-training.ipynb`
- [ ] Model evaluation notebook: `notebooks/04-model-evaluation.ipynb`

### Phase 4: Model Deployment (Week 5-6)
- [ ] Create production prediction script: `src/models/predict.py`
- [ ] Build FastAPI endpoint: `api/app.py`
- [ ] Document integration: `docs/INTEGRATION.md`
- [ ] Create model card: `docs/MODEL-CARD.md`
- [ ] Dockerize model API

---

## Setup Instructions

### Prerequisites
- Python 3.9+
- Jupyter Notebook or JupyterLab
- Docker (for API deployment)

### Installation

1. **Create virtual environment**:
```bash
cd packages/data-science
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Launch Jupyter**:
```bash
jupyter lab
# Navigate to notebooks/ directory
```

---

## Workflow

### 1. Exploratory Data Analysis
- Open `notebooks/01-eda.ipynb`
- Load data from `contracts/mock-data/requests.csv` or `requests.json`
- Analyze distributions, missing values, class imbalance
- Visualize request categories, priority distribution

### 2. Feature Engineering
- Open `notebooks/02-feature-engineering.ipynb`
- Preprocess text (lowercase, remove stopwords, lemmatization)
- Extract features (TF-IDF vectors, word embeddings)
- Create feature matrices for training

### 3. Model Training
- Open `notebooks/03-model-training.ipynb`
- Split data into train/test sets
- Train classification models (scikit-learn, or simple neural network)
- Tune hyperparameters
- Save trained models to `models/` directory

### 4. Model Evaluation
- Open `notebooks/04-model-evaluation.ipynb`
- Calculate metrics: accuracy, precision, recall, F1-score
- Generate confusion matrices
- Analyze error cases
- Document in model card

### 5. Production Deployment
- Refactor notebook code to clean Python scripts in `src/`
- Implement prediction API in `api/app.py`
- Match output schema: `contracts/integration-points/ds-model-output.schema.json`
- Test API locally: `uvicorn api.app:app --reload`
- Build Docker image: `docker build -t model-api -f api/Dockerfile .`

---

## Data Sources

### Training Data
- **Location**: `contracts/mock-data/requests.csv` and `requests.json`
- **Fields**: title, description, category, priority, status, timestamps
- **Size**: <!-- TODO: Document actual size -->
- **Data Generator**: See `contracts/mock-data/data-generator.js` to generate more data

### Real-Time Data (Production)
- **Source**: Backend database via API endpoint
- **Format**: JSON matching `contracts/schemas/request.schema.json`
- **Access**: <!-- TODO: Define how DS team accesses production data -->

---

## Model Specifications

### Input
- **Title**: String (10-200 characters)
- **Description**: String (free text)
- **Historical Data**: (optional) Requester info, timestamp

### Output
JSON matching `contracts/integration-points/ds-model-output.schema.json`:
```json
{
  "predicted_category": "IT Support",
  "category_confidence": 0.87,
  "predicted_priority": "P1",
  "priority_confidence": 0.72,
  "model_version": "1.0.0",
  "timestamp": "2026-02-04T12:00:00Z"
}
```

### Performance Targets
<!-- TODO: Define acceptable performance metrics -->
- **Category Prediction Accuracy**: > 80%
- **Priority Prediction Accuracy**: > 70%
- **Inference Time**: < 200ms per request
- **Confidence Threshold**: Only return predictions if confidence > 0.6

---

## Integration with Backend

### API Endpoint
The FastAPI service exposes:
- `POST /predict` - Predict category and priority for a request

### Backend Integration
1. Backend sends request data to DS model API
2. Model returns predictions with confidence scores
3. Backend stores predictions in `ai_metadata` field
4. Agent sees predictions in triage UI (see `packages/ai-automation/`)

See `docs/INTEGRATION.md` for detailed integration steps.

---

## Model Versioning

### Version Naming
- **Format**: `v{major}.{minor}.{patch}`
- **Example**: `v1.0.0`, `v1.1.0`, `v2.0.0`

### When to Increment
- **Major**: Breaking changes (different output schema)
- **Minor**: Improved accuracy, new features (backward compatible)
- **Patch**: Bug fixes, small improvements

### Model Storage
<!-- TODO: Define where trained models are stored -->
- Local development: `models/` directory
- Production: Cloud storage (S3, GCS) or model registry (MLflow)

---

## Monitoring & Evaluation

### Offline Evaluation
- Metrics calculated on holdout test set
- Documented in `notebooks/04-model-evaluation.ipynb`

### Online Evaluation
<!-- TODO: Define production monitoring -->
- Track prediction accuracy (compare to agent's final category/priority)
- Monitor confidence score distribution
- Alert if accuracy drops below threshold
- Retrain model quarterly or when drift detected

---

## Tools & Libraries

### Core Libraries
- **pandas**: Data manipulation
- **scikit-learn**: ML models and preprocessing
- **matplotlib/seaborn**: Visualization
- **nltk/spaCy**: NLP preprocessing
- **FastAPI**: Model serving
- **pydantic**: Data validation

### Optional/Advanced
- **transformers**: Pre-trained language models (BERT, etc.)
- **MLflow**: Experiment tracking
- **DVC**: Data version control
- **pytest**: Testing

---

## Testing

### Unit Tests
```bash
pytest src/tests/
```

### API Tests
```bash
# Start API
uvicorn api.app:app --host 0.0.0.0 --port 8000

# Test endpoint
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"title": "Password reset needed", "description": "I forgot my password"}'
```

---

## Collaboration

### With Software Engineering Team
- DS provides model API endpoint
- SE integrates endpoint into backend webhook flow
- DS provides confidence thresholds for auto-acceptance
- Reference: `packages/backend/docs/ARCHITECTURE.md`

### With AI Automation Team
- AI automation may use DS model or LLM-based approach
- Coordinate on which approach to use
- Reference: `packages/ai-automation/`

### With BIA Team
- BIA analyzes model prediction accuracy over time
- DS uses BIA insights to retrain model
- Reference: `packages/bia/`

---

## Deployment

### Local Development
```bash
cd api
uvicorn app:app --reload --port 8001
```

### Docker Deployment
```bash
docker build -t ds-model-api -f api/Dockerfile .
docker run -p 8001:8000 ds-model-api
```

### Cloud Deployment
<!-- TODO: Define cloud deployment strategy (AWS SageMaker, GCP AI Platform, Azure ML) -->

---

## References

- **Contracts**: [`contracts/`](../../contracts/)
- **Mock Data**: [`contracts/mock-data/`](../../contracts/mock-data/)
- **Output Schema**: [`contracts/integration-points/ds-model-output.schema.json`](../../contracts/integration-points/ds-model-output.schema.json)
- **Backend Integration**: [`packages/backend/`](../backend/)
- **AI Automation**: [`packages/ai-automation/`](../ai-automation/)

---

## Support

For questions:
- **Data/Model Questions**: DS team lead
- **Integration Questions**: SE team lead
- **Data Access**: BIA team

---

## Next Steps

1. Complete EDA notebook
2. Experiment with different models
3. Document findings in model card
4. Build and test API endpoint
5. Coordinate integration with backend team
