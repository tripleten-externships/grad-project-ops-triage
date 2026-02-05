import axios from 'axios';

/**
 * Webhook Service
 * Emits events to configured webhook endpoints
 * Following contracts/schemas/event-contract.yml
 */

interface WebhookEvent {
  event_type: string;
  event_id: string;
  timestamp: string;
  data: any;
}

export async function emitWebhookEvent(eventType: string, data: any) {
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhooksEnabled = process.env.ENABLE_WEBHOOKS === 'true';

  if (!webhooksEnabled || !webhookUrl) {
    console.log('Webhooks disabled or URL not configured');
    return;
  }

  const event: WebhookEvent = {
    event_type: eventType,
    event_id: generateEventId(),
    timestamp: new Date().toISOString(),
    data,
  };

  try {
    await axios.post(webhookUrl, event, {
      headers: {
        'Content-Type': 'application/json',
        'X-Event-Type': eventType,
      },
    });

    console.log(`Webhook event sent: ${eventType}`);
  } catch (error) {
    console.error('Failed to send webhook event:', error);
    // TODO: Implement retry logic
    // TODO: Store failed events for later retry
  }
}

// Event type constants (from event-contract.yml)
export const WebhookEvents = {
  REQUEST_CREATED: 'request.created',
  REQUEST_UPDATED: 'request.updated',
  REQUEST_ASSIGNED: 'request.assigned',
  REQUEST_PRIORITY_CHANGED: 'request.priority_changed',
  REQUEST_STATUS_CHANGED: 'request.status_changed',
  REQUEST_RESOLVED: 'request.resolved',
  REQUEST_CLOSED: 'request.closed',
} as const;

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper functions for common events
export async function emitRequestCreated(request: any) {
  await emitWebhookEvent(WebhookEvents.REQUEST_CREATED, { request });
}

export async function emitRequestUpdated(request: any, changes: any) {
  await emitWebhookEvent(WebhookEvents.REQUEST_UPDATED, {
    request,
    changes,
  });
}

export async function emitRequestAssigned(request: any, agentId: string) {
  await emitWebhookEvent(WebhookEvents.REQUEST_ASSIGNED, {
    request,
    agent_id: agentId,
  });
}

export async function emitPriorityChanged(
  request: any,
  oldPriority: string,
  newPriority: string
) {
  await emitWebhookEvent(WebhookEvents.REQUEST_PRIORITY_CHANGED, {
    request,
    old_priority: oldPriority,
    new_priority: newPriority,
  });
}

// TODO: Add more event emitters as needed
// TODO: Implement webhook subscription management
// TODO: Add webhook signature verification
