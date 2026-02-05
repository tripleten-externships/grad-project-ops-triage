import { useState, useCallback } from 'react';
import type { Request, RequestCreate } from '@shared/types';
import api from '../services/api';
import mockApi from '../services/mock-api';

// Determine which API to use based on environment
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
const apiClient = useMockApi ? mockApi : api;

/**
 * Custom hook for managing request data
 * Handles fetching, creating, updating, and deleting requests
 */
export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(
    async (params?: {
      status?: string;
      priority?: string;
      category?: string;
      assigned_to?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.getRequests(params);
        setRequests(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch requests'
        );
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createRequest = useCallback(async (data: RequestCreate) => {
    setLoading(true);
    setError(null);

    try {
      const newRequest = await apiClient.createRequest(data);
      setRequests((prev) => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
      console.error('Error creating request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequest = useCallback(
    async (id: string, data: Partial<Request>) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await apiClient.updateRequest(id, data);
        setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update request'
        );
        console.error('Error updating request:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteRequest = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete request');
      console.error('Error deleting request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
  };
}

// TODO: Create useRequest hook for single request
// TODO: Create useAnalytics hook for dashboard metrics
// TODO: Add caching/refetching logic
