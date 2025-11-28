import { Box, Button, TextField } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSkillSearch } from '../hooks/useSkillSearch'
import { useSkills } from '../hooks/useSkills'

type FormData = { name: string }

export default function SkillForm() {
  const { t } = useTranslation()
  const { create } = useSkills()
  const { searchTerm, updateSearch } = useSkillSearch()
  
  const { control, handleSubmit, reset, setValue } = useForm<FormData>({ 
    defaultValues: { name: searchTerm } 
  })

  // Sync hook searchTerm to form input (one-way sync from URL/Store to Input)
  useEffect(() => {
    setValue('name', searchTerm)
  }, [searchTerm, setValue])

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data.name)
    reset()
    updateSearch('') // Clear search after adding
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', gap: 2 }}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={t('skillName')} 
            fullWidth 
            onChange={(e) => {
              field.onChange(e)
              updateSearch(e.target.value)
            }}
          />
        )}
      />
      <Button variant="contained" type="submit" disabled={create.isPending}>
        {t('add')}
      </Button>
    </Box>
  )
}
