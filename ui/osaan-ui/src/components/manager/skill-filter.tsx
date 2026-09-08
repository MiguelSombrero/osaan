'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { SearchInput, Button } from '@/components/ui';
import { RatingInput } from '@/components/ui/rating-input';
import {
  employeeSearchParamsSchema,
  type EmployeeSearchParamsInferred,
} from '@/lib/validation/schemas/manager.schema';
import { getFieldErrorMessage } from '@/lib/validation/i18n-error-map';

interface SkillFilterProps {
  onSearch: (params: EmployeeSearchParamsInferred) => void;
  isLoading?: boolean;
}

function SkillFilter({ onSearch, isLoading }: SkillFilterProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmployeeSearchParamsInferred>({
    resolver: zodResolver(employeeSearchParamsSchema),
    mode: 'onChange',
    defaultValues: { skillName: '', minRating: undefined },
  });

  const onSubmit = (data: EmployeeSearchParamsInferred) => {
    onSearch(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-800 font-sans mb-1.5">
          {t('skills')}
        </label>
        <Controller
          name="skillName"
          control={control}
          render={({ field }) => (
            <>
              <SearchInput
                value={field.value}
                onChange={field.onChange}
                placeholder={t('searchSkills')}
                debounceMs={0}
              />
              {errors.skillName && (
                <p className="text-xs text-error font-sans mt-1">
                  {getFieldErrorMessage('skillName', errors.skillName, t)}
                </p>
              )}
            </>
          )}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800 font-sans mb-1.5">
          {t('minimumRating')}
        </label>
        <Controller
          name="minRating"
          control={control}
          render={({ field }) => (
            <>
              <RatingInput value={field.value ?? null} onChange={field.onChange} size="md" />
              {errors.minRating && (
                <p className="text-xs text-error font-sans mt-1">
                  {getFieldErrorMessage('minRating', errors.minRating, t)}
                </p>
              )}
            </>
          )}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full"
        disabled={!isValid}
        loading={isLoading}
      >
        {t('searchEmployees')}
      </Button>
    </form>
  );
}

export { SkillFilter };
