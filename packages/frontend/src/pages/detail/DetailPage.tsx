import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Request } from '@shared/types';
import { formatDate } from '@shared/utils';
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  CATEGORY_LABELS,
} from '@shared/constants';

/**
 * Request Detail View
 * Shows detailed information about a specific request
 */
function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, _setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // TODO: Fetch request details from API
    // TODO: Handle loading and error states

    console.log('Fetching request:', id);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading request details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  // TODO: Implement update functionality
  // TODO: Add comment/note system
  // TODO: Add activity timeline
  // TODO: Add assignment controls
  // TODO: Add status transition controls

  return (
    <div className="detail-page">
      <div className="page-header">
        <button onClick={() => navigate('/triage')} className="btn-back">
          ← Back to Queue
        </button>
        <h2>Request Details: {request.id}</h2>
      </div>

      <div className="request-details">
        <div className="detail-section">
          <h3>Basic Information</h3>
          <dl>
            <dt>Title:</dt>
            <dd>{request.title}</dd>

            <dt>Description:</dt>
            <dd>{request.description}</dd>

            <dt>Category:</dt>
            <dd>{CATEGORY_LABELS[request.category]}</dd>

            <dt>Priority:</dt>
            <dd className={`priority-${request.priority}`}>
              {PRIORITY_LABELS[request.priority]}
            </dd>

            <dt>Status:</dt>
            <dd className={`status-${request.status}`}>
              {STATUS_LABELS[request.status]}
            </dd>
          </dl>
        </div>

        <div className="detail-section">
          <h3>Metadata</h3>
          <dl>
            <dt>Created:</dt>
            <dd>{formatDate(request.created_at)}</dd>

            {request.updated_at && (
              <>
                <dt>Updated:</dt>
                <dd>{formatDate(request.updated_at)}</dd>
              </>
            )}

            <dt>Channel:</dt>
            <dd>{request.channel}</dd>

            <dt>Requester Type:</dt>
            <dd>{request.requester_type}</dd>

            {request.assigned_to && (
              <>
                <dt>Assigned To:</dt>
                <dd>{request.assigned_to}</dd>
              </>
            )}

            {request.tags && request.tags.length > 0 && (
              <>
                <dt>Tags:</dt>
                <dd>{request.tags.join(', ')}</dd>
              </>
            )}
          </dl>
        </div>

        {/* TODO: Add edit controls */}
        {/* TODO: Add activity timeline */}
        {/* TODO: Add comments section */}
      </div>
    </div>
  );
}

export default DetailPage;
