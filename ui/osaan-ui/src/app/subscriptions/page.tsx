'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/app-shell';
import {
  SubscriptionComposer,
  SubscriptionsLedger,
} from '@/components/subscriptions';
import { useAppSession } from '@/hooks/use-app-session';
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscriptions,
} from '@/hooks/use-subscriptions';
import type { SubscriptionDraft } from '@/types/subscription';

export const dynamic = 'force-dynamic';

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const { userEmail } = useAppSession();
  const subscriptionsQuery = useSubscriptions();
  const createMutation = useCreateSubscription();
  const deleteMutation = useDeleteSubscription();
  const [toast, setToast] = useState<{ kind: 'created' | 'removed' | 'error'; skill: string } | null>(null);

  const subscriptions = subscriptionsQuery.data ?? [];
  const hydrated = subscriptionsQuery.isSuccess || subscriptionsQuery.isError;
  const count = subscriptions.length;

  const showToast = (kind: 'created' | 'removed' | 'error', skill: string, ms = 3200) => {
    setToast({ kind, skill });
    window.setTimeout(() => setToast(null), ms);
  };

  const handleCreate = (draft: SubscriptionDraft) => {
    createMutation.mutate(draft, {
      onSuccess: () => showToast('created', draft.skill),
      onError: () => showToast('error', draft.skill),
    });
  };

  const handleRemove = (id: string) => {
    const found = subscriptions.find((s) => s.id === id);
    if (!found) return;
    deleteMutation.mutate(id, {
      onSuccess: () => showToast('removed', found.skill, 2800),
      onError: () => showToast('error', found.skill),
    });
  };

  return (
    <AppShell>
      {/* Editorial hero */}
      <header className="relative mb-12 sm:mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-saffron-700">
            {t('subscriptionsKicker', { defaultValue: 'Standing Watch' })}
          </span>
          <span className="flex-1 h-px bg-stone-200 max-w-[200px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-12 gap-y-6 items-end">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-950 leading-[1.02] tracking-tight text-balance">
              {t('subscriptionsTitle', { defaultValue: 'Watch the wires.' })}
              <span className="block font-display italic text-stone-500 font-normal mt-1.5 sm:mt-2">
                {t('subscriptionsTitleItalic', {
                  defaultValue: "We'll write when talent arrives.",
                })}
              </span>
            </h1>
            <p className="mt-6 sm:mt-7 text-base text-stone-600 font-sans leading-relaxed max-w-xl">
              {t('subscriptionsSubtitle', {
                defaultValue:
                  'Open a watch on any skill and proficiency. The moment a matching competence profile is published, a dispatch lands in the inbox you choose.',
              })}
            </p>
          </div>

          {/* Live counter */}
          <div className="relative bg-white border border-stone-200 rounded-md px-6 py-5 min-w-[180px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400 mb-2">
              {t('subscriptionsActive', { defaultValue: 'Active watches' })}
            </p>
            <p className="font-display text-5xl font-semibold text-stone-950 tabular-nums leading-none">
              {hydrated ? String(count).padStart(2, '0') : '—'}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 pulse-dot" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-[11px] text-stone-500 font-sans italic">
                {count === 0
                  ? t('subscriptionsListening', { defaultValue: 'listening for orders' })
                  : t('subscriptionsLive', { defaultValue: 'wire is live' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className="mb-6 flex items-center gap-3 px-4 py-3 rounded-md text-sm font-sans border"
          style={
            toast.kind === 'created'
              ? {
                  background: 'var(--accent-subtle)',
                  borderColor: 'var(--accent-bg)',
                  color: 'var(--accent)',
                }
              : toast.kind === 'error'
              ? {
                  background: 'var(--error-subtle, #fef2f2)',
                  borderColor: 'var(--error, #dc2626)',
                  color: 'var(--error, #dc2626)',
                }
              : {
                  background: 'var(--background)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }
          }
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {toast.kind === 'error' ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </svg>
          <span className="font-medium">
            {toast.kind === 'created'
              ? t('toastCreated', {
                  defaultValue: 'Watch opened on {{skill}}.',
                  skill: toast.skill,
                })
              : toast.kind === 'removed'
              ? t('toastRemoved', {
                  defaultValue: 'Watch on {{skill}} closed.',
                  skill: toast.skill,
                })
              : t('toastError', {
                  defaultValue: 'Could not update watch on {{skill}}. Please try again.',
                  skill: toast.skill,
                })}
          </span>
        </div>
      )}

      {/* Composer */}
      <section aria-labelledby="composer-heading" className="mb-14 sm:mb-16">
        <h2 id="composer-heading" className="sr-only">
          {t('composerHeading', { defaultValue: 'New subscription' })}
        </h2>
        <SubscriptionComposer
          recipientEmail={userEmail ?? undefined}
          onCreate={handleCreate}
          submitting={createMutation.isPending}
        />
      </section>

      {/* Ledger */}
      <section aria-labelledby="ledger-heading">
        <div className="flex items-baseline gap-3 mb-5 sm:mb-6">
          <h2
            id="ledger-heading"
            className="font-display text-xl sm:text-2xl font-semibold text-stone-950 tracking-tight"
          >
            {t('ledgerHeading', { defaultValue: 'Open watches' })}
          </h2>
          <span className="font-mono text-sm text-stone-400 tabular-nums">
            {hydrated ? String(count).padStart(2, '0') : '—'}
          </span>
          <span className="flex-1 h-px bg-stone-200" />
        </div>

        {subscriptionsQuery.isLoading ? (
          <div className="h-32" aria-hidden />
        ) : subscriptionsQuery.isError ? (
          <div className="relative bg-white border border-stone-200 border-dashed rounded-md p-8 text-center">
            <p className="text-sm text-stone-600 font-sans">
              {t('ledgerLoadError', {
                defaultValue: 'Could not load your watches. Please retry.',
              })}
            </p>
          </div>
        ) : (
          <SubscriptionsLedger
            subscriptions={subscriptions}
            onRemove={handleRemove}
          />
        )}
      </section>
    </AppShell>
  );
}
