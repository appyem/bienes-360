import { useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// Importamos el logo (ajusta la ruta si tu archivo está en otro lugar, ej: '../../assets/logo.png')
import logo from '../../assets/logo.png'; 

const MapFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    tipo: 'todos',
    precioMax: '',
    habitaciones: 'todos'
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { tipo: 'todos', precioMax: '', habitaciones: 'todos' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        px: { xs: 2, md: 4 },
        py: { xs: 1.5, md: 1.5 },
        bgcolor: 'rgba(35, 35, 35, 0.5)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 2 },
        alignItems: 'center',
      }}
    >
      {/* SECCIÓN SUPERIOR: LOGO + BOTÓN LIMPIAR (Idéntico al estilo del inicio) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: { xs: 0.5, sm: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            component="img" 
            src={logo} 
            alt="Logo Bienes 360°"
            sx={{ 
              height: 36, 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'brightness(1.1) contrast(1.05)' // Pequeño ajuste para que resalte sobre el cristal
            }} 
          />
          <Typography 
            variant="h6" 
            fontWeight="700" 
            sx={{ 
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              display: { xs: 'none', sm: 'block' } // Se oculta en móviles muy pequeños para ahorrar espacio
            }}
          >
            Bienes 360°
          </Typography>
        </Box>
        
        {/* Botón para limpiar filtros */}
        <IconButton size="small" onClick={handleReset} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* INPUTS DE FILTRO */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1.5, 
        width: '100%', 
        overflowX: 'auto', 
        pb: { xs: 0.5, sm: 0 },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
        <FormControl size="small" sx={{ minWidth: 110, flex: { xs: '0 0 auto', sm: 1 }, height: 40 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#B8860B' } }}>Tipo</InputLabel>
          <Select
            value={filters.tipo}
            label="Tipo"
            onChange={(e) => handleChange('tipo', e.target.value)}
            sx={{ 
              color: '#fff',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1.5,
              height: 40,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.4)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#B8860B' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.8)' }
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#232323', color: '#fff', borderRadius: 2 } } }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="Apartamento">Apartamento</MenuItem>
            <MenuItem value="Casa">Casa</MenuItem>
            <MenuItem value="Local">Local</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Precio Máx."
          type="number"
          value={filters.precioMax}
          onChange={(e) => handleChange('precioMax', e.target.value)}
          placeholder="Ej: 500M"
          sx={{ 
            minWidth: 120, 
            flex: { xs: '0 0 auto', sm: 1 },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#B8860B' } },
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1.5,
              height: 40,
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
              '&.Mui-focused fieldset': { borderColor: '#B8860B' },
            }
          }}
        />

        <FormControl size="small" sx={{ minWidth: 100, flex: { xs: '0 0 auto', sm: 1 }, height: 40 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#B8860B' } }}>Hab.</InputLabel>
          <Select
            value={filters.habitaciones}
            label="Hab."
            onChange={(e) => handleChange('habitaciones', e.target.value)}
            sx={{ 
              color: '#fff',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1.5,
              height: 40,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.4)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#B8860B' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.8)' }
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#232323', color: '#fff', borderRadius: 2 } } }}
          >
            <MenuItem value="todos">Todas</MenuItem>
            <MenuItem value="1">1+</MenuItem>
            <MenuItem value="2">2+</MenuItem>
            <MenuItem value="3">3+</MenuItem>
            <MenuItem value="4">4+</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default MapFilters;