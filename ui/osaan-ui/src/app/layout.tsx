import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { I18nProvider } from '@/providers/i18n-provider';
import { SessionProvider } from '@/providers/session-provider';

export const metadata: Metadata = {
  title: 'Osaan - Competence Management',
  description: 'Manage your skills and competence profiles',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <I18nProvider>
            <QueryProvider>{children}</QueryProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
