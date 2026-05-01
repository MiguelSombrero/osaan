'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import {
  SkillBrowser,
  SelectionSummaryBar,
  SaveCompetencesDialog,
  CompetenceProfilePanel,
} from '@/components/competences';
import { useAppSession } from '@/hooks/use-app-session';
import { useCompetenceSelection } from '@/hooks/use-competence-selection';
import { useSaveCompetences, useCompetences } from '@/hooks/use-competences';
import { useSkills } from '@/hooks/use-skills';
import type { Rating } from '@/types/rating';

// Force dynamic rendering - disable static generation
export const dynamic = 'force-dynamic';

export default function CompetencesPage() {
  const { t } = useTranslation();
  const { userId } = useAppSession();
  const employeeId = userId ?? undefined;

  const { selected, toggle, setRating, clear, selectedCount, unratedCount } =
    useCompetenceSelection();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ratingUpdatedNotice, setRatingUpdatedNotice] = useState<{ skillName: string; rating: Rating } | null>(null);

  const saveMutation = useSaveCompetences(employeeId);
  const { data: profileData, isLoading: profileLoading, error: profileError } = useCompetences(employeeId);

  // Fetch skills for the save dialog display
  const { data: skillsData } = useSkills({ size: 100 });
  const allLoadedSkills = skillsData?.skills ?? [];

  const handleRatingUpdated = (skillName: string, rating: Rating) => {
    setRatingUpdatedNotice({ skillName, rating });
    setTimeout(() => setRatingUpdatedNotice(null), 3000);
  };

  const handleSave = () => {
    setSaveError(null);
    setDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    const competences = Array.from(selected.entries()).map(([skillId, rating]) => ({
      skillId,
      rating: rating as Rating,
    }));

    try {
      await saveMutation.mutateAsync(competences);
      setDialogOpen(false);
      clear();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('saveFailed'));
    }
  };

  return (
    <AppShell>
      <PageHeader
        title={t('mySkills')}
        subtitle={t('browseSkills')}
      />

      {savedSuccess && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-success-light text-success border border-green-200 rounded-md text-sm font-medium font-sans">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t('profileSaved')}
        </div>
      )}

      {ratingUpdatedNotice && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-success-light text-success border border-green-200 rounded-md text-sm font-medium font-sans">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t('ratingUpdated', {
            skillName: ratingUpdatedNotice.skillName,
            ratingLabel: t(`rating${ratingUpdatedNotice.rating}`),
          })}
        </div>
      )}

      {/* Two-column layout: profile on left (sticky), skill browser on right */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-6 items-start">
        {/* Left: Competence Profile — sticky so it stays visible while browsing skills */}
        <div className="lg:sticky lg:top-6">
          <CompetenceProfilePanel
            profile={profileData}
            isLoading={profileLoading}
            error={profileError instanceof Error ? profileError : null}
            employeeId={employeeId}
            onRatingUpdated={handleRatingUpdated}
          />
        </div>

        {/* Right: Skill browser */}
        <div className={selectedCount > 0 ? 'pb-20' : ''}>
          <div className="mb-3">
            <h2 className="font-display text-lg font-semibold text-stone-950 leading-tight">
              {t('browseAndAdd')}
            </h2>
            <p className="text-sm text-stone-500 font-sans mt-0.5">{t('browseAndAddHint')}</p>
          </div>
          <SkillBrowser
            selectedSkills={selected}
            onToggle={toggle}
            onRate={setRating}
          />
        </div>
      </div>

      <SelectionSummaryBar
        selectedCount={selectedCount}
        unratedCount={unratedCount}
        onSave={handleSave}
        isSaving={saveMutation.isPending}
      />

      <SaveCompetencesDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSaveError(null);
        }}
        onConfirm={handleConfirmSave}
        skills={allLoadedSkills}
        selection={selected}
        isSaving={saveMutation.isPending}
        error={saveError}
      />
    </AppShell>
  );
}
