/**
 * Main automation logic for request triage
 * 
 * This module orchestrates the AI-powered categorization and prioritization
 * of incoming support requests.
 */

import { LLMClient } from './llm-client';
import { validatePrediction, applyGuardrails } from './validators';
import axios from 'axios';

// Types matching output schema
interface TriageRequest {
  request_id: string;
  title: string;
  description: string;
}

interface TriageResponse {
  request_id: string;
  suggested_category: string | null;
  category_confidence: number;
  suggested_priority: string | null;
  priority_confidence: number;
  summary?: string;
  reasoning?: string;
  needs_manual_review?: boolean;
  review_reason?: string;
  model: string;
  timestamp: string;
}

interface LLMPrediction {
  category: string;
  category_confidence: number;
  priority: string;
  priority_confidence: number;
  reasoning: string;
}

/**
 * Main triage function
 */
export async function triageRequest(request: TriageRequest): Promise<TriageResponse> {
  const startTime = Date.now();
  
  try {
    // Step 1: Validate input
    validateInput(request);
    
    // Step 2: Check for sensitive content (simplified)
    const isSensitive = checkSensitiveContent(request);
    
    // Step 3: Try DS model first (if enabled and available)
    let prediction: LLMPrediction | null = null;
    let usedDSModel = false;
    
    if (process.env.USE_DS_MODEL_FALLBACK === 'true') {
      prediction = await tryDSModel(request);
      if (prediction && prediction.category_confidence >= 0.7) {
        usedDSModel = true;
      } else {
        prediction = null; // Fall through to LLM
      }
    }
    
    // Step 4: Use LLM if DS model not used or failed
    if (!prediction) {
      const llmClient = new LLMClient();
      prediction = await llmClient.categorizeRequest(request.title, request.description);
    }
    
    // Step 5: Generate summary (LLM only)
    const llmClient = new LLMClient();
    const summary = await llmClient.summarizeRequest(request.title, request.description);
    
    // Step 6: Validate prediction
    const validated = validatePrediction(prediction);
    
    // Step 7: Apply guardrails
    const result = applyGuardrails({
      ...validated,
      summary,
      is_sensitive: isSensitive
    });
    
    // Step 8: Build response
    const response: TriageResponse = {
      request_id: request.request_id,
      suggested_category: result.category,
      category_confidence: result.category_confidence,
      suggested_priority: result.priority,
      priority_confidence: result.priority_confidence,
      summary: result.summary,
      reasoning: result.reasoning,
      needs_manual_review: result.needs_manual_review,
      review_reason: result.review_reason,
      model: usedDSModel ? 'ds-model' : `${process.env.LLM_PROVIDER}/${process.env.OPENAI_MODEL}`,
      timestamp: new Date().toISOString()
    };
    
    // Step 9: Log for monitoring
    const latency = Date.now() - startTime;
    console.log(`Triage completed for request ${request.request_id} in ${latency}ms`);
    
    return response;
    
  } catch (error) {
    console.error(`Triage failed for request ${request.request_id}:`, error);
    
    // Return safe fallback
    return {
      request_id: request.request_id,
      suggested_category: null,
      category_confidence: 0,
      suggested_priority: null,
      priority_confidence: 0,
      needs_manual_review: true,
      review_reason: `Automation failed: ${error.message}`,
      model: 'fallback',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Validate input request
 */
function validateInput(request: TriageRequest): void {
  if (!request.request_id || !request.title || !request.description) {
    throw new Error('Missing required fields: request_id, title, description');
  }
  
  const minLength = parseInt(process.env.MIN_DESCRIPTION_LENGTH || '10');
  const maxLength = parseInt(process.env.MAX_DESCRIPTION_LENGTH || '5000');
  
  if (request.description.length < minLength) {
    throw new Error(`Description too short (min ${minLength} characters)`);
  }
  
  if (request.description.length > maxLength) {
    throw new Error(`Description too long (max ${maxLength} characters)`);
  }
}

/**
 * Check for sensitive content (simplified)
 * TODO: Implement more sophisticated PII/sensitive content detection
 */
function checkSensitiveContent(request: TriageRequest): boolean {
  const sensitiveKeywords = [
    'termination', 'fired', 'layoff',
    'harassment', 'discrimination', 'lawsuit',
    'confidential', 'legal', 'attorney'
  ];
  
  const text = `${request.title} ${request.description}`.toLowerCase();
  return sensitiveKeywords.some(keyword => text.includes(keyword));
}

/**
 * Try DS model for prediction
 */
async function tryDSModel(request: TriageRequest): Promise<LLMPrediction | null> {
  try {
    const dsApiUrl = process.env.DS_MODEL_API_URL;
    if (!dsApiUrl) return null;
    
    const response = await axios.post(
      `${dsApiUrl}/predict`,
      {
        title: request.title,
        description: request.description
      },
      {
        timeout: 2000 // 2 second timeout
      }
    );
    
    return {
      category: response.data.predicted_category,
      category_confidence: response.data.category_confidence,
      priority: response.data.predicted_priority,
      priority_confidence: response.data.priority_confidence,
      reasoning: 'DS Model prediction'
    };
    
  } catch (error) {
    console.warn('DS Model unavailable, falling back to LLM:', error.message);
    return null;
  }
}

// Export for use in API server
export default { triageRequest };
