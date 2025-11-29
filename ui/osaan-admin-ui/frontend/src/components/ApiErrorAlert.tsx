import { Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../api/errors';

interface ApiErrorAlertProps {
  error: ApiError | null;
  onClose?: () => void;
}

export function ApiErrorAlert({ error, onClose }: ApiErrorAlertProps) {
  const { t } = useTranslation();

  if (!error) return null;

  const severity = error.isServerError ? 'error' : 'warning';

  return (
    <Alert severity={severity} onClose={onClose} sx={{ mb: 2 }}>
      <AlertTitle>{error.problem.title}</AlertTitle>
      {error.problem.detail || t('error.generic')}
    </Alert>
  );
}
