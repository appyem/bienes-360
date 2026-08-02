import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a3a52', // Base azul oscuro
      light: '#2c5282',
      dark: '#0f2440',
    },
    secondary: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#388E3C',
    },
    background: {
      // El secreto de Airbnb: un gris/azul muy pálido que hace que las tarjetas blancas resalten
      default: '#F7F8FA', 
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222222', // Negro suave, no puro
      secondary: '#717171', // Gris medio de Airbnb
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Circular", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h4: { fontWeight: 700, letterSpacing: '-0.005em', lineHeight: 1.4 },
    h5: { fontWeight: 600, lineHeight: 1.4 },
    h6: { fontWeight: 600, lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 12, // Redondeado elegante, no excesivo
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)', // Sombra base sutil
    '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)', // Sombra hover
    '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    ...Array(20).fill('0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F8FA',
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    
    // TARJETAS ESTILO AIRBNB (Limpio, blanco puro, sombra suave que se eleva)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.8)', // Borde sutil que da sensación de calidad
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          '&:last-child': { paddingBottom: '24px' },
        },
      },
    },

    // BOTONES CON ACABADO METÁLICO SUTIL (El secreto del brillo)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          border: '1px solid rgba(255,255,255,0.1)', // Borde interno para el brillo
        },
        containedPrimary: {
          // Degradado metálico azul oscuro
          background: 'linear-gradient(145deg, #1a3a52 0%, #2c5282 100%)',
          boxShadow: '0 4px 12px rgba(26, 58, 82, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)', // inset = brillo superior
          '&:hover': {
            background: 'linear-gradient(145deg, #2c5282 0%, #1a3a52 100%)',
            boxShadow: '0 6px 16px rgba(26, 58, 82, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          // Degradado metálico verde
          background: 'linear-gradient(145deg, #4CAF50 0%, #388E3C 100%)',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
          '&:hover': {
            background: 'linear-gradient(145deg, #66BB6A 0%, #4CAF50 100%)',
            boxShadow: '0 6px 16px rgba(76, 175, 80, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#DDDDDD',
          '&:hover': {
            borderColor: '#1a3a52',
            backgroundColor: 'rgba(26, 58, 82, 0.03)',
          },
        },
      },
    },

    // INPUTS LIMPIOS Y MODERNOS
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: '#DDDDDD',
              transition: 'border-color 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: '#1a3a52',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a3a52',
              borderWidth: '2px',
            },
          },
        },
      },
    },

    // CHIPS ELEGANTES
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.85rem',
        },
        filled: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});