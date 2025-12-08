'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = i18n.language || 'fi';
  const currentFlag = currentLanguage.startsWith('en') ? '🇬🇧' : '🇫🇮';

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-2xl">{currentFlag}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => changeLanguage('fi')}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl" role="img" aria-label="Finnish">
                  🇫🇮
                </span>
                <span>{t('fi')}</span>
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl" role="img" aria-label="English">
                  🇬🇧
                </span>
                <span>{t('en')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
