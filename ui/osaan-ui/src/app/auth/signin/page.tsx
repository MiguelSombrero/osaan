'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-semibold text-stone-950">Osaan</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-[0_4px_16px_rgba(26,23,20,0.07)]">
          <h1 className="font-display text-xl font-semibold text-stone-950 mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-stone-600 font-sans mb-7">
            Sign in to access your competence profile
          </p>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => signIn('keycloak', { callbackUrl })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign in with Keycloak
          </Button>
        </div>

        <p className="mt-6 text-xs text-center text-stone-400 font-sans">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <span className="font-sans text-sm text-stone-500">Loading…</span>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
