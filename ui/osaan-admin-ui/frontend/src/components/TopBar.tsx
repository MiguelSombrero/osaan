import React from 'react';
import { useAuth, login, logout } from '@/hooks/useAuth';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

export default function TopBar() {
  const { data } = useAuth();
  const loggedIn = !!data?.authenticated;
  const authDisabled = data?.authDisabled;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Osaan Admin</Typography>
        <Box sx={{ flex: 1 }} />
        {authDisabled ? null : loggedIn ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
