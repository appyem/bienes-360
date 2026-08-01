import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light', // Se podrá cambiar a 'dark' dinámicamente después
    primary: {
      main: '#000000', // Minimalista: Negro como color primario
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8, // Bordes suaves tipo Apple
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Sin mayúsculas forzadas, más limpio
          borderRadius: 8,
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: '#000000', // Íconos en blanco y negro por defecto
        },
      },
    },
  },
});