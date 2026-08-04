import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, 
  Chip, CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllPanoramas, deletePanorama } from '../../services/panoramaService';

const PanoramaList = () => {
  const navigate = useNavigate();
  const [panoramas, setPanoramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [panoramaToDelete, setPanoramaToDelete] = useState(null);

  // EFECTO ASÍNCRONO CORREGIDO (Evita setState síncrono)
  useEffect(() => {
    let isMounted = true;
    
    const fetchPanoramas = async () => {
      try {
        const data = await getAllPanoramas();
        if (isMounted) {
          setPanoramas(data);
        }
      } catch (error) {
        console.error('Error cargando panorámicas:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPanoramas();

    // Limpieza para evitar memory leaks si el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDeleteDialog = (panorama) => {
    setPanoramaToDelete(panorama);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPanoramaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!panoramaToDelete) return;
    
    try {
      const result = await deletePanorama(panoramaToDelete.id);
      if (result.success) {
        setPanoramas(prev => prev.filter(p => p.id !== panoramaToDelete.id));
      } else {
        alert('Error al eliminar: ' + result.error);
      }
    } catch (error) {
      console.error('Error eliminando panorámica:', error);
      alert('Ocurrió un error al eliminar la panorámica.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ py: 4, maxWidth: 1200, mx: 'auto', px: 2 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin')} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="700">
            Gestionar Panorámicas 360°
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/panoramas/nueva')}
          sx={{ borderRadius: 2, fontWeight: 600, py: 1 }}
        >
          Subir Nueva Panorámica
        </Button>
      </Box>

      {/* Tabla de Panorámicas */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : panoramas.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay panorámicas registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comienza subiendo tu primera imagen 360° del sector.
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/panoramas/nueva')}
          >
            Subir Primera Panorámica
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ciudad / Barrio</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha de Subida</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {panoramas.map((pano) => (
                <TableRow key={pano.id} hover>
                  <TableCell>
                    <Typography fontWeight="600">{pano.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{pano.sector || 'Sin sector'}</Typography>
                  </TableCell>
                  <TableCell>
                    {pano.city}
                    {pano.neighborhood && <Typography variant="caption" display="block" color="text.secondary">{pano.neighborhood}</Typography>}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={pano.isActive ? 'Activa' : 'Inactiva'} 
                      size="small"
                      color={pano.isActive ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(pano.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/admin/panoramas/${pano.id}/editar`)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(pano)}
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>¿Eliminar esta panorámica?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de eliminar <strong>"{panoramaToDelete?.title}"</strong>. 
            Esta acción también borrará la imagen de Firebase Storage y no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PanoramaList;