import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, Paper, Alert, CircularProgress, Select, MenuItem 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { updatePanorama } from '../../services/panoramaService';

const PanoramaEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    city: 'Manizales', // Valor por defecto seguro
    neighborhood: '',
    sector: '',
    description: '',
    keywords: '',
    imageFile: null,
  });

  // Cargar datos de la panorámica al montar
  useEffect(() => {
    const fetchPanorama = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'panoramas', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            city: data.city ? data.city.charAt(0).toUpperCase() + data.city.slice(1).toLowerCase() : 'Manizales',
            neighborhood: data.neighborhood || '',
            sector: data.sector || '',
            description: data.description || '',
            keywords: data.keywords ? data.keywords.join(', ') : '',
            imageFile: null,
          });
        } else {
          setMessage({ type: 'error', text: 'Panorámica no encontrada.' });
        }
      } catch (error) {
        console.error('Error cargando panorámica:', error);
        setMessage({ type: 'error', text: 'Error al cargar los datos.' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPanorama();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToUpdate = {
        title: formData.title,
        city: formData.city,
        neighborhood: formData.neighborhood,
        sector: formData.sector,
        description: formData.description,
        keywords: formData.keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== ''),
      };

      const result = await updatePanorama(id, dataToUpdate, formData.imageFile);
      
      if (result.success) {
        setMessage({ type: 'success', text: '¡Panorámica actualizada exitosamente!' });
        setTimeout(() => navigate('/admin/panoramas'), 1500);
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar: ' + result.error });
      }
    } catch (error) {
      console.error('Error guardando cambios:', error);
      setMessage({ type: 'error', text: 'Ocurrió un error inesperado.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/admin/panoramas')}
          sx={{ mr: 2 }}
        >
          Volver a la lista
        </Button>
        <Typography variant="h4" fontWeight="700">
          Editar Panorámica
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.8)' }}
      >
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 3, color: 'primary.main' }}>
          📝 Datos de la Panorámica
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            name="title" 
            label="Título" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            fullWidth 
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* SELECTOR DE CIUDAD A PRUEBA DE FALLOS PARA EDICIÓN */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                Ciudad <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                name="city"
                value={formData.city || 'Manizales'}
                onChange={handleChange}
                required
                fullWidth
                sx={{ borderRadius: 2, bgcolor: 'background.paper', '& .MuiSelect-select': { py: 1.5 } }}
              >
                <MenuItem value="Armenia">Armenia</MenuItem>
                <MenuItem value="Manizales">Manizales</MenuItem>
                <MenuItem value="Pereira">Pereira</MenuItem>
              </Select>
            </Box>
            
            <TextField 
              name="neighborhood" 
              label="Barrio" 
              value={formData.neighborhood} 
              onChange={handleChange} 
              fullWidth 
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField 
            name="sector" 
            label="Sector / Zona" 
            value={formData.sector} 
            onChange={handleChange} 
            fullWidth 
          />

          <TextField 
            name="keywords" 
            label="Palabras clave (separadas por coma)" 
            value={formData.keywords} 
            onChange={handleChange} 
            fullWidth 
            helperText="Ej: vista al mar, cerca al parque, zona segura"
          />

          <TextField 
            name="description" 
            label="Descripción" 
            value={formData.description} 
            onChange={handleChange} 
            multiline 
            rows={4} 
            fullWidth 
          />

          <Box sx={{ mt: 2, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
              🔄 Reemplazar Imagen 360° (Opcional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Si seleccionas una nueva imagen, la anterior se eliminará automáticamente de Firebase Storage.
            </Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ py: 2, borderRadius: 2, borderWidth: 2 }}
            >
              {formData.imageFile ? formData.imageFile.name : 'Seleccionar nueva imagen 360°'}
              <input
                type="file"
                hidden
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button 
              type="button" 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate('/admin/panoramas')}
              disabled={saving}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={saving}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
            >
              {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PanoramaEditForm;