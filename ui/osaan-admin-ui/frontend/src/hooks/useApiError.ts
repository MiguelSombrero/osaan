import { useState, useCallback } from 'react';
import { ApiError, parseApiError } from '../api/errors';

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((err: unknown) => {
    const apiError = parseApiError(err);
    setError(apiError);

    // Auto-clear after 10 seconds for non-critical errors
    if (!apiError.isServerError) {
      setTimeout(() => setError(null), 10000);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
