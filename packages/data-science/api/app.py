"""
FastAPI application for serving ML model predictions.

This API exposes the trained models as a REST endpoint that matches the schema
defined in contracts/integration-points/ds-model-output.schema.json

Usage:
    uvicorn app:app --reload --port 8001
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import sys
from pathlib import Path
import os

# Add parent directory to path to import from src
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.models.predict import RequestPredictor

# Initialize FastAPI app
app = FastAPI(
    title="Request Management DS Model API",
    description="Machine learning models for request category and priority prediction",
    version="1.0.0"
)

# CORS middleware (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
# TODO: Handle case where models don't exist yet
try:
    predictor = RequestPredictor(
        models_dir='../models',
        data_dir='../data/processed'
    )
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"⚠️  Warning: Could not load models: {e}")
    print("   API will return 503 errors until models are trained")
    predictor = None


# Request/Response models
class PredictionRequest(BaseModel):
    """Input schema for prediction endpoint."""
    title: str = Field(..., min_length=1, max_length=500, description="Request title")
    description: str = Field(..., min_length=1, description="Request description")
    confidence_threshold: Optional[float] = Field(
        0.6,
        ge=0.0,
        le=1.0,
        description="Minimum confidence to return prediction"
    )


class PredictionResponse(BaseModel):
    """
    Output schema matching contracts/integration-points/ds-model-output.schema.json
    """
    predicted_category: Optional[str] = Field(None, description="Predicted category (null if below threshold)")
    category_confidence: float = Field(..., ge=0.0, le=1.0, description="Category prediction confidence")
    predicted_priority: Optional[str] = Field(None, description="Predicted priority (null if below threshold)")
    priority_confidence: float = Field(..., ge=0.0, le=1.0, description="Priority prediction confidence")
    model_version: str = Field(..., description="Model version identifier")
    timestamp: str = Field(..., description="Prediction timestamp (ISO 8601)")


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "service": "Request Management DS Model API",
        "version": "1.0.0",
        "status": "running" if predictor else "models not loaded",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint for monitoring.
    
    Returns 200 if models are loaded, 503 otherwise.
    """
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="Models not loaded. Please train models first."
        )
    return {
        "status": "healthy",
        "model_version": predictor.model_version
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Predict category and priority for a request.
    
    **Input:**
    - title: Request title (required)
    - description: Request description (required)
    - confidence_threshold: Minimum confidence (default: 0.6)
    
    **Output:**
    - predicted_category: Category prediction or null
    - category_confidence: Confidence score [0-1]
    - predicted_priority: Priority prediction or null
    - priority_confidence: Confidence score [0-1]
    - model_version: Model version string
    - timestamp: Prediction timestamp
    
    **Example:**
    ```json
    {
      "title": "Password reset needed",
      "description": "I can't log into my account"
    }
    ```
    """
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="Models not available. Please train models first."
        )
    
    try:
        result = predictor.predict(
            title=request.title,
            description=request.description,
            confidence_threshold=request.confidence_threshold
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/model-info")
def model_info():
    """
    Get information about the loaded models.
    """
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="Models not loaded"
        )
    
    return {
        "model_version": predictor.model_version,
        "category_classes": predictor.category_encoder.classes_.tolist(),
        "priority_classes": predictor.priority_encoder.classes_.tolist(),
        "feature_count": predictor.vectorizer.get_feature_names_out().shape[0]
    }


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("API_PORT", 8001))
    host = os.getenv("API_HOST", "0.0.0.0")
    reload = os.getenv("API_RELOAD", "true").lower() == "true"
    
    print(f"\nStarting DS Model API on {host}:{port}")
    print(f"Docs available at: http://{host}:{port}/docs\n")
    
    uvicorn.run("app:app", host=host, port=port, reload=reload)
