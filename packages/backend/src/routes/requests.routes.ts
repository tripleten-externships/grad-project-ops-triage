import { Router } from 'express';
import * as requestController from '../controllers/requests.controller';
// import { validateRequest } from '../middleware/validation.middleware';
// import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Request CRUD Routes
 * Following the API contract in contracts/schemas/api-contract.yml
 */

// GET /api/requests - List all requests with optional filters
router.get('/', requestController.getRequests);

// POST /api/requests - Create new request
router.post('/', 
  // validateRequest('create'), // TODO: Implement validation middleware
  requestController.createRequest
);

// GET /api/requests/:id - Get request by ID
router.get('/:id', requestController.getRequestById);

// PATCH /api/requests/:id - Update request
router.patch('/:id',
  // validateRequest('update'), // TODO: Implement validation middleware
  requestController.updateRequest
);

// DELETE /api/requests/:id - Delete request
router.delete('/:id', requestController.deleteRequest);

// TODO: Add authentication middleware to protected routes
// TODO: Add authorization checks (role-based access)

export default router;
