'use client';

import { useTranslation } from 'react-i18next';
import type { Subscription } from '@/types/subscription';
import { SubscriptionCard } from './subscription-card';

interface SubscriptionsLedgerProps {
  subscriptions: Subscription[];
  onRemove: (id: string) => void;
}

export function SubscriptionsLedger({
  subscriptions,
  onRemove,
}: SubscriptionsLedgerProps) {
  const { t } = useTranslation();

  if (subscriptions.length === 0) {
    return (
      <div className="relative bg-white border border-stone-200 border-dashed rounded-md p-12 text-center">
        <div
          aria-hidden
          className="mx-auto mb-5 w-12 h-12 rounded-full flex items-center justify-center text-saffron-700"
          style={{
            background:
              'radial-gradient(circle, var(--accent-subtle), transparent 70%)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <p className="font-display text-xl text-stone-800 mb-1.5 text-balance">
          {t('ledgerEmptyTitle', {
            defaultValue: 'The wire is quiet.',
          })}
        </p>
        <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed font-sans italic">
          {t('ledgerEmptyDesc', {
            defaultValue:
              'Open your first watch above. We will write to you the moment a matching profile arrives.',
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {subscriptions.map((subscription, index) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
