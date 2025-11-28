import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SkillForm from '../skill/components/SkillForm';
import { SkillList } from '../skill/components/SkillList';

export default function SkillsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('skills')}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <SkillForm onSearchChange={setSearchTerm} />
      </Paper>
      <Paper sx={{ p: 2 }}>
        <SkillList searchTerm={searchTerm} />
      </Paper>
    </Box>
  );
}
