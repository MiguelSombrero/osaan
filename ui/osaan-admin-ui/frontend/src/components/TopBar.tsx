import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'

export default function TopBar() {
  return (
    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6">Osaan Admin</Typography>
      </Toolbar>
    </AppBar>
  )
}
