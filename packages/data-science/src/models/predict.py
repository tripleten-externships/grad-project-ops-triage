"""
Prediction module for trained models.

Provides a unified interface for making predictions with trained category and priority models.
Outputs match the schema defined in contracts/integration-points/ds-model-output.schema.json
"""

import pickle
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
import os


class RequestPredictor:
    """
    Predictor class for request category and priority.
    
    Usage:
        predictor = RequestPredictor(models_dir='../models', data_dir='../data/processed')
        result = predictor.predict("Password reset needed", "I can't log into my account")
    """
    
    def __init__(self, models_dir: str = '../models', data_dir: str = '../data/processed'):
        """
        Initialize predictor with trained models and preprocessing artifacts.
        
        Args:
            models_dir: Path to directory containing trained models
            data_dir: Path to directory containing preprocessing artifacts (vectorizer, encoders)
        """
        models_path = Path(models_dir)
        data_path = Path(data_dir)
        
        # Load models
        with open(models_path / 'category_model.pkl', 'rb') as f:
            self.category_model = pickle.load(f)
        with open(models_path / 'priority_model.pkl', 'rb') as f:
            self.priority_model = pickle.load(f)
        
        # Load preprocessing artifacts
        with open(data_path / 'tfidf_vectorizer.pkl', 'rb') as f:
            self.vectorizer = pickle.load(f)
        with open(data_path / 'category_encoder.pkl', 'rb') as f:
            self.category_encoder = pickle.load(f)
        with open(data_path / 'priority_encoder.pkl', 'rb') as f:
            self.priority_encoder = pickle.load(f)
        
        # Load model version from metadata if available
        self.model_version = os.getenv('MODEL_VERSION', '1.0.0')
        
        print("RequestPredictor initialized successfully")
    
    def preprocess_text(self, title: str, description: str) -> str:
        """
        Preprocess text for prediction.
        
        TODO: This should match the preprocessing in notebooks/02-feature-engineering.ipynb
        For now, simple concatenation.
        """
        combined = f"{title} {description}"
        return combined
    
    def predict(
        self,
        title: str,
        description: str,
        confidence_threshold: float = 0.6
    ) -> Dict[str, Any]:
        """
        Predict category and priority for a request.
        
        Args:
            title: Request title
            description: Request description
            confidence_threshold: Minimum confidence to return prediction
            
        Returns:
            Dictionary matching ds-model-output.schema.json:
            {
                "predicted_category": str or None,
                "category_confidence": float,
                "predicted_priority": str or None,
                "priority_confidence": float,
                "model_version": str,
                "timestamp": str (ISO 8601)
            }
        """
        # Preprocess
        text = self.preprocess_text(title, description)
        
        # Vectorize
        X = self.vectorizer.transform([text])
        
        # Predict category
        cat_proba = self.category_model.predict_proba(X)[0]
        cat_idx = cat_proba.argmax()
        cat_confidence = float(cat_proba[cat_idx])
        
        if cat_confidence >= confidence_threshold:
            predicted_category = self.category_encoder.classes_[cat_idx]
        else:
            predicted_category = None
        
        # Predict priority
        pri_proba = self.priority_model.predict_proba(X)[0]
        pri_idx = pri_proba.argmax()
        pri_confidence = float(pri_proba[pri_idx])
        
        if pri_confidence >= confidence_threshold:
            predicted_priority = self.priority_encoder.classes_[pri_idx]
        else:
            predicted_priority = None
        
        # Build output matching schema
        result = {
            "predicted_category": predicted_category,
            "category_confidence": cat_confidence,
            "predicted_priority": predicted_priority,
            "priority_confidence": pri_confidence,
            "model_version": self.model_version,
            "timestamp": datetime.utcnow().isoformat() + 'Z'
        }
        
        return result
    
    def predict_batch(self, requests: list[Dict[str, str]]) -> list[Dict[str, Any]]:
        """
        Predict for multiple requests at once.
        
        Args:
            requests: List of dicts with 'title' and 'description'
            
        Returns:
            List of prediction results
        """
        return [self.predict(req['title'], req['description']) for req in requests]


if __name__ == "__main__":
    # Test prediction
    predictor = RequestPredictor()
    
    # Example predictions
    test_cases = [
        {
            "title": "Password reset needed",
            "description": "I forgot my password and can't log in"
        },
        {
            "title": "New employee setup",
            "description": "Need laptop and accounts for new hire starting Monday"
        },
        {
            "title": "Server is down",
            "description": "Production server not responding, users can't access application"
        }
    ]
    
    print("\nTest Predictions:")
    print("=" * 80)
    for req in test_cases:
        result = predictor.predict(req['title'], req['description'])
        print(f"\nTitle: {req['title']}")
        print(f"Category: {result['predicted_category']} (confidence: {result['category_confidence']:.2f})")
        print(f"Priority: {result['predicted_priority']} (confidence: {result['priority_confidence']:.2f})")
