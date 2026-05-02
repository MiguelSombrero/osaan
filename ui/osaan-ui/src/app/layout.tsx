import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { I18nProvider } from '@/providers/i18n-provider';
import { SessionProvider } from '@/providers/session-provider';

const fraunces = localFont({
  src: [
    { path: './fonts/fraunces.woff2', weight: '400 700', style: 'normal' },
    { path: './fonts/fraunces-italic.woff2', weight: '400 700', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = localFont({
  src: [{ path: './fonts/dm-sans.woff2', weight: '300 500', style: 'normal' }],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = localFont({
  src: [
    { path: './fonts/dm-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Osaan — Competence Management',
  description: 'Browse skills, build your competence profile, and find the right people.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <SessionProvider>
          <I18nProvider>
            <QueryProvider>{children}</QueryProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
