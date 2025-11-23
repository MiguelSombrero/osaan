import { Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RequireAdmin } from './RequireAdmin'
import { RequireAuth } from './RequireAuth'

const drawerWidth = 240

export default function LeftNav() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: drawerWidth }}>
      <List sx={{ width: drawerWidth }}>
        <RequireAdmin>
          <ListItemButton onClick={() => navigate('/skills')}>
            <ListItemText primary={t('skills')} />
          </ListItemButton>
        </RequireAdmin>
        <RequireAuth>
          <ListItemButton onClick={() => navigate('/employees')}>
            <ListItemText primary={t('employees')} />
          </ListItemButton>
        </RequireAuth>
      </List>
    </Drawer>
  )
}
