# Data Science Discipline Guide

## 🎯 Role Overview

As a **Data Scientist**, you'll build machine learning models that automatically categorize and prioritize IT support requests. Your work enables intelligent triage, reducing manual effort and improving response times.

### Your Impact

- **Agents save time** through automated categorization
- **Users get faster help** via accurate priority assignment
- **The business gains insights** from your data analysis
- **The system gets smarter** with your ML models

## 📋 Required Deliverables

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **EDA Notebook** | [`packages/data-science/notebooks/01-eda.ipynb`](../../packages/data-science/notebooks/01-eda.ipynb) | Exploratory data analysis |
| **Feature Engineering** | [`packages/data-science/notebooks/02-feature-engineering.ipynb`](../../packages/data-science/notebooks/02-feature-engineering.ipynb) | Feature creation and selection |
| **Model Training** | [`packages/data-science/notebooks/03-model-training.ipynb`](../../packages/data-science/notebooks/03-model-training.ipynb) | Train classification models |
| **Model Evaluation** | [`packages/data-science/notebooks/04-model-evaluation.ipynb`](../../packages/data-science/notebooks/04-model-evaluation.ipynb) | Performance metrics and analysis |
| **Model API** | [`packages/data-science/api/app.py`](../../packages/data-science/api/app.py) | FastAPI endpoint for predictions |
| **Model Card** | [`packages/data-science/docs/MODEL-CARD.md`](../../packages/data-science/docs/MODEL-CARD.md) | Model documentation |
| **Integration Doc** | [`packages/data-science/docs/INTEGRATION.md`](../../packages/data-science/docs/INTEGRATION.md) | How backend calls your API |

## 🛠️ Tools & Technologies

### Core Stack

```yaml
Language:
  - Python 3.9+

Environment:
  - Jupyter Notebook / JupyterLab
  - Virtual environment (venv)

Data Analysis:
  - pandas (data manipulation)
  - numpy (numerical computing)
  - matplotlib, seaborn (visualization)

Machine Learning:
  - scikit-learn (models, preprocessing)
  - Optional: xgboost, lightgbm

NLP:
  - scikit-learn (TfidfVectorizer, CountVectorizer)
  - Optional: spaCy, nltk, transformers

Model Serving:
  - FastAPI (REST API)
  - uvicorn (ASGI server)
  - pydantic (validation)

Deployment:
  - Docker (containerization)
  - Optional: gunicorn
```

## 🚀 Setup Instructions

### 1. Create Virtual Environment

```bash
cd packages/data-science

# Create venv
python3 -m venv venv

# Activate
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies

```bash
# Install all packages
pip install -r requirements.txt

# Verify installation
python -c "import pandas, sklearn, fastapi; print('Success!')"
```

### 3. Start Jupyter

```bash
jupyter notebook
# Navigate to notebooks/ directory
# Open 01-eda.ipynb
```

### 4. Load Sample Data

```python
import pandas as pd

# Load mock data
requests_df = pd.read_csv('../../contracts/mock-data/requests.csv')
print(f"Loaded {len(requests_df)} requests")
```

## 📖 Development Workflow

### Phase 1: Exploratory Data Analysis (Days 1-2)

**Goal**: Understand the data

#### Notebook 01: EDA

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('../../contracts/mock-data/requests.csv')

# 1. Basic Info
print(df.info())
print(df.describe())
print(df.head())

# 2. Check for missing values
print(df.isnull().sum())

# 3. Target variable distribution
print("Category distribution:")
print(df['category'].value_counts())

print("\nPriority distribution:")
print(df['priority'].value_counts())

# 4. Visualizations
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Category distribution
df['category'].value_counts().plot(kind='bar', ax=axes[0])
axes[0].set_title('Requests by Category')
axes[0].set_ylabel('Count')

# Priority distribution
df['priority'].value_counts().plot(kind='bar', ax=axes[1])
axes[1].set_title('Requests by Priority')
axes[1].set_ylabel('Count')

plt.tight_layout()
plt.show()

# 5. Text analysis
df['title_length'] = df['title'].str.len()
df['desc_length'] = df['description'].str.len()

print("\nText statistics:")
print(df[['title_length', 'desc_length']].describe())

# 6. Category-Priority relationship
pd.crosstab(df['category'], df['priority'], normalize='index')
```

**Key Questions to Answer**:
- How many requests do we have?
- Is the data balanced across categories/priorities?
- Are there missing values?
- What's the typical request length?
- Any patterns between category and priority?

### Phase 2: Feature Engineering (Days 2-3)

**Goal**: Create features for ML models

#### Notebook 02: Feature Engineering

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import re

# 1. Text preprocessing
def preprocess_text(text):
    """Clean and normalize text"""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)  # Remove special chars
    text = re.sub(r'\s+', ' ', text).strip()  # Normalize whitespace
    return text

df['clean_title'] = df['title'].apply(preprocess_text)
df['clean_desc'] = df['description'].apply(preprocess_text)

# 2. Combine text fields
df['text'] = df['clean_title'] + ' ' + df['clean_desc']

