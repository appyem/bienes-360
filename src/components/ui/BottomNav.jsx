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
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        // Ajuste para iPhone (Safe Area)
        pb: 'env(safe-area-inset-bottom)' 
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getValue()}
        onChange={handleChange}
        showLabels
        sx={{
          bgcolor: 'background.paper',
          '& .Mui-selected': {
            color: 'primary.main',
          },
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
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