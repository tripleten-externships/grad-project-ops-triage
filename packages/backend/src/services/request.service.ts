import RequestModel from '../models/Request';
import type { Request as IRequest, RequestCreate } from '@shared/types';
import { generateRequestId } from '@shared/utils';

/**
 * Request Service
 * Business logic for request operations
 */

interface RequestFilters {
  status?: string;
  priority?: string;
  category?: string;
  assigned_to?: string;
}

export async function getAllRequests(filters: RequestFilters = {}) {
  // Build query from filters
  const query: any = {};
  
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;
  if (filters.assigned_to) query.assigned_to = filters.assigned_to;
  
  // TODO: Add pagination
  // TODO: Add sorting options
  
  return await RequestModel.find(query).lean();
}

export async function getRequestById(id: string) {
  return await RequestModel.findOne({ id }).lean();
}

export async function createRequest(data: RequestCreate) {
  // Generate new request ID
  const count = await RequestModel.countDocuments();
  const id = generateRequestId(count + 1);
  
  const requestData = {
    ...data,
    id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // TODO: Validate data with Zod schema
  // TODO: Apply business rules (e.g., auto-assign priority based on category)
  // TODO: Emit webhook event
  
  const request = new RequestModel(requestData);
  await request.save();
  
  return request.toObject();
}

export async function updateRequest(id: string, updates: Partial<IRequest>) {
  // Don't allow updating id or created_at
  const { id: _, created_at, ...validUpdates } = updates as any;
  
  validUpdates.updated_at = new Date().toISOString();
  
  // TODO: Validate updates
  // TODO: Apply business rules (e.g., status transitions)
  // TODO: Emit webhook event
  
  const updated = await RequestModel.findOneAndUpdate(
    { id },
    { $set: validUpdates },
    { new: true, runValidators: true }
  ).lean();
  
  return updated;
}

export async function deleteRequest(id: string) {
  const result = await RequestModel.deleteOne({ id });
  return result.deletedCount > 0;
}

// TODO: Add more service functions:
// - assignRequest(id, agentId)
// - updatePriority(id, priority)
// - addComment(id, comment)
// - getRequestHistory(id)
