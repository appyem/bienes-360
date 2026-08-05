import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import logo from '../../assets/logo.png'; 

const MapFilters = ({ onFilterChange }) => {
  // Mantenemos el estado completo para no romper la lógica del padre, pero solo mostramos Venta/Arriendo
  const [filters, setFilters] = useState({
    tipo: 'todos',
    precioMax: '',
    habitaciones: 'todos'
  });

  const handleTypeFilter = (newType) => {
    // Si ya está activo, lo desactivamos (vuelve a 'todos')
    const finalType = filters.tipo === newType ? 'todos' : newType;
    const newFilters = { ...filters, tipo: finalType };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000, 
      px: { xs: 2, md: 4 }, 
      py: 1.5, 
      bgcolor: 'rgba(35, 35, 35, 0.85)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      gap: 2
    }}>
      {/* Logo y Nombre (Claramente visibles, nunca se encogen) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <Box 
          component="img" 
          src={logo} 
          alt="Logo Bienes 360°" 
          sx={{ height: 40, width: 'auto', objectFit: 'contain' }} 
        />
        <Typography 
          variant="h6" 
          fontWeight="700" 
          sx={{ 
            color: '#FFFFFF', 
            letterSpacing: '0.5px', 
            whiteSpace: 'nowrap', // Evita que el nombre se parta o desaparezca
            display: { xs: 'none', sm: 'block' } // En móviles muy pequeños se oculta el texto para ahorrar espacio, pero el logo queda grande
          }}
        >
          Bienes 360°
        </Typography>
      </Box>

      {/* SOLO Venta y Arriendo */}
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        <Chip 
          label="Venta" 
          onClick={() => handleTypeFilter('venta')}
          size="small"
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.8rem', 
            height: 32,
            bgcolor: filters.tipo === 'venta' ? '#1E3A5F' : 'rgba(255,255,255,0.1)',
            color: filters.tipo === 'venta' ? '#fff' : 'rgba(255,255,255,0.8)',
            border: filters.tipo === 'venta' ? 'none' : '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: filters.tipo === 'venta' ? '#162B47' : 'rgba(255,255,255,0.2)' }
          }}
        />
        <Chip 
          label="Arriendo" 
          onClick={() => handleTypeFilter('arriendo')}
          size="small"
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.8rem', 
            height: 32,
            bgcolor: filters.tipo === 'arriendo' ? '#B8860B' : 'rgba(255,255,255,0.1)',
            color: filters.tipo === 'arriendo' ? '#fff' : 'rgba(255,255,255,0.8)',
            border: filters.tipo === 'arriendo' ? 'none' : '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: filters.tipo === 'arriendo' ? '#9A7209' : 'rgba(255,255,255,0.2)' }
          }}
        />
      </Box>
    </Box>
  );
};

export default MapFilters;