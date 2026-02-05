/**
 * Frontend-specific types
 * Import shared types and add UI-specific types
 */

export type {
  Request,
  RequestCreate,
  RequestUpdate,
  Category,
  Priority,
  Status,
  RequesterType,
  Channel,
  ResolutionCode,
} from '@shared/types';

// UI-specific types
export interface FilterOptions {
  status?: string[];
  priority?: string[];
  category?: string[];
  assigned_to?: string;
}

export interface SortOptions {
  field: keyof Request;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

// TODO: Add component prop types
// TODO: Add form state types
// TODO: Add error types
