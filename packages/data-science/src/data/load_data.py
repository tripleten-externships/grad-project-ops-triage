"""
Data loading utilities for the Request Management System.

This module provides functions to load data from:
- Mock data (CSV/JSON from contracts)
- Backend API
- Database (if direct access is available)
"""

import pandas as pd
import json
from pathlib import Path
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()


def load_mock_data(format: str = "csv") -> pd.DataFrame:
    """
    Load mock data from contracts/mock-data directory.
    
    Args:
        format: 'csv' or 'json'
        
    Returns:
        DataFrame with request data
        
    TODO: Update path based on actual project structure
    """
    base_path = Path(__file__).parents[3] / "contracts" / "mock-data"
    
    if format == "csv":
        file_path = base_path / "requests.csv"
        df = pd.read_csv(file_path)
    elif format == "json":
        file_path = base_path / "requests.json"
        with open(file_path, 'r') as f:
            data = json.load(f)
        df = pd.DataFrame(data)
    else:
        raise ValueError(f"Unsupported format: {format}")
    
    print(f"Loaded {len(df)} requests from {file_path}")
    return df


def load_from_api(api_url: Optional[str] = None, api_key: Optional[str] = None) -> pd.DataFrame:
    """
    Load data from backend API.
    
    Args:
        api_url: Backend API endpoint (defaults to env var BACKEND_API_URL)
        api_key: API key for authentication (defaults to env var BACKEND_API_KEY)
        
    Returns:
        DataFrame with request data
        
    TODO: Implement API client logic
    """
    import requests
    
    api_url = api_url or os.getenv("BACKEND_API_URL", "http://localhost:3000")
    api_key = api_key or os.getenv("BACKEND_API_KEY")
    
    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    
    # TODO: Adjust endpoint based on actual API
    response = requests.get(f"{api_url}/api/requests", headers=headers)
    response.raise_for_status()
    
    data = response.json()
    df = pd.DataFrame(data)
    
    print(f"Loaded {len(df)} requests from API")
    return df


def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Basic preprocessing of request data.
    
    Args:
        df: Raw DataFrame
        
    Returns:
        Preprocessed DataFrame
    """
    # Make a copy
    df = df.copy()
    
    # Handle missing values
    df['title'] = df['title'].fillna('')
    df['description'] = df['description'].fillna('')
    
    # Ensure category and priority exist
    if 'category' not in df.columns:
        raise ValueError("Missing 'category' column")
    if 'priority' not in df.columns:
        raise ValueError("Missing 'priority' column")
    
    # Convert timestamps if present
    timestamp_cols = ['createdAt', 'updatedAt', 'resolvedAt']
    for col in timestamp_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
    
    return df


def get_training_data(use_local: bool = True) -> pd.DataFrame:
    """
    Get data for model training.
    
    Args:
        use_local: If True, use local mock data; otherwise fetch from API
        
    Returns:
        DataFrame ready for training
    """
    if use_local or os.getenv("USE_LOCAL_DATA", "true").lower() == "true":
        df = load_mock_data(format="csv")
    else:
        df = load_from_api()
    
    df = preprocess_dataframe(df)
    return df


if __name__ == "__main__":
    # Test data loading
    print("Testing data loading...")
    df = get_training_data(use_local=True)
    print(f"\nDataFrame shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    print(f"\nFirst few rows:")
    print(df.head())
    print(f"\nCategory distribution:")
    print(df['category'].value_counts())
    print(f"\nPriority distribution:")
    print(df['priority'].value_counts())
