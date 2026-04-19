'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { NavBar } from '@/components/layout/nav-bar';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session;
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <NavBar />

      {/* Hero */}
      <main className="flex-1">
        <section className="py-20 sm:py-28">
          <Container>
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-stone-950 leading-[1.1] tracking-tight" suppressHydrationWarning>
                {t('heroTitleLine1')}<br />{t('heroTitleLine2')}
              </h1>
              <p className="mt-6 text-lg text-stone-600 font-sans leading-relaxed max-w-xl" suppressHydrationWarning>
                {t('heroSubtitle')}
              </p>

              <div className="mt-8">
                {isAuthenticated ? (
                  <Link
                    href="/competences"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-saffron-600 text-white font-medium font-sans text-sm hover:bg-saffron-700 transition-colors"
                    suppressHydrationWarning
                  >
                    {t('heroCta')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    onClick={() => signIn('keycloak', { callbackUrl: '/competences' })}
                    leftIcon={
                      !isLoading && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                      )
                    }
                    suppressHydrationWarning
                  >
                    {t('signInButton')}
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className="border-t border-stone-200 py-16">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-stone-200 rounded-md overflow-hidden">
              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
                title={t('featureProfileTitle')}
                description={t('featureProfileDesc')}
              />
              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
                title={t('featureFindTitle')}
                description={t('featureFindDesc')}
              />
              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                }
                title={t('featureGrowTitle')}
                description={t('featureGrowDesc')}
              />
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-6">
        <Container>
          <p className="text-sm text-stone-400 font-sans" suppressHydrationWarning>
            Osaan — {t('competenceManagement')}
          </p>
        </Container>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 sm:p-8">
      <div className="text-saffron-600 mb-4">{icon}</div>
      <h3 className="font-display text-base font-semibold text-stone-950 mb-2" suppressHydrationWarning>{title}</h3>
      <p className="text-sm text-stone-600 font-sans leading-relaxed" suppressHydrationWarning>{description}</p>
    </div>
  );
}
