import { useState, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeContext } from './theme';
import { theme as baseThemeConfig } from '../theme/index'; // Importamos tu diseño premium

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  // Combinamos tu configuración premium con el modo dinámico
  const theme = useMemo(
    () =>
      createTheme({
        ...baseThemeConfig, // Hereda TODOS los colores, sombras, tipografías y componentes premium
        palette: {
          ...baseThemeConfig.palette,
          mode, // Aplica el modo light/dark
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline /> {/* Esto aplica el fondo cálido #faf9f7 definido en tu tema */}
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};