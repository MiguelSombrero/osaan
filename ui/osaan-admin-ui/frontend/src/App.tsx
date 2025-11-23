import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import LeftNav from './components/LeftNav';
import { RequireAdmin } from './components/RequireAdmin';
import { RequireAuth } from './components/RequireAuth';
import TopBar from './components/TopBar';
import EmployeesPage from './pages/EmployeesPage';
import SkillsPage from './pages/SkillsPage';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Box display="flex">
        <LeftNav />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/skills" replace />} />
            <Route
              path="/skills"
              element={
                <RequireAdmin>
                  <SkillsPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/employees"
              element={
                <RequireAuth>
                  <EmployeesPage />
                </RequireAuth>
              }
            />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
