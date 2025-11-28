import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SkillForm from '../skill/components/SkillForm';
import { SkillList } from '../skill/components/SkillList';

export default function SkillsPage() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('skills')}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <SkillForm />
      </Paper>
      <Paper sx={{ p: 2 }}>
        <SkillList />
      </Paper>
    </Box>
  );
}
