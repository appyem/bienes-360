import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import TopBar from '../components/ui/TopBar';
import BottomNav from '../components/ui/BottomNav';

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
          pb: { xs: 10, md: 4 }, // Espacio extra abajo solo en móviles para el BottomNav
          px: { xs: 2, md: 3 }
        }}
      >
        <Outlet />
      </Container>
      <BottomNav />
    </Box>
  );
};

export default MainLayout;