import type { Skill } from '@/api/generated/api'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDebounce } from '../../hooks/useDebounce'
import { useSkillSort } from '../hooks/useSkillSort'
import { useSkills } from '../hooks/useSkills'

import { useSkillStore } from '../store/store'

export const SkillList: React.FC = () => {
  const { t } = useTranslation()
  const { order, toggleSort } = useSkillSort()
  const { searchTerm } = useSkillStore()
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data, isLoading, remove } = useSkills(
    [`name,${order}`], 
    debouncedSearchTerm
  )
  
  const skills: Skill[] = data?.skills ?? []

  if (isLoading) return <div>Loading...</div>
  if (skills.length === 0 && !searchTerm) return <div>{t('noSkills')}</div>

  return (
    <TableContainer component={Paper}>
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
          {skills.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => remove.mutate(s.id!)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {skills.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center">
                {t('noSkills')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
