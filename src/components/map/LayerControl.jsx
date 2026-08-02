import { useState } from 'react';
import { Paper, Box, Typography, Switch, FormControlLabel, IconButton, Collapse } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import CloseIcon from '@mui/icons-material/Close';

const LayerControl = ({ activeLayers, onLayerToggle, baseMap, onBaseMapChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const infoLayers = [
    { id: 'colegios', label: 'Colegios', icon: '🏫' },
    { id: 'hospitales', label: 'Hospitales', icon: '🏥' },
    { id: 'parques', label: 'Parques', icon: '🌳' },
    { id: 'transporte', label: 'Transporte', icon: '🚌' },
    { id: 'comercios', label: 'Comercios', icon: '🏪' }
  ];

  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 24,
        right: 16,
        zIndex: 1000,
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      {/* Botón para abrir/cerrar */}
      <IconButton 
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: '50%',
          m: 1,
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        {isOpen ? <CloseIcon /> : <LayersIcon />}
      </IconButton>

      {/* Panel desplegable */}
      <Collapse in={isOpen}>
        <Box sx={{ p: 2, minWidth: 220, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            Tipo de Mapa
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Box
              onClick={() => onBaseMapChange('streets')}
              sx={{
                flex: 1,
                p: 1.5,
                border: '2px solid',
                borderColor: baseMap === 'streets' ? 'primary.main' : 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: baseMap === 'streets' ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              🗺️ Calles
            </Box>
            <Box
              onClick={() => onBaseMapChange('satellite')}
              sx={{
                flex: 1,
                p: 1.5,
                border: '2px solid',
                borderColor: baseMap === 'satellite' ? 'primary.main' : 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: baseMap === 'satellite' ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              🛰️ Satélite
            </Box>
          </Box>

          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            Capas de Información
          </Typography>

          {infoLayers.map((layer) => (
            <FormControlLabel
              key={layer.id}
              control={
                <Switch
                  size="small"
                  checked={activeLayers.includes(layer.id)}
                  onChange={() => onLayerToggle(layer.id)}
                />
              }
              label={
                <Box component="span" sx={{ fontSize: '13px' }}>
                  {layer.icon} {layer.label}
                </Box>
              }
              sx={{ display: 'block', mb: 0.5 }}
            />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default LayerControl;