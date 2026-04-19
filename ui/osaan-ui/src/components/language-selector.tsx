'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = i18n.language || 'fi';
  const currentFlag = currentLanguage.startsWith('en') ? '🇬🇧' : '🇫🇮';
  const currentCode = currentLanguage.startsWith('en') ? 'EN' : 'FI';

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium font-sans',
          'text-stone-600 hover:text-stone-950 hover:bg-stone-100',
          'transition-colors duration-150 border border-transparent',
          isOpen && 'bg-stone-100 text-stone-950'
        )}
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">{currentFlag}</span>
        <span>{currentCode}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-md border border-stone-200 shadow-[0_4px_16px_rgba(26,23,20,0.10)] z-20 overflow-hidden">
            <button
              onClick={() => changeLanguage('fi')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-sans',
                'text-stone-700 hover:bg-stone-50 transition-colors',
                currentLanguage.startsWith('fi') && 'bg-saffron-50 text-stone-950 font-medium'
              )}
            >
              <span aria-label="Finnish">🇫🇮</span>
              <span>{t('fi')}</span>
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-sans',
                'text-stone-700 hover:bg-stone-50 transition-colors',
                currentLanguage.startsWith('en') && 'bg-saffron-50 text-stone-950 font-medium'
              )}
            >
              <span aria-label="English">🇬🇧</span>
              <span>{t('en')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
