import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import LeftNav from './components/LeftNav';
import SkillsPage from './pages/SkillsPage';
import EmployeesPage from './pages/EmployeesPage';
import TopBar from './components/TopBar';
import { RequireAuth } from './components/RequireAuth';

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
                <RequireAuth>
                  <SkillsPage />
                </RequireAuth>
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
