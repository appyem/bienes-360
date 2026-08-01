import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../hooks/useTheme';

const TopBar = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0} 
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" fontWeight="700" letterSpacing="-0.5px">
          Bienes 360º
        </Typography>
        <Box>
          <IconButton onClick={toggleColorMode} color="inherit" aria-label="Cambiar modo de color">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;