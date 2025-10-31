import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import LeftNav from './components/LeftNav';
import SkillsPage from './pages/SkillsPage';
import FrontPage from './pages/FrontPage';
import EmployeesPage from './pages/EmployeesPage';
import TopBar from './components/TopBar';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Box display="flex">
        <LeftNav />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
