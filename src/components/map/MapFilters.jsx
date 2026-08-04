import { useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Paper } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

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

  return (
    <Paper 
      elevation={3}
      sx={{
        // CAMBIO CLAVE: En móvil (xs) es 'relative' para empujar el mapa. En desktop (sm+) es 'absolute' para flotar.
        position: { xs: 'relative', sm: 'absolute' },
        top: { xs: 0, sm: 16 },
        left: { xs: 0, sm: 16 },
        right: { xs: 0, sm: 16 },
        zIndex: 1000,
        p: 2,
        borderRadius: { xs: 0, sm: 3 }, // Bordes planos en móvil para aprovechar el espacio
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: 'center',
        mb: { xs: 2, sm: 0 } // Margen inferior en móvil para separarlo del mapa
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 0 } }}>
        <FilterListIcon sx={{ color: 'primary.main' }} />
        <Box component="span" fontWeight="600" fontSize="14px">Filtros</Box>
      </Box>

      <FormControl size="small" sx={{ minWidth: 120, flex: 1, width: '100%' }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          value={filters.tipo}
          label="Tipo"
          onChange={(e) => handleChange('tipo', e.target.value)}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="Apartamento">Apartamento</MenuItem>
          <MenuItem value="Casa">Casa</MenuItem>
          <MenuItem value="Local">Local</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Precio Máx. (COP)"
        type="number"
        value={filters.precioMax}
        onChange={(e) => handleChange('precioMax', e.target.value)}
        placeholder="Ej: 500000000"
        sx={{ flex: 1, width: '100%' }}
      />

      <FormControl size="small" sx={{ minWidth: 100, flex: 1, width: '100%' }}>
        <InputLabel>Hab.</InputLabel>
        <Select
          value={filters.habitaciones}
          label="Hab."
          onChange={(e) => handleChange('habitaciones', e.target.value)}
        >
          <MenuItem value="todos">Todas</MenuItem>
          <MenuItem value="1">1+</MenuItem>
          <MenuItem value="2">2+</MenuItem>
          <MenuItem value="3">3+</MenuItem>
          <MenuItem value="4">4+</MenuItem>
        </Select>
      </FormControl>

      <Button 
        variant="text" 
        size="small" 
        onClick={() => {
          const resetFilters = { tipo: 'todos', precioMax: '', habitaciones: 'todos' };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        sx={{ minWidth: 80, width: { xs: '100%', sm: 'auto' } }}
      >
        Limpiar
      </Button>
    </Paper>
  );
};

export default MapFilters;