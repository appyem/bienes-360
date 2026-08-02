import { createTheme } from '@mui/material/styles';

// Colores extraídos del logo Bienes 360°
const COLORS = {
  primary: {
    main: '#1a3a52',    // Azul oscuro (edificios y "Bienes")
    light: '#2c5282',
    dark: '#0f2440',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#4CAF50',    // Verde (flechas y "360°")
    light: '#66BB6A',
    dark: '#388E3C',
    contrastText: '#ffffff',
  },
  accent: {
    main: '#2196F3',    // Azul cian (arco superior)
    light: '#42A5F5',
    dark: '#1976D2',
  }
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a3a52',
      secondary: '#5a6b82',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFC107',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(26, 58, 82, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(26, 58, 82, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(26, 58, 82, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(26, 58, 82, 0.15)',
        },
      },
    },
  },
});