# 3. TF-IDF features
tfidf = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
X_tfidf = tfidf.fit_transform(df['text'])

print(f"TF-IDF feature shape: {X_tfidf.shape}")

# 4. Encode labels
le_category = LabelEncoder()
le_priority = LabelEncoder()

y_category = le_category.fit_transform(df['category'])
y_priority = le_priority.fit_transform(df['priority'])

# 5. Save preprocessors
import joblib
joblib.dump(tfidf, '../models/tfidf_vectorizer.pkl')
joblib.dump(le_category, '../models/label_encoder_category.pkl')
joblib.dump(le_priority, '../models/label_encoder_priority.pkl')
```

**Features to Consider**:
- TF-IDF from title + description
- Text length
- Word count
- Presence of keywords (e.g., "password", "network", "broken")
- Department (if available)

### Phase 3: Model Training (Days 4-5)

**Goal**: Build and train ML models

#### Notebook 03: Model Training

```python
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Split data
X_train, X_test, y_cat_train, y_cat_test, y_pri_train, y_pri_test = train_test_split(
    X_tfidf, y_category, y_priority, test_size=0.2, random_state=42
)

# 2. Train category classification model
print("Training category classifier...")

models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Naive Bayes': MultinomialNB(),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
}

best_model_cat = None
best_score_cat = 0

for name, model in models.items():
    model.fit(X_train, y_cat_train)
    score = model.score(X_test, y_cat_test)
    print(f"{name}: {score:.4f}")
    
    if score > best_score_cat:
        best_score_cat = score
        best_model_cat = model

print(f"\nBest category model: {best_score_cat:.4f}")

# 3. Train priority classification model
print("\nTraining priority classifier...")

best_model_pri = None
best_score_pri = 0

for name, model in models.items():
    model = type(model)()  # Create new instance
    model.fit(X_train, y_pri_train)
    score = model.score(X_test, y_pri_test)
    print(f"{name}: {score:.4f}")
    
    if score > best_score_pri:
        best_score_pri = score
        best_model_pri = model

print(f"\nBest priority model: {best_score_pri:.4f}")

# 4. Save models
joblib.dump(best_model_cat, '../models/category_classifier.pkl')
joblib.dump(best_model_pri, '../models/priority_classifier.pkl')
```

**Hyperparameter Tuning**:
```python
# GridSearchCV for best params
param_grid = {
    'C': [0.1, 1, 10],
    'max_iter': [1000]
}

grid_search = GridSearchCV(
    LogisticRegression(),
    param_grid,
    cv=5,
    scoring='accuracy'
)

grid_search.fit(X_train, y_cat_train)
print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")
```

### Phase 4: Model Evaluation (Days 5-6)

**Goal**: Assess model performance

#### Notebook 04: Model Evaluation

```python
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Load models and make predictions
y_cat_pred = best_model_cat.predict(X_test)
y_pri_pred = best_model_pri.predict(X_test)

# 1. Category classification metrics
print("=== Category Classification ===")
print(classification_report(
    y_cat_test, 
    y_cat_pred,
    target_names=le_category.classes_
))

# Confusion matrix
cm_cat = confusion_matrix(y_cat_test, y_cat_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm_cat, annot=True, fmt='d', cmap='Blues',
            xticklabels=le_category.classes_,
            yticklabels=le_category.classes_)
plt.title('Category Classification Confusion Matrix')
plt.ylabel('True')
plt.xlabel('Predicted')
plt.show()

# 2. Priority classification metrics
print("\n=== Priority Classification ===")
print(classification_report(
    y_pri_test,
    y_pri_pred,
    target_names=le_priority.classes_
))

# 3. Error analysis
errors = X_test[y_cat_pred != y_cat_test]
print(f"\nMisclassified: {len(errors)} / {len(X_test)}")

# Look at specific examples
for i in range(min(5, len(errors))):
    idx = errors.indices[i]
    print(f"\nTrue: {le_category.inverse_transform([y_cat_test[idx]])[0]}")
    print(f"Predicted: {le_category.inverse_transform([y_cat_pred[idx]])[0]}")
```

**Minimum Acceptable Performance**:
- Category classification: **> 75% accuracy**
- Priority classification: **> 65% accuracy**

**Document in Model Card**:
- Accuracy, precision, recall, F1 per class
- Confusion matrices
- Error patterns
- Model limitations

### Phase 5: Model Serving (Days 6-7)

**Goal**: Deploy as REST API

#### Create FastAPI Application

```python
# packages/data-science/api/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from datetime import datetime
import re

app = FastAPI(title="Ops Triage ML API", version="1.0.0")

# Load models and preprocessors at startup
tfidf = joblib.load('../models/tfidf_vectorizer.pkl')
model_category = joblib.load('../models/category_classifier.pkl')
model_priority = joblib.load('../models/priority_classifier.pkl')
le_category = joblib.load('../models/label_encoder_category.pkl')
le_priority = joblib.load('../models/label_encoder_priority.pkl')

# Request schema
class PredictionRequest(BaseModel):
    title: str
    description: str
    department: str = None

