'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';

// This page is only reached when the middleware redirects an unauthenticated
// user from a protected route. It auto-triggers Keycloak sign-in immediately
// with no visible UI, so there is no intermediary page.
function AutoSignIn() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/competences';

  useEffect(() => {
    signIn('keycloak', { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-block h-6 w-6 rounded-full border-2 border-stone-300 border-t-saffron-600 animate-spin" />
        <p className="text-sm text-stone-500 font-sans" suppressHydrationWarning>{t('redirecting')}</p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <span className="inline-block h-6 w-6 rounded-full border-2 border-stone-300 border-t-saffron-600 animate-spin" />
        </div>
      }
    >
      <AutoSignIn />
    </Suspense>
  );
}
