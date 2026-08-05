import { useState } from 'react';
import { Box } from '@mui/material';
import MapView from '../../components/map/MapView';
import MapFilters from '../../components/map/MapFilters';
import LayerControl from '../../components/map/LayerControl';

const Map = () => {
  const [filters, setFilters] = useState({ tipo: 'todos', precioMax: '', habitaciones: 'todos' });
  const [activeLayers, setActiveLayers] = useState([]);
  const [baseMap, setBaseMap] = useState('streets');

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  };

  return (
    // CAMBIO CLAVE: 100dvh y overflow hidden bloquean CUALQUIER scroll en móvil
    <Box sx={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}>
      <MapFilters onFilterChange={setFilters} />
      <MapView filters={filters} activeLayers={activeLayers} baseMap={baseMap} />
      <LayerControl 
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
        baseMap={baseMap}
        onBaseMapChange={setBaseMap}
      />
    </Box>
  );
};

export default Map;