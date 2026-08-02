import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../hooks/useTheme'; // <-- Importación corregida
import logo from '../../assets/logo.png';

const TopBar = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <AppBar 
      position="static" 
      color="default"
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img 
            src={logo} 
            alt="Bienes 360°" 
            style={{ 
              height: '48px', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
          <Typography 
            variant="h6" 
            fontWeight="700" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              color: 'primary.main',
              letterSpacing: '-0.5px'
            }}
          >
            Bienes 360°
          </Typography>
        </Box>
        
        <Box>
          <IconButton 
            onClick={toggleColorMode} 
            color="inherit"
            sx={{
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;