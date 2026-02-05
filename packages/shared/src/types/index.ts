/**
 * Shared Types
 * Re-exports types from contracts for use in frontend and backend
 */

export type {
  Request,
  RequestCreate,
  RequestUpdate,
  RequestId,
  Category,
  Priority,
  Status,
  RequesterType,
  Channel,
  ResolutionCode,
} from '../../../../contracts/schemas/request.schema';

// TODO: Add User types when user.schema.ts is available
// export type { User, UserId, UserRole } from '../../../../contracts/schemas/user.schema';
