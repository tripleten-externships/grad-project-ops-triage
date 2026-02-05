/**
 * Validation and guardrail logic
 */

interface Prediction {
  category: string;
  category_confidence: number;
  priority: string;
  priority_confidence: number;
  reasoning: string;
  summary?: string;
  is_sensitive?: boolean;
}

interface GuardrailedResult extends Prediction {
  needs_manual_review?: boolean;
  review_reason?: string;
}

const VALID_CATEGORIES = ['IT Support', 'HR', 'Facilities', 'Finance', 'Other'];
const VALID_PRIORITIES = ['P0', 'P1', 'P2', 'P3'];

/**
 * Validate LLM prediction output
 */
export function validatePrediction(prediction: Prediction): Prediction {
  // Validate category
  if (!VALID_CATEGORIES.includes(prediction.category)) {
    console.warn(`Invalid category: ${prediction.category}, using 'Other'`);
    prediction.category = 'Other';
    prediction.category_confidence = Math.min(prediction.category_confidence, 0.3);
  }
  
  // Validate priority
  if (!VALID_PRIORITIES.includes(prediction.priority)) {
    console.warn(`Invalid priority: ${prediction.priority}, using 'P2'`);
    prediction.priority = 'P2';
    prediction.priority_confidence = Math.min(prediction.priority_confidence, 0.3);
  }
  
  // Validate confidence scores
  prediction.category_confidence = clamp(prediction.category_confidence, 0, 1);
  prediction.priority_confidence = clamp(prediction.priority_confidence, 0, 1);
  
  return prediction;
}

/**
 * Apply business rules and safety guardrails
 */
export function applyGuardrails(prediction: Prediction): GuardrailedResult {
  const result: GuardrailedResult = { ...prediction };
  
  // Rule 1: P0 requires manual review
  if (prediction.priority === 'P0') {
    result.needs_manual_review = true;
    result.review_reason = 'P0 priority requires human verification';
  }
  
  // Rule 2: Low confidence threshold
  const confThreshold = parseFloat(process.env.CATEGORY_CONFIDENCE_THRESHOLD || '0.6');
  if (
    prediction.category_confidence < confThreshold ||
    prediction.priority_confidence < confThreshold
  ) {
    result.needs_manual_review = true;
    result.review_reason = result.review_reason || 'Low confidence prediction';
  }
  
  // Rule 3: Sensitive content
  if (prediction.is_sensitive) {
    result.category = 'HR';  // Override category
    result.needs_manual_review = true;
    result.review_reason = 'Sensitive content detected';
  }
  
  // Rule 4: No reasoning provided
  if (!prediction.reasoning || prediction.reasoning.length < 10) {
    result.category_confidence *= 0.9;  // Reduce confidence
    result.priority_confidence *= 0.9;
  }
  
  // Rule 5: Unlikely combinations
  const unlikelyCombos = [
    { category: 'Facilities', priority: 'P0' },
    { category: 'Finance', priority: 'P0' }
  ];
  
  const isUnlikely = unlikelyCombos.some(
    combo => combo.category === prediction.category && combo.priority === prediction.priority
  );
  
  if (isUnlikely) {
    result.needs_manual_review = true;
    result.review_reason = result.review_reason || 'Unusual category-priority combination';
  }
  
  return result;
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Validate input against schema
 */
export function validateTriageInput(input: any): boolean {
  if (!input.request_id || typeof input.request_id !== 'string') {
    throw new Error('Missing or invalid request_id');
  }
  
  if (!input.title || typeof input.title !== 'string') {
    throw new Error('Missing or invalid title');
  }
  
  if (!input.description || typeof input.description !== 'string') {
    throw new Error('Missing or invalid description');
  }
  
  return true;
}
