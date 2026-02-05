/**
 * Shared Validation Functions
 * Using Zod schemas to validate data structures
 */

import { z } from 'zod';

// Zod schemas based on contract definitions
const CategorySchema = z.enum(['technical', 'account', 'billing', 'general']);
const PrioritySchema = z.enum(['P0', 'P1', 'P2', 'P3']);
const StatusSchema = z.enum([
  'new',
  'triaged',
  'in_progress',
  'waiting',
  'resolved',
  'closed',
]);
const RequesterTypeSchema = z.enum(['free', 'paid', 'enterprise', 'internal']);
const ChannelSchema = z.enum(['email', 'chat', 'phone', 'web_form', 'api']);
const ResolutionCodeSchema = z
  .enum(['solved', 'workaround', 'duplicate', 'wont_fix', 'spam'])
  .nullable();

export const RequestSchema = z.object({
  id: z.string().regex(/^REQ-\d{6}$/),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  category: CategorySchema,
  priority: PrioritySchema,
  status: StatusSchema,
  requester_type: RequesterTypeSchema,
  channel: ChannelSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  assigned_to: z.string().nullable().optional(),
  resolution_code: ResolutionCodeSchema.optional(),
  tags: z.array(z.string()).optional(),
});

export const RequestCreateSchema = RequestSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const RequestUpdateSchema = RequestSchema.partial().required({
  id: true,
});

// Validation functions
export function validateRequest(data: unknown) {
  return RequestSchema.parse(data);
}

export function validateRequestCreate(data: unknown) {
  return RequestCreateSchema.parse(data);
}

export function validateRequestUpdate(data: unknown) {
  return RequestUpdateSchema.parse(data);
}

// Safe validation (returns success/error instead of throwing)
export function safeValidateRequest(data: unknown) {
  return RequestSchema.safeParse(data);
}

export function safeValidateRequestCreate(data: unknown) {
  return RequestCreateSchema.safeParse(data);
}

export function safeValidateRequestUpdate(data: unknown) {
  return RequestUpdateSchema.safeParse(data);
}
