import AddIcon from '@mui/icons-material/Add';
import { Box, Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSkillSearch } from '../hooks/useSkillSearch';
import { useSkillSort } from '../hooks/useSkillSort';
import { useSkills } from '../hooks/useSkills';
import { ApiErrorAlert } from '@/components/ApiErrorAlert';
import { ApiError } from '@/api/errors';

type FormData = { name: string };

export default function SkillForm() {
  const { t } = useTranslation();
  const { searchTerm, debouncedSearchTerm, updateSearch } = useSkillSearch();
  const { order } = useSkillSort();

  const { create, data } = useSkills([`name,${order}`], debouncedSearchTerm);

  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: { name: searchTerm },
  });

  // Sync hook searchTerm to form input (one-way sync from URL/Store to Input)
  useEffect(() => {
    setValue('name', searchTerm);
  }, [searchTerm, setValue]);

  const onSubmit = async (formData: FormData) => {
    await create.mutateAsync(formData.name);
    reset();
    updateSearch('');
  };

  const isExactMatch = data?.skills?.some(
    skill => skill.name.toLowerCase() === searchTerm.trim().toLowerCase()
  );

  return (
    <>
      {create.error && (
        <ApiErrorAlert error={create.error as ApiError} onClose={() => create.reset()} />
      )}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('skillName')}
              fullWidth
              variant="outlined"
              placeholder={t('skillName')}
              onChange={e => {
                field.onChange(e);
                updateSearch(e.target.value);
              }}
            />
          )}
        />
        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={create.isPending || isExactMatch}
          startIcon={<AddIcon />}
          sx={{ height: 56, px: 4, whiteSpace: 'nowrap' }}
        >
          {t('add')}
        </Button>
      </Box>
    </>
  );
}
