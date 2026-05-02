'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui';
import type { EmployeeSearchResult } from '@/types/manager';
import type { Rating } from '@/types/rating';

interface EmployeeResultCardProps {
  employee: EmployeeSearchResult;
  selected: boolean;
  onToggle: (employee: EmployeeSearchResult) => void;
}

function EmployeeResultCard({ employee, selected, onToggle }: EmployeeResultCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'bg-white rounded-md border p-4 transition-all duration-150',
        selected
          ? 'border-saffron-600 border-2 bg-saffron-50'
          : 'border-stone-200 hover:border-stone-300'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans font-medium text-stone-950 truncate">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-stone-600 font-sans truncate mt-0.5">{employee.email}</p>
        </div>
        <Button
          variant={selected ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onToggle(employee)}
          className="shrink-0"
        >
          {selected ? t('removeFromList') : t('addToList')}
        </Button>
      </div>
      {(employee.matchedSkills?.length ?? 0) > 0 && (
        <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
          {employee.matchedSkills.map((ms) => (
            <div key={ms.skillId} className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-700 font-sans flex-1 min-w-0 truncate">
                {ms.skillName}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {([1, 2, 3, 4, 5] as Rating[]).map((level) => (
                  <span
                    key={level}
                    className="block rounded-full shrink-0"
                    style={{
                      width: 9,
                      height: 9,
                      backgroundColor:
                        level <= ms.rating ? `var(--rating-${ms.rating})` : 'transparent',
                      border: `1.5px solid ${level <= ms.rating ? `var(--rating-${ms.rating})` : 'var(--border)'}`,
                    }}
                  />
                ))}
                <span className="text-xs text-stone-500 font-sans ml-1.5">
                  {t(`rating${ms.rating}`, { defaultValue: String(ms.rating) })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { EmployeeResultCard };
