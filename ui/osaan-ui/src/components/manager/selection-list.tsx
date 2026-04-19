'use client';

import { useTranslation } from 'react-i18next';
import { Button, EmptyState } from '@/components/ui';
import type { EmployeeSearchResult } from '@/types/manager';

interface SelectionListProps {
  selected: EmployeeSearchResult[];
  onRemove: (employeeId: string) => void;
}

function SelectionList({ selected, onRemove }: SelectionListProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-stone-950 mb-3">
        {t('myList')}
        {selected.length > 0 && (
          <span className="ml-2 text-sm font-mono text-saffron-600 font-normal">
            {selected.length}
          </span>
        )}
      </h3>
      {selected.length === 0 ? (
        <p className="text-sm text-stone-500 font-sans">{t('emptyList')}</p>
      ) : (
        <ul className="space-y-2">
          {selected.map((emp) => (
            <li
              key={emp.id}
              className="flex items-center justify-between gap-2 py-2 px-3 bg-stone-50 rounded-md border border-stone-100"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-950 font-sans truncate">
                  {emp.firstName} {emp.lastName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(emp.id!)}
                aria-label={`Remove ${emp.firstName} ${emp.lastName}`}
                className="shrink-0 text-stone-400 hover:text-error"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { SelectionList };
