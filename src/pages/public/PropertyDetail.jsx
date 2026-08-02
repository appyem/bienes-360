import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Grid, Paper, Chip, 
  ImageList, ImageListItem, CircularProgress, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { getPropertyById } from '../../services/propertyService';
import { addFavorite, removeFavorite, isFavorite } from '../../services/favoriteService';
import { useAuth } from '../../hooks/useAuth';
import Property360Viewer from '../../components/property/Property360Viewer';
import FinancialCalculator from '../../components/property/FinancialCalculator';
import { generatePropertyPdf } from '../../utils/generatePropertyPdf';
import ContactForm from '../../components/property/ContactForm'; // <-- Nuevo import

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('360');
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProperty = async () => {
      try {
        if (isMounted) setLoading(true);
        const data = await getPropertyById(id);
        if (isMounted) setProperty(data);
      } catch (error) {
        console.error('Error loading property:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProperty();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    if (user && property) {
      const checkFavorite = async () => {
        try {
          const fav = await isFavorite(user.uid, id);
          if (isMounted) setIsFav(fav);
        } catch (error) {
          console.error('Error verificando favorito:', error);
        }
      };
      checkFavorite();
    }
    return () => { isMounted = false; };
  }, [user, property, id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(user.uid, id);
      } else {
        await addFavorite(user.uid, property);
      }
      setIsFav(!isFav);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Propiedad no encontrada</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Volver al inicio</Button>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    const colors = { disponible: 'success', vendido: 'error', arrendado: 'info', reservado: 'warning', proximamente: 'default' };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ py: 4, maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
          Volver
        </Button>
        
        <Button 
          variant={isFav ? "contained" : "outlined"}
          color={isFav ? "error" : "primary"}
          startIcon={isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleToggleFavorite}
          disabled={favLoading}
          sx={{ 
            fontWeight: 600,
            boxShadow: isFav ? '0 4px 6px rgba(244, 67, 54, 0.3)' : 'none'
          }}
        >
          {favLoading ? 'Guardando...' : (isFav ? 'Guardado en Favoritos' : 'Guardar en Favoritos')}
        </Button>
      </Box>

      <Typography variant="h3" fontWeight="700" gutterBottom>
        {property.title}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h4" fontWeight="700" color="primary.main">
          {property.price}
        </Typography>
        <Chip label={property.status} color={getStatusColor(property.status)} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 4 }}>
        <LocationOnIcon />
        <Typography>{property.address}, {property.neighborhood}, {property.city}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        <Button variant={activeTab === '360' ? 'contained' : 'text'} onClick={() => setActiveTab('360')}>
          Tour Virtual 360°
        </Button>
        <Button variant={activeTab === 'galeria' ? 'contained' : 'text'} onClick={() => setActiveTab('galeria')}>
          Galería de Fotos
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        {activeTab === '360' ? (
          <Property360Viewer imageUrl={property.image360} title={property.title} />
        ) : (
          <ImageList cols={{ xs: 1, sm: 2, md: 3 }} gap={16}>
            {property.images && property.images.length > 0 ? (
              property.images.map((img, index) => (
                <ImageListItem key={index}>
                  <img src={img} alt={`Foto ${index + 1}`} style={{ borderRadius: 8, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </ImageListItem>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ p: 4 }}>No hay imágenes disponibles.</Typography>
            )}
          </ImageList>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="600" gutterBottom>Descripción</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {property.description || 'Sin descripción disponible.'}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h5" fontWeight="600" gutterBottom>Características</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SquareFootIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Área</Typography>
                    <Typography fontWeight="600">{property.area}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Habitaciones</Typography>
                    <Typography fontWeight="600">{property.rooms}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathtubIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Baños</Typography>
                    <Typography fontWeight="600">{property.baths}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Garajes</Typography>
                    <Typography fontWeight="600">{property.garages || '0'}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar Derecho: Contacto, PDF y Calculadora */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 24 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>¿Te interesa esta propiedad?</Typography>
            
            <Button 
              variant="text" 
              fullWidth 
              startIcon={<PictureAsPdfIcon color="error" />}
              onClick={() => generatePropertyPdf(property)}
              sx={{ py: 1.5, mb: 2, color: 'text.secondary', textTransform: 'none' }}
            >
              Descargar Ficha PDF
            </Button>

            {/* Formulario de Contacto / Leads */}
            <ContactForm property={property} />

            {/* Calculadora Financiera */}
            <FinancialCalculator propertyPrice={property.price} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyDetail;