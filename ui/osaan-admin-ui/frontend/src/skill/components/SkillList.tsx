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
    TablePagination,
    TableRow,
    TableSortLabel
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from '../../hooks/useDebounce'
import { useSkillSort } from '../hooks/useSkillSort'
import { useSkills } from '../hooks/useSkills'

interface SkillListProps {
  searchTerm: string
}

export const SkillList: React.FC<SkillListProps> = ({ searchTerm }) => {
  const { t } = useTranslation()
  const { order, toggleSort } = useSkillSort()
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data, isLoading, remove } = useSkills(
    [`name,${order}`], 
    debouncedSearchTerm
  )
  
  const skills: Skill[] = data?.skills ?? []

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const displayedSkills = skills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
          {displayedSkills.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => remove.mutate(s.id!)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {displayedSkills.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center">
                {t('noSkills')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={skills.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}
