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
      elevation={0}
      sx={{
        // CAMBIOS CLAVE: 'fixed' y zIndex máximo para estar sobre TODO (incluido el BottomNav)
        position: 'fixed',
        bottom: { xs: 90, sm: 80 }, 
        right: 16,
        zIndex: 9999, 
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'rgba(35, 35, 35, 0.9)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}
    >
      <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '50%', m: 1, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
        {isOpen ? <CloseIcon /> : <LayersIcon />}
      </IconButton>

      <Collapse in={isOpen}>
        <Box sx={{ p: 2, minWidth: 220, borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>Tipo de Mapa</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Box onClick={() => onBaseMapChange('streets')} sx={{ flex: 1, p: 1.5, border: '2px solid', borderColor: baseMap === 'streets' ? '#B8860B' : 'rgba(255,255,255,0.2)', borderRadius: 2, cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: baseMap === 'streets' ? '600' : '400', color: baseMap === 'streets' ? '#B8860B' : 'rgba(255,255,255,0.7)', bgcolor: baseMap === 'streets' ? 'rgba(184, 134, 11, 0.1)' : 'transparent' }}>🗺️ Calles</Box>
            <Box onClick={() => onBaseMapChange('satellite')} sx={{ flex: 1, p: 1.5, border: '2px solid', borderColor: baseMap === 'satellite' ? '#B8860B' : 'rgba(255,255,255,0.2)', borderRadius: 2, cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: baseMap === 'satellite' ? '600' : '400', color: baseMap === 'satellite' ? '#B8860B' : 'rgba(255,255,255,0.7)', bgcolor: baseMap === 'satellite' ? 'rgba(184, 134, 11, 0.1)' : 'transparent' }}>🛰️ Satélite</Box>
          </Box>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>Capas</Typography>
          {infoLayers.map((layer) => (
            <FormControlLabel key={layer.id} control={<Switch size="small" checked={activeLayers.includes(layer.id)} onChange={() => onLayerToggle(layer.id)} sx={{ '& .MuiSwitch-thumb': { bgcolor: '#fff' }, '& .MuiSwitch-track': { bgcolor: 'rgba(255,255,255,0.3)' }, '&.Mui-checked .MuiSwitch-track': { bgcolor: '#B8860B' } }} />} label={<Box component="span" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{layer.icon} {layer.label}</Box>} sx={{ display: 'block', mb: 0.5 }} />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default LayerControl;