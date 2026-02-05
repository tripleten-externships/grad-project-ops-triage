"""
Model training script.

This script trains category and priority prediction models using the processed data.
Can be run as a standalone script or imported as a module.

Usage:
    python train_model.py --data-path ../data/processed --output-dir ../models
"""

import argparse
import pickle
from pathlib import Path
import numpy as np
import scipy.sparse
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import json
from datetime import datetime


def load_processed_data(data_dir: Path):
    """Load preprocessed features and labels."""
    X = scipy.sparse.load_npz(data_dir / 'X_tfidf.npz')
    y_category = np.load(data_dir / 'y_category.npy')
    y_priority = np.load(data_dir / 'y_priority.npy')
    
    with open(data_dir / 'category_encoder.pkl', 'rb') as f:
        category_encoder = pickle.load(f)
    with open(data_dir / 'priority_encoder.pkl', 'rb') as f:
        priority_encoder = pickle.load(f)
    
    return X, y_category, y_priority, category_encoder, priority_encoder


def train_category_model(X_train, y_train, random_state=42):
    """Train category classification model."""
    print("Training category model...")
    model = LogisticRegression(
        max_iter=1000,
        random_state=random_state,
        class_weight='balanced',
        solver='lbfgs'
    )
    model.fit(X_train, y_train)
    return model


def train_priority_model(X_train, y_train, random_state=42):
    """Train priority classification model."""
    print("Training priority model...")
    model = LogisticRegression(
        max_iter=1000,
        random_state=random_state,
        class_weight='balanced',
        solver='lbfgs'
    )
    model.fit(X_train, y_train)
    return model


def evaluate_model(model, X_test, y_test, label_encoder):
    """Evaluate model and return metrics."""
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    confidence = y_proba.max(axis=1).mean()
    
    print(f"Accuracy: {accuracy:.3f}")
    print(f"Mean Confidence: {confidence:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    return {
        'accuracy': float(accuracy),
        'mean_confidence': float(confidence)
    }


def main(data_dir: Path, output_dir: Path, test_size: float = 0.2, random_state: int = 42):
    """Main training pipeline."""
    print(f"Loading data from {data_dir}...")
    X, y_category, y_priority, category_encoder, priority_encoder = load_processed_data(data_dir)
    
    # Train/test split
    print(f"\nSplitting data (test_size={test_size})...")
    X_train, X_test, y_cat_train, y_cat_test, y_pri_train, y_pri_test = train_test_split(
        X, y_category, y_priority,
        test_size=test_size,
        random_state=random_state,
        stratify=y_category
    )
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # Train models
    print("\n" + "="*50)
    print("CATEGORY MODEL")
    print("="*50)
    cat_model = train_category_model(X_train, y_cat_train, random_state)
    cat_metrics = evaluate_model(cat_model, X_test, y_cat_test, category_encoder)
    
    print("\n" + "="*50)
    print("PRIORITY MODEL")
    print("="*50)
    pri_model = train_priority_model(X_train, y_pri_train, random_state)
    pri_metrics = evaluate_model(pri_model, X_test, y_pri_test, priority_encoder)
    
    # Save models
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\nSaving models to {output_dir}...")
    with open(output_dir / 'category_model.pkl', 'wb') as f:
        pickle.dump(cat_model, f)
    with open(output_dir / 'priority_model.pkl', 'wb') as f:
        pickle.dump(pri_model, f)
    
    # Save metadata
    metadata = {
        'category_model': {
            'type': 'LogisticRegression',
            'accuracy': cat_metrics['accuracy'],
            'mean_confidence': cat_metrics['mean_confidence'],
            'classes': category_encoder.classes_.tolist()
        },
        'priority_model': {
            'type': 'LogisticRegression',
            'accuracy': pri_metrics['accuracy'],
            'mean_confidence': pri_metrics['mean_confidence'],
            'classes': priority_encoder.classes_.tolist()
        },
        'training_info': {
            'n_train_samples': int(X_train.shape[0]),
            'n_test_samples': int(X_test.shape[0]),
            'test_size': test_size,
            'random_state': random_state,
            'trained_at': datetime.now().isoformat()
        }
    }
    
    with open(output_dir / 'metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\nTraining complete!")
    print(f"Models saved to: {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train request classification models")
    parser.add_argument(
        '--data-path',
        type=Path,
        default=Path('../data/processed'),
        help='Path to processed data directory'
    )
    parser.add_argument(
        '--output-dir',
        type=Path,
        default=Path('../models'),
        help='Output directory for trained models'
    )
    parser.add_argument(
        '--test-size',
        type=float,
        default=0.2,
        help='Test set proportion (0-1)'
    )
    parser.add_argument(
        '--random-state',
        type=int,
        default=42,
        help='Random seed for reproducibility'
    )
    
    args = parser.parse_args()
    main(args.data_path, args.output_dir, args.test_size, args.random_state)
