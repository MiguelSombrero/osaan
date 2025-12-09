'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="px-4 py-2 text-sm text-gray-600">Loading...</div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn('keycloak')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {session.user?.name || 'User'}
        </div>
        <div className="text-gray-500">{session.user?.email}</div>
      </div>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
