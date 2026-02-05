import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../../hooks/useRequests';
import { formatRelativeTime } from '@shared/utils';
import { PRIORITY_LABELS, STATUS_LABELS } from '@shared/constants';

/**
 * US-02: Triage Queue View
 * Displays list of support requests for agents to triage and manage
 */
function TriagePage() {
  const { requests, loading, error, fetchRequests } = useRequests();

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading requests...</div>;
  }

  if (error) {
    return <div className="error">Error loading requests: {error}</div>;
  }

  // TODO: Add filtering by status, priority, category
  // TODO: Add sorting options
  // TODO: Add search functionality
  // TODO: Add bulk actions
  // TODO: Add pagination

  return (
    <div className="triage-page">
      <div className="page-header">
        <h2>Triage Queue</h2>
        <div className="actions">
          {/* TODO: Add filter controls */}
          {/* TODO: Add sort controls */}
        </div>
      </div>

      <div className="request-list">
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <table className="request-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <Link to={`/request/${request.id}`}>{request.id}</Link>
                  </td>
                  <td>{request.title}</td>
                  <td>{request.category}</td>
                  <td className={`priority-${request.priority}`}>
                    {PRIORITY_LABELS[request.priority]}
                  </td>
                  <td className={`status-${request.status}`}>
                    {STATUS_LABELS[request.status]}
                  </td>
                  <td>{formatRelativeTime(request.created_at)}</td>
                  <td>{request.assigned_to || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* TODO: Implement queue statistics */}
      {/* TODO: Add SLA indicators */}
    </div>
  );
}

export default TriagePage;
