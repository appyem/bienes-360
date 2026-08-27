import { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, Alert, Select, MenuItem 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadPanorama } from '../../services/panoramaService';

const PanoramaForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    city: 'Manizales', // Valor por defecto seguro
    neighborhood: '',
    sector: '',
    description: '',
    keywords: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await uploadPanorama(formData);

    if (result.success) {
      setMessage({ type: 'success', text: '¡Panorámica subida exitosamente! ID: ' + result.id });
      // Resetear el formulario con el valor por defecto de ciudad
      setFormData({
        title: '', city: 'Manizales', neighborhood: '', sector: '', description: '', keywords: '', imageFile: null,
      });
      // Resetear el input file manualmente
      const fileInput = document.getElementById('panorama-file-input');
      if (fileInput) fileInput.value = '';
    } else {
      setMessage({ type: 'error', text: 'Error: ' + result.error });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: 'primary.main' }}>
        Subir Nueva Panorámica 360°
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Carga la imagen aérea del sector y define sus datos de ubicación para que los usuarios puedan encontrarla.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper 
        elevation={2} 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.8)' }}
      >
        {/* Carga de Imagen */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            Imagen 360° (Equirectangular) <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<CloudUploadIcon />}
            sx={{ py: 2, borderRadius: 2, borderWidth: 2 }}
          >
            {formData.imageFile ? formData.imageFile.name : 'Seleccionar archivo'}
            <input
              id="panorama-file-input"
              type="file"
              hidden
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        {/* Campos de Texto */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <TextField name="title" label="Título del Sector" value={formData.title} onChange={handleChange} required fullWidth />
          
          {/* SELECTOR DE CIUDAD A PRUEBA DE FALLOS */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
              Ciudad <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              name="city"
              value={formData.city}
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

          <TextField name="neighborhood" label="Barrio" value={formData.neighborhood} onChange={handleChange} required fullWidth />
          <TextField name="sector" label="Zona / Sector" value={formData.sector} onChange={handleChange} fullWidth />
        </Box>

        <TextField 
          name="description" 
          label="Descripción del sector" 
          value={formData.description} 
          onChange={handleChange} 
          multiline 
          rows={3} 
          fullWidth 
          sx={{ mb: 3 }} 
        />

        <TextField 
          name="keywords" 
          label="Palabras clave (separadas por comas)" 
          placeholder="ej: residencial, vista a la montaña, cerca al cable"
          value={formData.keywords} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 4 }} 
          helperText="Estas palabras ayudarán al buscador a encontrar esta panorámica."
        />

        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          fullWidth 
          disabled={loading || !formData.imageFile}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          {loading ? 'Subiendo y procesando...' : 'Guardar Panorámica'}
        </Button>
      </Paper>
    </Box>
  );
};

export default PanoramaForm;