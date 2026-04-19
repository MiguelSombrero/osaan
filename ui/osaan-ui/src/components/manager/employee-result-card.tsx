'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { Badge, Button } from '@/components/ui';
import { RatingInput } from '@/components/ui/rating-input';
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
      {employee.matchedSkills.length > 0 && (
        <div className="mt-3 space-y-2">
          {employee.matchedSkills.map((ms) => (
            <div key={ms.skillId} className="flex items-center justify-between gap-2">
              <Badge variant="muted">{ms.skillName}</Badge>
              <RatingInput
                value={ms.rating as Rating}
                onChange={() => {}}
                disabled
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { EmployeeResultCard };
