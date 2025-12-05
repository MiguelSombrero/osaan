import type { Skill } from '@/api/generated/api';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { useTranslation } from 'react-i18next';
import { useSkillSearch } from '../hooks/useSkillSearch';
import { useSkillSort } from '../hooks/useSkillSort';
import { useSkillPagination } from '../hooks/useSkillPagination';
import { useSkills } from '../hooks/useSkills';
import { ApiErrorAlert } from '@/components/ApiErrorAlert';
import { ApiError } from '@/api/errors';
import { Loading } from '@/components/Loading';

export const SkillList: React.FC = () => {
  const { t } = useTranslation();
  const { order, toggleSort } = useSkillSort();
  const { searchTerm, debouncedSearchTerm } = useSkillSearch();
  const { page, size, updatePage, updateSize } = useSkillPagination();

  const { data, isLoading, remove, error } = useSkills(
    [`name,${order}`],
    debouncedSearchTerm,
    page,
    size
  );

  const skills: Skill[] = data?.skills ?? [];

  if (isLoading) return <Loading />;

  if (error) {
    return <ApiErrorAlert error={error as ApiError} />;
  }

  if (skills.length === 0 && !searchTerm) return <div>{t('noSkills')}</div>;

  return (
    <>
      {/* Display delete error if deletion fails */}
      {remove.error && (
        <ApiErrorAlert error={remove.error as ApiError} onClose={() => remove.reset()} />
      )}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={order} onClick={toggleSort}>
                  {t('skillName')}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">{t('delete')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map(s => (
              <TableRow key={s.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        display: 'inline-block',
                      }}
                    />
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {s.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => remove.mutate(s.id!)}
                    color="default"
                    size="small"
                    aria-label={t('delete')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {skills.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  {t('noMatch')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.totalElements ?? 0}
          page={page}
          onPageChange={(_, newPage) => updatePage(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={event => {
            updateSize(parseInt(event.target.value, 10));
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>
    </>
  );
};
