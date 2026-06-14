'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/language-selector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useAppSession } from '@/hooks/use-app-session';

interface NavLink {
  href: string;
  label: string;
}

function NavBar() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, isManager, signIn, signOut } = useAppSession();
  const pathname = usePathname();

  const links: NavLink[] = [
    { href: '/competences', label: t('mySkills') },
    ...(isManager
      ? [
          { href: '/manager', label: t('findTalent') },
          { href: '/subscriptions', label: t('subscriptions') },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-[var(--page-x)]">
        <div className="flex h-14 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-semibold text-stone-950 hover:text-saffron-600 transition-colors shrink-0"
          >
            Osaan
          </Link>

          {/* Nav links */}
          {isAuthenticated && (
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium font-sans transition-colors duration-150',
                    pathname === link.href
                      ? 'bg-stone-100 text-stone-950'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <LanguageSelector />
            {!isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (isAuthenticated ? signOut() : signIn())}
                suppressHydrationWarning
              >
                {isAuthenticated ? t('logout') : t('login')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export { NavBar };
