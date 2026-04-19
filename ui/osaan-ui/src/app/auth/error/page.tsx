'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : ERROR_MESSAGES.Default;

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

          <h1 className="font-display text-xl font-semibold text-stone-950 mb-2 text-center">
            Authentication Error
          </h1>
          <p className="text-sm text-stone-600 font-sans mb-7 text-center">{message}</p>

          <div className="space-y-2.5">
            <Link href="/api/auth/signin" className="block">
              <Button variant="primary" size="lg" className="w-full">
                Try again
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="secondary" size="lg" className="w-full">
                Back to home
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
          <span className="font-sans text-sm text-stone-500">Loading…</span>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
