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
  TableSortLabel,
} from '@mui/material'
import { useSkills } from '../hooks/useSkills'
import { useSkillSort } from '../hooks/useSkillSort'

export const SkillList: React.FC = () => {
  const { order, toggleSort } = useSkillSort()
  const { data, isLoading, remove } = useSkills([`name,${order}`])
  const skills: Skill[] = data?.skills ?? []

  if (isLoading) return <div>Loading...</div>
  if (skills.length === 0) return <div>No skills</div>

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel active direction={order} onClick={toggleSort}>
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Actions</TableCell>
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
        </TableBody>
      </Table>
    </TableContainer>
  )
}
