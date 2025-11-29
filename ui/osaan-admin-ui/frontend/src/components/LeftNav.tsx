import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { RequireAdmin } from './RequireAdmin';
import { RequireAuth } from './RequireAuth';

const drawerWidth = 260;

const navItemSx: SxProps<Theme> = {
  mx: 1,
  borderRadius: 1,
  mb: 0.5,
  '&.Mui-selected': {
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
    '& .MuiListItemIcon-root': {
      color: 'inherit',
    },
  },
};

export default function LeftNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isSelected = (path: string) => location.pathname.startsWith(path);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper', // Matches our parchment theme
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'primary.main', py: 1 }}>
          <AdminPanelSettingsIcon fontSize="large" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 700, fontFamily: 'Merriweather' }}
          >
            Osaan Admin
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        <RequireAdmin>
          <ListItemButton
            onClick={() => navigate('/skills')}
            selected={isSelected('/skills')}
            sx={navItemSx}
          >
            <ListItemIcon
              sx={{ minWidth: 40, color: isSelected('/skills') ? 'inherit' : 'primary.main' }}
            >
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary={t('skills')} slotProps={{ primary: { fontWeight: 500 } }} />
          </ListItemButton>
        </RequireAdmin>
        <RequireAuth>
          <ListItemButton
            onClick={() => navigate('/employees')}
            selected={isSelected('/employees')}
            sx={navItemSx}
          >
            <ListItemIcon
              sx={{ minWidth: 40, color: isSelected('/employees') ? 'inherit' : 'primary.main' }}
            >
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={t('employees')} slotProps={{ primary: { fontWeight: 500 } }} />
          </ListItemButton>
        </RequireAuth>
      </List>
    </Drawer>
  );
}
