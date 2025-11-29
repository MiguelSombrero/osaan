import { Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../api/errors';
import type { AlertSeverity } from '../types';

interface ApiErrorAlertProps {
  error: ApiError | null;
  onClose?: () => void;
}

/**
 * Maps error type URIs to i18n keys.
 * Backend sends machine-readable types, frontend shows localized messages.
 */
function getErrorMessageKey(error: ApiError): string {
  const type = error.problem.type;

  // Map known error types to i18n keys
  if (type?.includes('service-unavailable')) return 'error.serviceUnavailable';
  if (type?.includes('unauthorized')) return 'error.unauthorized';
  if (type?.includes('not-found')) return 'error.notFound';
  if (type?.includes('validation-error')) return 'error.validation';

  // Map by status code as fallback
  if (error.status === 0) return 'error.networkError';
  if (error.isServerError) return 'error.serverError';

  return 'error.generic';
}

export function ApiErrorAlert({ error, onClose }: ApiErrorAlertProps) {
  const { t } = useTranslation();

  if (!error) return null;

  const severity: AlertSeverity = error.isServerError ? 'error' : 'warning';
  const messageKey = getErrorMessageKey(error);

  return (
    <Alert severity={severity} onClose={onClose} sx={{ mb: 2 }}>
      <AlertTitle>{t(messageKey)}</AlertTitle>
    </Alert>
  );
}
