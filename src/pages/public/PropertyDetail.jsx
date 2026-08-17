import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Grid, Paper, Chip, 
  ImageList, ImageListItem, CircularProgress, Divider, IconButton
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
import ContactForm from '../../components/property/ContactForm';

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
    <>
      {/* MARCA DE AGUA ANIMADA DE FONDO */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Box component="img" src="/logo.png" alt="Marca de agua" sx={{ width: '60vw', maxWidth: '800px', opacity: 0.04, filter: 'grayscale(100%) brightness(500%)', animation: 'floatWatermark 25s ease-in-out infinite', '@keyframes floatWatermark': { '0%': { transform: 'translate(-30%, -30%) rotate(-5deg) scale(1)' }, '25%': { transform: 'translate(-20%, -40%) rotate(0deg) scale(1.05)' }, '50%': { transform: 'translate(-40%, -20%) rotate(5deg) scale(0.95)' }, '75%': { transform: 'translate(-30%, -30%) rotate(-2deg) scale(1.02)' }, '100%': { transform: 'translate(-30%, -30%) rotate(-5deg) scale(1)' } } }} />
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 2 } }}>
        
        {/* CABECERA RESPONSIVE: Iconos en móvil, Botones con texto en PC */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          
          {/* Botón Volver */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ display: { xs: 'flex', sm: 'none' }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', width: 40, height: 40 }}>
              <ArrowBackIcon />
            </IconButton>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              Volver
            </Button>
          </Box>

          {/* Botón Favorito */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={handleToggleFavorite}
              disabled={favLoading}
              sx={{ 
                display: { xs: 'flex', sm: 'none' },
                bgcolor: isFav ? 'rgba(244, 67, 54, 0.1)' : 'background.paper',
                border: '1px solid',
                borderColor: isFav ? 'error.main' : 'divider',
                color: isFav ? 'error.main' : 'text.primary',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: isFav ? 'rgba(244, 67, 54, 0.2)' : 'action.hover' }
              }}
            >
              {favLoading ? <CircularProgress size={20} /> : (isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />)}
            </IconButton>

            <Button 
              variant={isFav ? "contained" : "outlined"}
              color={isFav ? "error" : "primary"}
              startIcon={isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleToggleFavorite}
              disabled={favLoading}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                fontWeight: 600,
                boxShadow: isFav ? '0 4px 6px rgba(244, 67, 54, 0.3)' : 'none'
              }}
            >
              {favLoading ? 'Guardando...' : (isFav ? 'Guardado en Favoritos' : 'Guardar en Favoritos')}
            </Button>
          </Box>
        </Box>

        <Typography variant="h3" fontWeight="700" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '3rem' }, wordBreak: 'break-word' }}>
          {property.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Typography variant="h4" fontWeight="700" color="primary.main" sx={{ fontSize: { xs: '1.25rem', sm: '2.125rem' }, wordBreak: 'break-word' }}>
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(String(property.price).replace(/[^0-9.-]+/g, '')) || 0)}
          </Typography>
          <Chip label={property.status} color={getStatusColor(property.status)} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 4 }}>
          <LocationOnIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{property.address}, {property.neighborhood}, {property.city}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          <Button variant={activeTab === '360' ? 'contained' : 'text'} onClick={() => setActiveTab('360')} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
            Tour Virtual 360°
          </Button>
          <Button variant={activeTab === 'galeria' ? 'contained' : 'text'} onClick={() => setActiveTab('galeria')} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
            Galería de Fotos
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          {activeTab === '360' ? (
            property.image360 ? (
              <Property360Viewer imageUrl={property.image360} title={property.title} />
            ) : (
              <Box sx={{ p: { xs: 4, sm: 8 }, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>📷 No hay recorrido 360° interno disponible.</Typography>
                <Typography variant="body2" color="text.secondary">Revisa la pestaña "Galería de Fotos" o contacta al agente.</Typography>
              </Box>
            )
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

        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Descripción</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', mb: 3, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {property.description || 'Sin descripción disponible.'}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Características</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SquareFootIcon color="action" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Área</Typography>
                      <Typography fontWeight="600">{property.area} m²</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BedIcon color="action" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Habitaciones</Typography>
                      <Typography fontWeight="600">{property.rooms}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BathtubIcon color="action" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Baños</Typography>
                      <Typography fontWeight="600">{property.bathrooms || property.baths || '0'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon color="action" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Garajes</Typography>
                      <Typography fontWeight="600">{property.garages || '0'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: '1px solid', borderColor: 'divider', position: { xs: 'static', md: 'sticky' }, top: 24 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>¿Te interesa esta propiedad?</Typography>
              
              <Button variant="text" fullWidth startIcon={<PictureAsPdfIcon color="error" />} onClick={() => generatePropertyPdf(property)} sx={{ py: 1.5, mb: 2, color: 'text.secondary', textTransform: 'none' }}>
                Descargar Ficha PDF
              </Button>

              <ContactForm property={property} />

              {property.status === 'venta' && (
                <FinancialCalculator propertyPrice={property.price} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PropertyDetail;