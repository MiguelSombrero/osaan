import { Box, Button, TextField } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSkills } from '../hooks/useSkills'

type FormData = { name: string }

interface SkillFormProps {
  onSearchChange?: (value: string) => void
}

export default function SkillForm({ onSearchChange }: SkillFormProps) {
  const { t } = useTranslation()
  const { create } = useSkills()
  const { control, handleSubmit, reset, watch } = useForm<FormData>({ defaultValues: { name: '' } })

  const searchTerm = watch('name')

  useEffect(() => {
    onSearchChange?.(searchTerm)
  }, [searchTerm, onSearchChange])

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data.name)
    reset()
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', gap: 2 }}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <TextField {...field} label={t('skillName')} fullWidth />}
      />
      <Button variant="contained" type="submit" disabled={create.isPending}>
        {t('add')}
      </Button>
    </Box>
  )
}
