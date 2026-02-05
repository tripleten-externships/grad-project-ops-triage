/**
 * Shared Utility Functions
 * Common helpers used across frontend and backend
 */

/**
 * Format ISO date string to human-readable format
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(isoString);
}

/**
 * Validate Request ID format (REQ-XXXXXX)
 */
export function isValidRequestId(id: string): boolean {
  return /^REQ-\d{6}$/.test(id);
}

/**
 * Generate a new Request ID
 */
export function generateRequestId(sequence: number): string {
  return `REQ-${String(sequence).padStart(6, '0')}`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Calculate SLA time remaining in hours
 * TODO: Implement based on priority and business rules
 */
export function calculateSlaRemaining(
  createdAt: string,
  priority: string
): number {
  // Placeholder implementation
  // Students should implement based on priority-definitions.md
  const slaHours: Record<string, number> = {
    P0: 4,
    P1: 24,
    P2: 72,
    P3: 168,
  };

  const created = new Date(createdAt);
  const now = new Date();
  const elapsedHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  const targetHours = slaHours[priority] || 168;

  return Math.max(0, targetHours - elapsedHours);
}