# Response schema (matches contract)
class PredictionResponse(BaseModel):
    requestId: str = None
    predictions: dict
    modelVersion: str = "1.0.0"
    timestamp: str

def preprocess_text(text: str) -> str:
    """Clean text for prediction"""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Predict category and priority for a request"""
    try:
        # Preprocess
        clean_title = preprocess_text(request.title)
        clean_desc = preprocess_text(request.description)
        text = f"{clean_title} {clean_desc}"
        
        # Transform to features
        X = tfidf.transform([text])
        
        # Predict category
        cat_pred = model_category.predict(X)[0]
        cat_proba = model_category.predict_proba(X)[0]
        category = le_category.inverse_transform([cat_pred])[0]
        cat_confidence = float(max(cat_proba))
        
        # Predict priority
        pri_pred = model_priority.predict(X)[0]
        pri_proba = model_priority.predict_proba(X)[0]
        priority = le_priority.inverse_transform([pri_pred])[0]
        pri_confidence = float(max(pri_proba))
        
        # Estimate resolution time (simple heuristic)
        resolution_times = {'P0': 4, 'P1': 24, 'P2': 72, 'P3': 120}
        estimated_hours = resolution_times.get(priority, 48)
        
        return PredictionResponse(
            predictions={
                "category": category,
                "categoryConfidence": round(cat_confidence, 3),
                "priority": priority,
                "priorityConfidence": round(pri_confidence, 3),
                "suggestedAgent": None,  # Optional enhancement
                "estimatedResolutionTime": estimated_hours
            },
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "model_version": "1.0.0"}

@app.get("/")
async def root():
    return {"message": "Ops Triage ML API", "docs": "/docs"}
```

#### Run the API

```bash
cd packages/data-science

# Development
uvicorn api.app:app --reload --port 8000

# Production
gunicorn api.app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Test the API

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cannot access email",
    "description": "Getting error when trying to login to Outlook"
  }'
```

## 🔌 Integration with Backend

The backend calls your API like this:

```typescript
// Backend service
const response = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: request.title,
    description: request.description
  })
});

const predictions = await response.json();
// Use predictions.predictions.category, etc.
```

Make sure your response matches [`contracts/integration-points/ds-model-output.schema.json`](../../contracts/integration-points/ds-model-output.schema.json).

## 📄 Model Card Template

Document your model in [`docs/MODEL-CARD.md`](../../packages/data-science/docs/MODEL-CARD.md):

```markdown
# Model Card: IT Request Classification

## Model Details
- **Model Date**: 2026-02-05
- **Model Version**: 1.0.0
- **Model Type**: Multi-output classification (category + priority)
- **Algorithms**: Logistic Regression / Random Forest
- **Features**: TF-IDF (500 features) from title + description

## Intended Use
- **Primary Use**: Automated triage of IT support requests
- **Out-of-scope**: Medical, legal, or safety-critical decisions

## Training Data
- **Source**: Mock data generated from templates
- **Size**: 1000 requests
- **Features**: Title, description
- **Labels**: Category (5 classes), Priority (4 classes)
- **Split**: 80% train, 20% test

## Performance
### Category Classification
- **Accuracy**: 82%
- **Precision**: 0.81
- **Recall**: 0.80
- **F1**: 0.80

### Priority Classification
- **Accuracy**: 71%
- **Precision**: 0.69
- **Recall**: 0.68
- **F1**: 0.68

## Limitations
- Trained on limited mock data, may not generalize
- Performance degrades on very short descriptions (< 10 words)
- Bias toward "Software" category (most common in training data)
- No handling of attachments or images

## Ethical Considerations
- May perpetuate biases in historical triage decisions
- Should not fully replace human judgment
- Confidence scores should be displayed to users
```

## ✅ Deliverable Checklist

- [ ] **EDA**: Data loaded, visualized, insights documented
- [ ] **Feature Engineering**: TF-IDF created, preprocessors saved
- [ ] **Model Training**: Category + priority models trained and saved
- [ ] **Evaluation**: Metrics calculated, confusion matrices, error analysis
- [ ] **API**: FastAPI endpoint working, matches contract
- [ ] **Model Card**: Complete documentation
- [ ] **Integration Doc**: Instructions for backend team
- [ ] **Requirements.txt**: All dependencies listed
- [ ] **Models saved**: In `models/` directory

## 🎯 Stretch Goals

- [ ] **Advanced NLP**: Use word embeddings (Word2Vec, GloVe) or BERT
- [ ] **Ensemble Models**: Combine multiple models
- [ ] **Agent Recommendation**: Predict best agent based on expertise
- [ ] **Confidence Calibration**: Calibrated probability scores
- [ ] **Model Monitoring**: Log predictions for retraining
- [ ] **A/B Testing**: Compare rule-based vs. ML triage
- [ ] **Explainability**: SHAP or LIME for interpretability

## 📚 Resources

- **scikit-learn**: [scikit-learn.org](https://scikit-learn.org)
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Model Cards**: [modelcards.withgoogle.com](https://modelcards.withgoogle.com/about)
- **Text Classification**: [scikit-learn text tutorial](https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html)

---

**Build models that make a real impact!** 🤖📊
