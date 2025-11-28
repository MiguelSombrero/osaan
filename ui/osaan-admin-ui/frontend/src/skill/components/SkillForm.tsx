import { Box, Button, TextField } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSkills } from '../hooks/useSkills'
import { useSkillStore } from '../store/store'

type FormData = { name: string }

export default function SkillForm() {
  const { t } = useTranslation()
  const { create } = useSkills()
  const { searchTerm, setSearchTerm } = useSkillStore()
  
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({ 
    defaultValues: { name: searchTerm } 
  })

  // Sync store searchTerm to form input (in case it changes externally or on mount)
  useEffect(() => {
    setValue('name', searchTerm)
  }, [searchTerm, setValue])

  const currentName = watch('name')

  // Sync form input to store searchTerm
  useEffect(() => {
    setSearchTerm(currentName || '')
  }, [currentName, setSearchTerm])

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data.name)
    reset()
    setSearchTerm('') // Clear search after adding
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
