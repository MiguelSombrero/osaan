import { List, ListItem, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSkills } from '../hooks/useSkills'
import type { Skill } from '@/api/generated/api'

export const SkillList: React.FC = () => {
  const { data, isLoading, remove } = useSkills()
  const skills: Skill[] = data ?? []

  if (isLoading) return <div>Loading...</div>
  if (skills.length === 0) return <div>No skills</div>

  return (
    <List>
      {skills.map((s) => (
        <ListItem
          key={s.id}
          secondaryAction={
            <IconButton edge="end" onClick={() => remove.mutate(s.id!)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={s.name} />
        </ListItem>
      ))}
    </List>
  )
}
