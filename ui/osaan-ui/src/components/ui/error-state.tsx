'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="mb-4 text-error">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="font-display text-lg font-medium text-stone-800" suppressHydrationWarning>
        {title ?? t('somethingWentWrong')}
      </p>
      {message && (
        <p className="mt-1.5 text-sm text-stone-600 max-w-xs">{message}</p>
      )}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onRetry} suppressHydrationWarning>
            {t('retryAction')}
          </Button>
        </div>
      )}
    </div>
  );
}

export { ErrorState };
export type { ErrorStateProps };
