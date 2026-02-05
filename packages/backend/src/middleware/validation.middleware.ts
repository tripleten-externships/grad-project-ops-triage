import { Request, Response, NextFunction } from 'express';
import { 
  validateRequestCreate, 
  validateRequestUpdate,
  safeValidateRequestCreate,
  safeValidateRequestUpdate
} from '@shared/validators';

/**
 * Request Validation Middleware
 * Uses Zod schemas from shared package
 */

export function validateRequest(type: 'create' | 'update') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (type === 'create') {
        const result = safeValidateRequestCreate(req.body);
        if (!result.success) {
          return res.status(400).json({
            error: 'Validation Error',
            details: result.error.issues
          });
        }
        req.body = result.data; // Use validated data
      } else if (type === 'update') {
        const result = safeValidateRequestUpdate({
          ...req.body,
          id: req.params.id
        });
        if (!result.success) {
          return res.status(400).json({
            error: 'Validation Error',
            details: result.error.issues
          });
        }
        req.body = result.data;
      }
      
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid request data'
      });
    }
  };
}

// Custom validation functions
export function validatePriority(req: Request, res: Response, next: NextFunction) {
  const { priority } = req.body;
  const validPriorities = ['P0', 'P1', 'P2', 'P3'];
  
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority',
      message: `Priority must be one of: ${validPriorities.join(', ')}`
    });
  }
  
  next();
}

export function validateStatus(req: Request, res: Response, next: NextFunction) {
  const { status } = req.body;
  const validStatuses = ['new', 'triaged', 'in_progress', 'waiting', 'resolved', 'closed'];
  
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      message: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }
  
  next();
}

// TODO: Add more specific validators
// TODO: Add sanitization middleware
// TODO: Add file upload validation
