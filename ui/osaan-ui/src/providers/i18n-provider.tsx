'use client';

import { useEffect } from 'react';
import '@/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is already initialized in @/i18n
    // This component just ensures it's loaded before rendering children
  }, []);

  return <>{children}</>;
}
