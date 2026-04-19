'use client';

import { useTranslation } from 'react-i18next';
import { Modal, Button } from '@/components/ui';
import type { Rating } from '@/types/rating';
import type { Skill } from '@/types/skill';

interface SaveCompetencesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  skills: Skill[];
  selection: Map<string, Rating | null>;
  isSaving: boolean;
  error?: string | null;
}

function SaveCompetencesDialog({
  open,
  onClose,
  onConfirm,
  skills,
  selection,
  isSaving,
  error,
}: SaveCompetencesDialogProps) {
  const { t } = useTranslation();

  const selectedSkills = skills.filter((s) => selection.has(s.id));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('confirmSave')}
      description={t('confirmSaveDescription')}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isSaving}>
            {t('cancel')}
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm} loading={isSaving}>
            {isSaving ? t('savingProfile') : t('saveProfile')}
          </Button>
        </>
      }
    >
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {selectedSkills.map((skill) => {
          const rating = selection.get(skill.id) as Rating;
          return (
            <div
              key={skill.id}
              className="flex items-center justify-between py-2 px-3 rounded-md bg-stone-50 border border-stone-100"
            >
              <span className="text-sm font-medium text-stone-800 font-sans">
                {skill.name}
              </span>
              <span className="text-xs font-mono text-saffron-600 font-medium" suppressHydrationWarning>
                {rating} — {t(`rating${rating}`)}
              </span>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-3 text-sm text-error font-sans">{error}</p>
      )}
    </Modal>
  );
}

export { SaveCompetencesDialog };
