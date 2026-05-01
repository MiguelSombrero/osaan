'use client';

import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/ui/spinner';
import type { CompetenceProfileData } from '@/types/competence';
import type { Rating } from '@/types/rating';

interface CompetenceProfilePanelProps {
  profile: CompetenceProfileData | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ratingColors: Record<number, string> = {
  1: 'var(--rating-1)',
  2: 'var(--rating-2)',
  3: 'var(--rating-3)',
  4: 'var(--rating-4)',
  5: 'var(--rating-5)',
};

function RatingDots({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((level) => (
        <span
          key={level}
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: level <= rating ? ratingColors[level] : 'var(--border-subtle)',
            flexShrink: 0,
          }}
        />
      ))}
    </span>
  );
}

function CompetenceProfilePanel({ profile, isLoading, error }: CompetenceProfilePanelProps) {
  const { t } = useTranslation();
  const competences = profile?.competences ?? [];
  const hasSkills = competences.length > 0;

  return (
    <section aria-label={t('yourProfile')}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-stone-950 leading-tight">
            {t('yourProfile')}
          </h2>
          {hasSkills && (
            <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-saffron-100 text-saffron-700 text-xs font-sans font-semibold tabular-nums">
              {competences.length}
            </span>
          )}
        </div>
        {hasSkills && (
          <p className="text-xs text-stone-400 font-sans">{t('profileLastSaved')}</p>
        )}
      </div>

      {/* Panel body */}
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">
        {isLoading && (
          <div className="flex items-center gap-2 px-5 py-4">
            <Spinner size="sm" />
            <span className="text-sm text-stone-500 font-sans">{t('loading')}</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="px-5 py-4">
            <p className="text-sm text-stone-500 font-sans">{t('profileLoadError')}</p>
          </div>
        )}

        {!isLoading && !error && !hasSkills && (
          <div className="px-5 py-5 flex items-start gap-3">
            <span className="mt-0.5 text-stone-300 shrink-0" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-stone-700 font-sans">{t('profileEmpty')}</p>
              <p className="text-xs text-stone-400 font-sans mt-0.5">{t('profileEmptyHint')}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && hasSkills && (
          <ul className="divide-y divide-stone-100" role="list">
            {competences.map((competence) => (
              <li
                key={competence.id}
                className="flex items-center justify-between px-5 py-3 gap-4"
              >
                <span className="text-sm font-medium text-stone-800 font-sans leading-tight min-w-0 truncate">
                  {competence.skillName}
                </span>
                <div className="flex items-center gap-2.5 shrink-0">
                  <RatingDots rating={competence.rating} />
                  <span className="text-xs text-stone-400 font-sans w-16 text-right">
                    {t(`rating${competence.rating as Rating}`, { defaultValue: String(competence.rating) })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export { CompetenceProfilePanel };
