import { login, logout, useAuth } from '@/hooks/useAuth';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TopBar() {
  const { data } = useAuth();
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const loggedIn = !!data?.authenticated;
  const authDisabled = data?.authDisabled;

  const currentLanguage = i18n.language || 'fi';
  const currentFlag = currentLanguage.startsWith('en') ? '🇬🇧' : '🇫🇮';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Osaan Admin</Typography>
        <Box sx={{ flex: 1 }} />

        <Tooltip title="Change Language">
          <IconButton
            size="large"
            aria-label="change language"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <span style={{ fontSize: '1.5rem' }}>{currentFlag}</span>
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => changeLanguage('fi')}>
            <span role="img" aria-label="Finnish" style={{ marginRight: '8px', fontSize: '1.2rem' }}>
              🇫🇮
            </span>
            Suomi
          </MenuItem>
          <MenuItem onClick={() => changeLanguage('en')}>
            <span role="img" aria-label="English" style={{ marginRight: '8px', fontSize: '1.2rem' }}>
              🇬🇧
            </span>
            English
          </MenuItem>
        </Menu>

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
