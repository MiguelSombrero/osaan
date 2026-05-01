'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteCompetence, useUpdateCompetenceRating } from '@/hooks/use-competences';
import type { CompetenceProfileData, CompetenceDetail } from '@/types/competence';
import type { Rating } from '@/types/rating';

interface CompetenceProfilePanelProps {
  profile: CompetenceProfileData | undefined;
  isLoading: boolean;
  error: Error | null;
  employeeId: string | undefined;
  onRatingUpdated?: (skillName: string, rating: Rating) => void;
}

const ratingColors: Record<number, string> = {
  1: 'var(--rating-1)',
  2: 'var(--rating-2)',
  3: 'var(--rating-3)',
  4: 'var(--rating-4)',
  5: 'var(--rating-5)',
};

interface CompetenceRowProps {
  competence: CompetenceDetail;
  onDelete: (id: string) => void;
  onUpdateRating: (id: string, rating: Rating, skillName: string) => void;
  isPending: boolean;
}

function CompetenceRow({ competence, onDelete, onUpdateRating, isPending }: CompetenceRowProps) {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<Rating | null>(null);

  const currentRating = competence.rating as Rating;
  const displayRating = hoveredRating ?? currentRating;

  if (confirmDelete) {
    return (
      <li className="flex items-center justify-between px-5 py-3 gap-4 bg-red-50 border-l-2 border-red-300">
        <span className="text-sm font-medium text-stone-700 font-sans truncate min-w-0">
          {competence.skillName}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="text-xs text-stone-500 hover:text-stone-700 font-sans transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={() => onDelete(competence.id)}
            disabled={isPending}
            className="text-xs font-semibold text-red-600 hover:text-red-700 font-sans transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            {isPending ? (
              <Spinner size="sm" />
            ) : null}
            {t('remove')}
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className="group flex items-center justify-between px-5 py-3 gap-4 transition-colors hover:bg-stone-50"
      onMouseLeave={() => setHoveredRating(null)}
    >
      <span className="text-sm font-medium text-stone-800 font-sans leading-tight min-w-0 truncate">
        {competence.skillName}
      </span>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Interactive rating dots — hover previews, click to save */}
        <div
          className="flex items-center gap-[3px]"
          role="group"
          aria-label={t('updateRating', { defaultValue: 'Update rating' })}
          onMouseLeave={() => setHoveredRating(null)}
        >
          {([1, 2, 3, 4, 5] as Rating[]).map((level) => (
            <button
              key={level}
              type="button"
              disabled={isPending}
              aria-label={`${t(`rating${level}`, { defaultValue: String(level) })}`}
              onClick={() => onUpdateRating(competence.id, level, competence.skillName)}
              onMouseEnter={() => setHoveredRating(level)}
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: level <= displayRating ? ratingColors[level] : 'var(--border-subtle)',
                flexShrink: 0,
                cursor: isPending ? 'default' : 'pointer',
                transition: 'background-color 0.1s ease',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>

        <span className="text-xs text-stone-400 font-sans w-16 text-right tabular-nums">
          {t(`rating${displayRating}`, { defaultValue: String(displayRating) })}
        </span>

        {/* Delete button — fades in on row hover */}
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-stone-300 hover:text-red-400 disabled:cursor-default"
          aria-label={t('removeSkill', { defaultValue: 'Remove skill' })}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </li>
  );
}

function CompetenceProfilePanel({ profile, isLoading, error, employeeId, onRatingUpdated }: CompetenceProfilePanelProps) {
  const { t } = useTranslation();
  const competences = profile?.competences ?? [];
  const hasSkills = competences.length > 0;

  const deleteMutation = useDeleteCompetence(employeeId);
  const updateRatingMutation = useUpdateCompetenceRating(employeeId);

  const handleDelete = (competenceId: string) => {
    deleteMutation.mutate(competenceId);
  };

  const handleUpdateRating = (competenceId: string, rating: Rating, skillName: string) => {
    updateRatingMutation.mutate(
      { competenceId, rating },
      { onSuccess: () => onRatingUpdated?.(skillName, rating) }
    );
  };

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
              <CompetenceRow
                key={competence.id}
                competence={competence}
                onDelete={handleDelete}
                onUpdateRating={handleUpdateRating}
                isPending={
                  (deleteMutation.isPending && deleteMutation.variables === competence.id) ||
                  (updateRatingMutation.isPending && updateRatingMutation.variables?.competenceId === competence.id)
                }
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export { CompetenceProfilePanel };
