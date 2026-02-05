/**
 * TypeScript types for Support Request schema
 * Auto-generated from request.schema.json
 */

export type RequestId = string; // Pattern: REQ-XXXXXX

export type Category = 'technical' | 'account' | 'billing' | 'general';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type Status =
  | 'new'
  | 'triaged'
  | 'in_progress'
  | 'waiting'
  | 'resolved'
  | 'closed';

export type RequesterType = 'free' | 'paid' | 'enterprise' | 'internal';

export type Channel = 'email' | 'chat' | 'phone' | 'web_form' | 'api';

export type ResolutionCode =
  | 'solved'
  | 'workaround'
  | 'duplicate'
  | 'wont_fix'
  | 'spam'
  | null;

/**
 * Support Request/Ticket object
 */
export interface Request {
  /** Unique identifier (e.g., REQ-000001) */
  id: RequestId;

  /** Short summary of the request (5-200 chars) */
  title: string;

  /** Detailed description (10-5000 chars) */
  description: string;

  /** Category of the support request */
  category: Category;

  /** Priority level (P0=Critical, P1=High, P2=Medium, P3=Low) */
  priority: Priority;

  /** Current status */
  status: Status;

  /** Type of user submitting the request */
  requester_type: RequesterType;

  /** Channel through which request was submitted */
  channel: Channel;

  /** Timestamp when created (ISO 8601) */
  created_at: string;

  /** Timestamp when last updated (ISO 8601) */
  updated_at?: string;

  /** ID of assigned agent */
  assigned_to?: string | null;

  /** Resolution code if resolved/closed */
  resolution_code?: ResolutionCode;

  /** Tags for categorization */
  tags?: string[];
}

/**
 * Partial request for updates (all fields optional except id)
 */
export type RequestUpdate = Partial<Omit<Request, 'id' | 'created_at'>> & {
  id: RequestId;
};

/**
 * Request creation payload (no id, created_at, or updated_at)
 */
export type RequestCreate = Omit<Request, 'id' | 'created_at' | 'updated_at'>;
