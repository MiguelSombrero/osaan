import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SkillForm from '../skill/components/SkillForm';
import { SkillList } from '../skill/components/SkillList';

export default function SkillsPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('skills')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          {/* Placeholder for description if needed, keeps layout balanced */}
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            border: '1px solid', 
            borderColor: 'divider',
            backgroundColor: 'background.paper' 
          }}
        >
          <SkillForm />
        </Paper>
        
        <Box>
          <SkillList />
        </Box>
      </Stack>
    </Container>
  );
}
