import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField, Button, Box } from '@mui/material'
import { useSkills } from '../hooks/useSkills'
import { useTranslation } from 'react-i18next'

type FormData = { name: string }

export default function SkillForm() {
  const { t } = useTranslation()
  const { create } = useSkills()
  const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: { name: '' } })

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
