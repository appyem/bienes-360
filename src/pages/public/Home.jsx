import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
        Bienes 360º
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Plataforma Inteligente Geoespacial
      </Typography>
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography fontWeight="500">
          Fase 1 - Paso 2 completado con éxito.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Layouts y enrutamiento configurados. Usa el menú inferior para navegar al Mapa.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;