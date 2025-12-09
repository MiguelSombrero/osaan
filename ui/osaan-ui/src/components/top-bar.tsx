'use client';

import { useTranslation } from 'react-i18next';
import { useSession, signIn, signOut } from 'next-auth/react';
import LanguageSelector from './language-selector';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  const handleAuthAction = () => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900"
              suppressHydrationWarning
            >
              {title || t('competenceManagement')}
            </h1>
            {subtitle && (
              <p className="mt-2 text-gray-600" suppressHydrationWarning>
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {status !== 'loading' && (
              <button
                onClick={handleAuthAction}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                suppressHydrationWarning
              >
                {session ? t('logout') : t('login')}
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
