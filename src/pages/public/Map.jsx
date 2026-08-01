import { Typography, Box } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

const Map = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <MapIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" component="h1" gutterBottom fontWeight="600">
        Mapa Geoespacial
      </Typography>
      <Typography variant="body1" color="text.secondary">
        En la Fase 3 cargaremos aquí los mapas y las ortofotos de los drones.
      </Typography>
    </Box>
  );
};

export default Map;