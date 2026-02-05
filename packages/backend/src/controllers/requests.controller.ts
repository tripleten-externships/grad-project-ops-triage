import { Request, Response } from 'express';
import * as requestService from '../services/request.service';

/**
 * Request Controllers
 * Handle HTTP requests and delegate to service layer
 */

// GET /api/requests
export async function getRequests(req: Request, res: Response) {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      category: req.query.category as string | undefined,
      assigned_to: req.query.assigned_to as string | undefined
    };
    
    const requests = await requestService.getAllRequests(filters);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ 
      error: 'Failed to fetch requests',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET /api/requests/:id
export async function getRequestById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const request = await requestService.getRequestById(id);
    
    if (!request) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: `Request ${id} not found`
      });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ 
      error: 'Failed to fetch request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// POST /api/requests
export async function createRequest(req: Request, res: Response) {
  try {
    const requestData = req.body;
    
    // TODO: Validate request data using Zod schema
    // TODO: Emit webhook event for new request
    
    const newRequest = await requestService.createRequest(requestData);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(400).json({ 
      error: 'Failed to create request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// PATCH /api/requests/:id
export async function updateRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // TODO: Validate update data
    // TODO: Emit webhook event for updates
    
    const updatedRequest = await requestService.updateRequest(id, updates);
    
    if (!updatedRequest) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: `Request ${id} not found`
      });
    }
    
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(400).json({ 
      error: 'Failed to update request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// DELETE /api/requests/:id
export async function deleteRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await requestService.deleteRequest(id);
    
    if (!deleted) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: `Request ${id} not found`
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ 
      error: 'Failed to delete request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
