import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Card, CardMedia, CardContent, 
  CardActions, Grid, Chip, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllProperties, deleteProperty } from '../../../services/propertyService';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const loadProperties = async () => {
      try {
        if (isMounted) setLoading(true);
        const data = await getAllProperties();
        if (isMounted) setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await deleteProperty(propertyToDelete.id);
      setProperties((prev) => prev.filter(p => p.id !== propertyToDelete.id));
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      disponible: 'success',
      vendido: 'error',
      arrendado: 'info',
      reservado: 'warning',
      proximamente: 'default'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="700">Gestión de Propiedades</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/propiedades/nueva')}>
          Nueva Propiedad
        </Button>
      </Box>

      {properties.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>No hay propiedades registradas</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/admin/propiedades/nueva')}>
            Crear primera propiedad
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {property.images && property.images.length > 0 ? (
                  <CardMedia component="img" height="200" image={property.images[0]} alt={property.title} sx={{ objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ height: 200, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Sin imagen</Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>{property.title}</Typography>
                    <Chip label={property.status} color={getStatusColor(property.status)} size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{property.address}</Typography>
                  <Typography variant="h6" fontWeight="700" color="primary.main" sx={{ mt: 1 }}>{property.price}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 2, fontSize: '14px', color: 'text.secondary' }}>
                    <span>📐 {property.area}</span>
                    <span>🛏️ {property.rooms}</span>
                    <span>🚿 {property.baths}</span>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button size="small" onClick={() => navigate(`/admin/propiedades/${property.id}/editar`)}>Ver detalles</Button>
                  <Box>
                    <IconButton size="small" onClick={() => navigate(`/admin/propiedades/${property.id}/editar`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => { setPropertyToDelete(property); setDeleteDialogOpen(true); }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar la propiedad "{propertyToDelete?.title}"?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyList;