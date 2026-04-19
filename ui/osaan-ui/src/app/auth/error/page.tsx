'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

function AuthErrorContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessageKey: Record<string, string> = {
    Configuration: 'authErrorConfiguration',
    AccessDenied: 'authErrorAccessDenied',
    Verification: 'authErrorVerification',
    Default: 'authErrorDefault',
  };

  const messageKey = error ? (errorMessageKey[error] ?? 'authErrorDefault') : 'authErrorDefault';

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-semibold text-stone-950">Osaan</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-[0_4px_16px_rgba(26,23,20,0.07)]">
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-error-light">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b2335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>

          <h1 className="font-display text-xl font-semibold text-stone-950 mb-2 text-center" suppressHydrationWarning>
            {t('authError')}
          </h1>
          <p className="text-sm text-stone-600 font-sans mb-7 text-center" suppressHydrationWarning>
            {t(messageKey)}
          </p>

          <div className="space-y-2.5">
            <Link href="/api/auth/signin" className="block">
              <Button variant="primary" size="lg" className="w-full" suppressHydrationWarning>
                {t('tryAgain')}
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="secondary" size="lg" className="w-full" suppressHydrationWarning>
                {t('backToHome')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <span className="inline-block h-6 w-6 rounded-full border-2 border-stone-300 border-t-saffron-600 animate-spin" />
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
