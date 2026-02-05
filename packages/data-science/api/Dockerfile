# Multi-stage Docker build for DS Model API

# Stage 1: Build environment
FROM python:3.9-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime environment
FROM python:3.9-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY api/ ./api/
COPY src/ ./src/
COPY models/ ./models/
COPY data/processed/ ./data/processed/

# Copy environment file template
COPY .env.example .env

# Make sure scripts are in PATH
ENV PATH=/root/.local/bin:$PATH

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run the API
CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]

# TODO: Adjust paths based on actual project structure
# TODO: Consider using multi-arch build for ARM/x86
# TODO: Add model download step if models are stored externally
