import { Box, Typography, Chip, Button, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

const PanoramaMarker = ({ marker, onClose }) => {
  const navigate = useNavigate();

  const statusColors = {
    disponible: { bg: '#4CAF50', label: 'Disponible', icon: '🟢' },
    venta: { bg: '#2196F3', label: 'Venta', icon: '🔵' },
    arriendo: { bg: '#FF9800', label: 'Arriendo', icon: '🟠' },
    cambio: { bg: '#9C27B0', label: 'Cambio', icon: '🟣' },
    subasta: { bg: '#FFD700', label: 'Subasta', icon: '🟡' },
    reservado: { bg: '#F44336', label: 'Reservado', icon: '🔴' },
    vendido: { bg: '#9E9E9E', label: 'Vendido', icon: '⚫' },
  };

  const status = statusColors[marker.status] || statusColors.disponible;

  const handleViewProperty = () => {
    // Navegamos a la página de detalle de la propiedad
    navigate(`/propiedad/${marker.propertyId}`);
  };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'slideUp 0.3s ease-out',
          '@keyframes slideUp': {
            from: { transform: 'translateY(100px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
          },
        }}
      >
        {/* Imagen de la propiedad con botón de cerrar */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="220"
            image={marker.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
            alt={marker.title}
            sx={{ objectFit: 'cover' }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Chip de estado */}
          <Chip
            label={`${status.icon} ${status.label}`}
            size="small"
            sx={{
              mb: 1.5,
              bgcolor: `${status.bg}20`,
              color: status.bg,
              fontWeight: 600,
              border: `1px solid ${status.bg}40`,
            }}
          />

          {/* Título y precio */}
          <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: 'text.primary' }}>
            {marker.title}
          </Typography>
          <Typography variant="h4" fontWeight="800" color="primary.main" sx={{ mb: 2 }}>
            {marker.price}
          </Typography>

          {/* Detalles de la propiedad */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              📍 {marker.neighborhood}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              📐 {marker.area} m²
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              🛏 {marker.rooms} hab
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              🚗 {marker.garages || 0} garajes
            </Typography>
          </Box>

          {/* Botón de acción principal */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            endIcon={<NavigateNextIcon />}
            onClick={handleViewProperty}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(26, 58, 82, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(26, 58, 82, 0.35)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Ver Propiedad
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PanoramaMarker;