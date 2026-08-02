import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, Chip, IconButton, CircularProgress 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../../hooks/useAuth';
import { getFavorites, removeFavorite } from '../../services/favoriteService';
import CompareButton from '../../components/property/CompareButton';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFavorites = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
        if (isMounted) setLoading(true);
        const data = await getFavorites(user.uid);
        if (isMounted) setFavorites(data);
      } catch (error) {
        console.error('Error cargando favoritos:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleRemove = async (propertyId) => {
    try {
      await removeFavorite(user.uid, propertyId);
      setFavorites((prev) => prev.filter(fav => fav.propertyId !== propertyId));
    } catch (error) {
      console.error('Error eliminando favorito:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = { disponible: 'success', vendido: 'error', arrendado: 'info', reservado: 'warning', proximamente: 'default' };
    return colors[status] || 'default';
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <FavoriteIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" fontWeight="600" gutterBottom>
          Inicia sesión para ver tus favoritos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Guarda las propiedades que más te gusten y compáralas después.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 4 }}>
        Mis Propiedades Favoritas
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aún no has guardado ninguna propiedad
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/mapa')} sx={{ mt: 2 }}>
            Explorar el Mapa
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((fav) => (
            <Grid item xs={12} sm={6} md={4} key={fav.propertyId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <IconButton 
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', zIndex: 1, '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
                  onClick={() => handleRemove(fav.propertyId)}
                >
                  <FavoriteIcon color="error" />
                </IconButton>
                
                {fav.image ? (
                  <CardMedia component="img" height="200" image={fav.image} alt={fav.title} sx={{ objectFit: 'cover', cursor: 'pointer' }} onClick={() => navigate(`/propiedad/${fav.propertyId}`)} />
                ) : (
                  <Box sx={{ height: 200, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Sin imagen</Typography>
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/propiedad/${fav.propertyId}`)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>{fav.title}</Typography>
                    <Chip label={fav.status} color={getStatusColor(fav.status)} size="small" />
                  </Box>
                  <Typography variant="h6" fontWeight="700" color="primary.main">
                    {fav.price}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/propiedad/${fav.propertyId}`)}>
                    Ver Detalles
                  </Button>
                  <CompareButton property={{ id: fav.propertyId, title: fav.title, price: fav.price, image: fav.image, status: fav.status }} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;