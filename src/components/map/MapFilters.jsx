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
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        p: 2,
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: 'center'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 0 } }}>
        <FilterListIcon sx={{ color: 'primary.main' }} />
        <Box component="span" fontWeight="600" fontSize="14px">Filtros</Box>
      </Box>

      <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
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
        sx={{ flex: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
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
        sx={{ minWidth: 80 }}
      >
        Limpiar
      </Button>
    </Paper>
  );
};

export default MapFilters;