'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import type { Subscription } from '@/types/subscription';
import type { Rating } from '@/types/rating';

interface SubscriptionCardProps {
  subscription: Subscription;
  index: number;
  onRemove: (id: string) => void;
}

function formatRelative(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (days >= 1) return rtf.format(-days, 'day');
  if (hours >= 1) return rtf.format(-hours, 'hour');
  if (minutes >= 1) return rtf.format(-minutes, 'minute');
  return rtf.format(0, 'second');
}

function shortId(id: string): string {
  return id.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase();
}

export function SubscriptionCard({
  subscription,
  index,
  onRemove,
}: SubscriptionCardProps) {
  const { t, i18n } = useTranslation();

  const ratingLabel = t(`rating${subscription.rating}`, {
    defaultValue: String(subscription.rating),
  });

  return (
    <article
      className={cn(
        'group relative bg-white rounded-md border border-stone-200',
        'transition-all duration-200 ease-out',
        'hover:border-saffron-200 hover:-translate-y-0.5',
        'watch-slip'
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Perforated left edge — ticket stub */}
      <div
        aria-hidden
        className="absolute top-3 bottom-3 left-3 w-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, var(--border) 0 4px, transparent 4px 8px)',
        }}
      />

      {/* Top bar: ID + live indicator + dismiss */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-dashed border-stone-200">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">
            {t('cardStanding', { defaultValue: 'Standing watch' })}
          </span>
          <span className="font-mono text-[10px] text-stone-300">•</span>
          <span className="font-mono text-[10px] text-stone-400 tabular-nums">
            #{shortId(subscription.id)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(subscription.id)}
          aria-label={t('cardDismiss', { defaultValue: 'Close watch' })}
          className={cn(
            'text-stone-300 hover:text-error transition-colors duration-150',
            'opacity-60 group-hover:opacity-100 focus-visible:opacity-100'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-sans mb-2">
          {t('cardWatchingSkill', { defaultValue: 'Skill on watch' })}
        </p>
        <h3 className="font-display text-2xl sm:text-[28px] font-semibold text-stone-950 leading-[1.1] tracking-tight text-balance">
          {subscription.skill}
        </h3>

        <div className="mt-5 flex items-center gap-3">
          <span className="flex items-center gap-1">
            {([1, 2, 3, 4, 5] as Rating[]).map((level) => {
              const filled = level <= subscription.rating;
              return (
                <span
                  key={level}
                  className="block rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: filled
                      ? `var(--rating-${subscription.rating})`
                      : 'transparent',
                    border: `1.5px solid ${
                      filled
                        ? `var(--rating-${subscription.rating})`
                        : 'var(--border-subtle)'
                    }`,
                  }}
                />
              );
            })}
          </span>
          <span className="font-display italic text-sm text-stone-500">
            {t('cardThreshold', {
              defaultValue: '{{label}} or higher',
              label: ratingLabel,
            })}
          </span>
        </div>
      </div>

      {/* Footer: recipient + opened */}
      <footer className="mx-6 mt-1 mb-5 pt-4 border-t border-dashed border-stone-200">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-stone-400 shrink-0"
              aria-hidden
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="font-mono text-xs text-stone-700 truncate">
              {subscription.email}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 tabular-nums">
            {t('cardOpened', { defaultValue: 'opened' })}{' '}
            {formatRelative(subscription.createdAt, i18n.language)}
          </span>
        </div>
      </footer>
    </article>
  );
}
