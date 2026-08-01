import { useContext } from 'react';
import { ThemeContext } from '../context/theme';

// Hook personalizado para consumir el tema
export const useThemeContext = () => useContext(ThemeContext);