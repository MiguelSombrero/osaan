'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { SkillBrowser, SelectionSummaryBar, SaveCompetencesDialog } from '@/components/competences';
import { useCompetenceSelection } from '@/hooks/use-competence-selection';
import { useSaveCompetences } from '@/hooks/use-competences';
import { useSkills } from '@/hooks/use-skills';
import type { Rating } from '@/types/rating';

// Force dynamic rendering - disable static generation
export const dynamic = 'force-dynamic';

export default function CompetencesPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const employeeId = session?.user?.id;

  const { selected, toggle, setRating, clear, selectedCount, unratedCount } =
    useCompetenceSelection();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const saveMutation = useSaveCompetences(employeeId);

  // Fetch all skills for the save dialog display (just the selected page)
  // We pass the selected ids to find matching skill names
  const { data: skillsData } = useSkills({ size: 100 });
  const allLoadedSkills = skillsData?.skills ?? [];

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

      {/* Add bottom padding so the sticky bar doesn't overlap last cards */}
      <div className={selectedCount > 0 ? 'pb-20' : ''}>
        <SkillBrowser
          selectedSkills={selected}
          onToggle={toggle}
          onRate={setRating}
        />
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
