import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

export default function TopBar() {
  const { data } = useAuth();
  const loggedIn = !!data?.authenticated;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Osaan Admin</Typography>
        <Box sx={{ flex: 1 }} />
        {loggedIn ? (
          <Button color="inherit" onClick={() => (window.location.href = '/api/logout')}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={() => (window.location.href = '/api/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
