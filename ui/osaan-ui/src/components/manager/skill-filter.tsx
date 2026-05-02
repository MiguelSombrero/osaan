'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput, Button } from '@/components/ui';
import { RatingInput } from '@/components/ui/rating-input';
import type { Rating } from '@/types/rating';
import type { EmployeeSearchParams } from '@/types/manager';

interface SkillFilterProps {
  onSearch: (params: EmployeeSearchParams) => void;
  isLoading?: boolean;
}

function SkillFilter({ onSearch, isLoading }: SkillFilterProps) {
  const { t } = useTranslation();
  const [skillQuery, setSkillQuery] = useState('');
  const [minRating, setMinRating] = useState<Rating | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillQuery.trim() || !minRating) return;
    onSearch({ skillName: skillQuery.trim(), minRating });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-800 font-sans mb-1.5">
          {t('skills')}
        </label>
        <SearchInput
          value={skillQuery}
          onChange={setSkillQuery}
          placeholder={t('searchSkills')}
          debounceMs={0}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800 font-sans mb-1.5">
          {t('minimumRating')}
        </label>
        <RatingInput
          value={minRating}
          onChange={setMinRating}
          size="md"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full"
        disabled={!skillQuery.trim() || !minRating}
        loading={isLoading}
      >
        {t('searchEmployees')}
      </Button>
    </form>
  );
}

export { SkillFilter };
