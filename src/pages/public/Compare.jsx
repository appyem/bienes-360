import { Box, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../hooks/useCompare';

const parsePrice = (price) => {
  return Number(String(price).replace(/[^0-9.-]+/g, '')) || 0;
};

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          No hay propiedades para comparar
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Añade propiedades desde el listado o desde tus favoritos.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/mapa')}>
          Explorar el Mapa
        </Button>
      </Box>
    );
  }

  const prices = compareList.map(p => parsePrice(p.price));
  const minPrice = Math.min(...prices);
  const maxArea = Math.max(...compareList.map(p => Number(p.area) || 0));
  const maxRooms = Math.max(...compareList.map(p => Number(p.rooms) || 0));
  const maxBaths = Math.max(...compareList.map(p => Number(p.baths) || 0));

  const getStatusColor = (status) => {
    const colors = { disponible: 'success', vendido: 'error', arrendado: 'info', reservado: 'warning', proximamente: 'default' };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
          Volver
        </Button>
        <Typography variant="h4" fontWeight="700" sx={{ ml: 2 }}>
          Comparador de Propiedades
        </Typography>
        <Button variant="text" color="error" onClick={clearCompare} sx={{ ml: 'auto' }}>
          Limpiar Todo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {compareList.map((property) => {
          const price = parsePrice(property.price);
          const area = Number(property.area) || 0;
          const rooms = Number(property.rooms) || 0;
          const baths = Number(property.baths) || 0;

          return (
            <Grid item xs={12} md={4} key={property.id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  border: '2px solid',
                  borderColor: price === minPrice ? 'secondary.main' : 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {price === minPrice && (
                  <Chip 
                    label="Mejor Precio" 
                    color="secondary" 
                    size="small"
                    sx={{ position: 'absolute', top: -12, right: 16, fontWeight: 700 }}
                  />
                )}

                {property.image ? (
                  <Box 
                    component="img" 
                    src={property.image} 
                    alt={property.title}
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      objectFit: 'cover', 
                      borderRadius: 2,
                      mb: 2,
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/propiedad/${property.id}`)}
                  />
                ) : (
                  <Box sx={{ height: 200, bgcolor: 'grey.200', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Sin imagen</Typography>
                  </Box>
                )}

                <Typography 
                  variant="h6" 
                  fontWeight="700" 
                  gutterBottom
                  sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                  onClick={() => navigate(`/propiedad/${property.id}`)}
                >
                  {property.title}
                </Typography>

                <Chip 
                  label={property.status} 
                  color={getStatusColor(property.status)} 
                  size="small" 
                  sx={{ mb: 2, alignSelf: 'flex-start' }}
                />

                <Typography variant="h5" fontWeight="800" color="primary.main" sx={{ mb: 2 }}>
                  {property.price}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SquareFootIcon color="action" />
                      <Typography variant="body2">Área</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="700" color={area === maxArea ? 'secondary.main' : 'text.primary'}>
                      {property.area} {area === maxArea && '🏆'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BedIcon color="action" />
                      <Typography variant="body2">Habitaciones</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="700" color={rooms === maxRooms ? 'secondary.main' : 'text.primary'}>
                      {property.rooms} {rooms === maxRooms && '🏆'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BathtubIcon color="action" />
                      <Typography variant="body2">Baños</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="700" color={baths === maxBaths ? 'secondary.main' : 'text.primary'}>
                      {property.baths} {baths === maxBaths && '🏆'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsCarIcon color="action" />
                      <Typography variant="body2">Garajes</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="700">
                      {property.garages || '0'}
                    </Typography>
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 3, bgcolor: 'primary.main' }}
                  onClick={() => navigate(`/propiedad/${property.id}`)}
                >
                  Ver Detalles
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/mapa')} sx={{ mr: 2 }}>
          Seguir Explorando
        </Button>
        <Button variant="text" color="error" onClick={clearCompare}>
          Limpiar Comparación
        </Button>
      </Box>
    </Box>
  );
};

export default Compare;