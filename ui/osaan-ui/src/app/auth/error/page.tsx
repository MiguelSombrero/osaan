'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification:
      'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const message = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="space-y-3">
              <Link
                href="/api/auth/signin"
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Go to Home
              </Link>
            </div>
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
