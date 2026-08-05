import { useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
        bgcolor: 'rgba(35, 35, 35, 0.85)', // Un poco más opaco para mejor lectura
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 },
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: { xs: 0.5, sm: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#FFFFFF', display: { xs: 'none', sm: 'block' } }}>
            Bienes 360°
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleReset} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* CAMBIO CLAVE: flexWrap: 'wrap' en lugar de overflowX: 'auto' */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', // Permite que bajen de línea si no caben, sin scroll
        gap: 1, 
        width: '100%', 
        justifyContent: 'center', // Centrar en móvil
      }}>
        <FormControl size="small" sx={{ minWidth: 85, flex: { xs: '1 1 calc(50% - 4px)', sm: '0 0 auto' }, height: 38 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#B8860B' }, fontSize: '0.75rem' }}>Tipo</InputLabel>
          <Select
            value={filters.tipo}
            label="Tipo"
            onChange={(e) => handleChange('tipo', e.target.value)}
            sx={{ 
              color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1.5, height: 38, fontSize: '0.8rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#B8860B' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#232323', color: '#fff', borderRadius: 2 } } }}
          >
            <MenuItem value="todos" sx={{ fontSize: '0.8rem' }}>Todos</MenuItem>
            <MenuItem value="Apartamento" sx={{ fontSize: '0.8rem' }}>Apto</MenuItem>
            <MenuItem value="Casa" sx={{ fontSize: '0.8rem' }}>Casa</MenuItem>
            <MenuItem value="Local" sx={{ fontSize: '0.8rem' }}>Local</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Precio"
          type="number"
          value={filters.precioMax}
          onChange={(e) => handleChange('precioMax', e.target.value)}
          placeholder="Máx"
          sx={{ 
            minWidth: 95, flex: { xs: '1 1 calc(50% - 4px)', sm: '0 0 auto' },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#B8860B' }, fontSize: '0.75rem' },
            '& .MuiOutlinedInput-root': {
              color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1.5, height: 38, fontSize: '0.8rem',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&.Mui-focused fieldset': { borderColor: '#B8860B' },
            }
          }}
        />

        <FormControl size="small" sx={{ minWidth: 85, flex: { xs: '1 1 calc(50% - 4px)', sm: '0 0 auto' }, height: 38 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#B8860B' }, fontSize: '0.75rem' }}>Hab</InputLabel>
          <Select
            value={filters.habitaciones}
            label="Hab"
            onChange={(e) => handleChange('habitaciones', e.target.value)}
            sx={{ 
              color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1.5, height: 38, fontSize: '0.8rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#B8860B' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#232323', color: '#fff', borderRadius: 2 } } }}
          >
            <MenuItem value="todos" sx={{ fontSize: '0.8rem' }}>Todas</MenuItem>
            <MenuItem value="1" sx={{ fontSize: '0.8rem' }}>1+</MenuItem>
            <MenuItem value="2" sx={{ fontSize: '0.8rem' }}>2+</MenuItem>
            <MenuItem value="3" sx={{ fontSize: '0.8rem' }}>3+</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default MapFilters;