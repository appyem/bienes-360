import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getValue = () => {
    switch(location.pathname) {
      case '/': return 0;
      case '/mapa': return 1;
      case '/favoritos': return 2;
      case '/perfil': return 3;
      default: return 0;
    }
  };

  const handleChange = (event, newValue) => {
    switch(newValue) {
      case 0: navigate('/'); break;
      case 1: navigate('/mapa'); break;
      case 2: navigate('/favoritos'); break;
      case 3: navigate('/perfil'); break;
      default: navigate('/');
    }
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        // Estilo Glassmorphism Oscuro Premium (igual que los chips)
        bgcolor: 'rgba(15, 15, 15, 0.75)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.4)',
        borderRadius: 0,
        // Ajuste para iPhone (Safe Area)
        pb: 'env(safe-area-inset-bottom)' 
      }} 
      elevation={0} // Eliminamos la sombra por defecto para usar la personalizada
    >
      <BottomNavigation
        value={getValue()}
        onChange={handleChange}
        showLabels
        sx={{
          bgcolor: 'transparent', // El fondo lo maneja el Paper
          '& .Mui-selected': {
            color: '#B8860B', // Dorado elegante (mismo acento premium de la app)
          },
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.6)', // Color base sutil para iconos/texto
            transition: 'color 0.2s ease',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.9)', 
            }
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
        <BottomNavigationAction label="Mapa" icon={<MapIcon />} />
        <BottomNavigationAction label="Favoritos" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;