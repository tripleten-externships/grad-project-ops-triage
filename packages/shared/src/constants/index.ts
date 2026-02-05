/**
 * Shared Constants
 * Constants used across frontend and backend
 */

// Status values
export const STATUS_VALUES = [
  'new',
  'triaged',
  'in_progress',
  'waiting',
  'resolved',
  'closed',
] as const;

// Priority values (P0 = Critical, P1 = High, P2 = Medium, P3 = Low)
export const PRIORITY_VALUES = ['P0', 'P1', 'P2', 'P3'] as const;

// Category values
export const CATEGORY_VALUES = [
  'technical',
  'account',
  'billing',
  'general',
] as const;

// Requester type values
export const REQUESTER_TYPE_VALUES = [
  'free',
  'paid',
  'enterprise',
  'internal',
] as const;

// Channel values
export const CHANNEL_VALUES = [
  'email',
  'chat',
  'phone',
  'web_form',
  'api',
] as const;

// Resolution code values
export const RESOLUTION_CODE_VALUES = [
  'solved',
  'workaround',
  'duplicate',
  'wont_fix',
  'spam',
] as const;

// Human-readable labels
export const PRIORITY_LABELS: Record<string, string> = {
  P0: 'Critical',
  P1: 'High',
  P2: 'Medium',
  P3: 'Low',
};

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  triaged: 'Triaged',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical',
  account: 'Account',
  billing: 'Billing',
  general: 'General',
};
