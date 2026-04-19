'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

interface SelectionSummaryBarProps {
  selectedCount: number;
  unratedCount: number;
  onSave: () => void;
  isSaving: boolean;
}

function SelectionSummaryBar({
  selectedCount,
  unratedCount,
  onSave,
  isSaving,
}: SelectionSummaryBarProps) {
  const { t } = useTranslation();
  const readyToSave = selectedCount > 0 && unratedCount === 0;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-white border-t border-stone-200',
        'shadow-[0_-4px_16px_rgba(26,23,20,0.08)]',
        'transition-transform duration-200 ease-out',
        selectedCount > 0 ? 'translate-y-0' : 'translate-y-full'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-[var(--page-x)] py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-stone-950 font-sans">
            {selectedCount === 1
              ? t('selectedSkillsCountSingle', { count: selectedCount })
              : t('selectedSkillsCount', { count: selectedCount })}
          </span>
          {unratedCount > 0 && (
            <span className="text-sm text-saffron-600 font-sans">
              {unratedCount === 1
                ? t('unratedSkillsWarningSingle', { count: unratedCount })
                : t('unratedSkillsWarning', { count: unratedCount })}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={!readyToSave}
          loading={isSaving}
        >
          {isSaving ? t('savingProfile') : t('saveProfile')}
        </Button>
      </div>
    </div>
  );
}

export { SelectionSummaryBar };
