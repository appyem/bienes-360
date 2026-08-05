import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import TopBar from '../components/ui/TopBar';
import BottomNav from '../components/ui/BottomNav';
import InstallPrompt from '../components/ui/InstallPrompt'; // <-- NUEVO

const MainLayout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <TopBar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: 2,
          pb: { xs: 10, md: 4 },
          px: { xs: 2, md: 3 }
        }}
      >
        <Outlet />
      </Container>
      
      {/* Botón de instalación global */}
      <InstallPrompt />
      
      <BottomNav />
    </Box>
  );
};

export default MainLayout;