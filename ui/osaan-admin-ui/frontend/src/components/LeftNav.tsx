import React from 'react'
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const drawerWidth = 240

export default function LeftNav() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: drawerWidth }}>
      <List sx={{ width: drawerWidth }}>
        <ListItemButton onClick={() => navigate('/skills')}>
          <ListItemText primary={t('skills')} />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/employees')}>
          <ListItemText primary={t('employees')} />
        </ListItemButton>
      </List>
    </Drawer>
  )
}
