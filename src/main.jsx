import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// 1. Importar el Proveedor de Autenticación (CRUCIAL para que no haya pantalla blanca)
import { AuthProvider } from './context/AuthProvider.jsx';

// 2. Importar el Proveedor del Tema (Para el diseño premium y modo oscuro/claro)
import { ThemeProvider } from './context/ThemeProvider.jsx';

// 3. Cargar el CSS global con las animaciones y fondos
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* El orden importa: AuthProvider envuelve a ThemeProvider y a la App */}
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);