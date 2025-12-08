'use client';

import { useTranslation } from 'react-i18next';
import LanguageSelector from './language-selector';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {title || t('competenceManagement')}
            </h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
