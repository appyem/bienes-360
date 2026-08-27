import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Grid, Select, MenuItem, 
  Paper, IconButton, ImageList, ImageListItem, Alert, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createProperty, updateProperty, getPropertyById } from '../../../services/propertyService';


const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', area: '', rooms: '',
    baths: '', garages: '', type: 'Apartamento', status: 'disponible',
    address: '', neighborhood: '', city: 'Manizales', latitude: '', longitude: '',
    image360: ''
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (!isEditing) return;
    
    let isMounted = true;
    const loadProperty = async () => {
      try {
        if (isMounted) setLoading(true);
        const property = await getPropertyById(id);
        if (isMounted && property) {
          const cityValue = property.city || 'Manizales';
          console.log('🔍 [DEBUG 1] Ciudad cargada de la BD:', cityValue, '| Tipo:', typeof cityValue);
          
          setFormData({
            title: property.title || '',
            description: property.description || '',
            price: property.price || '',
            area: property.area || '',
            rooms: property.rooms || '',
            baths: property.baths || '',
            garages: property.garages || '',
            type: property.type || 'Apartamento',
            status: property.status || 'disponible',
            address: property.address || '',
            neighborhood: property.neighborhood || '',
            city: cityValue,
            latitude: property.latitude || '',
            longitude: property.longitude || '',
            image360: property.image360 || ''
          });
          setExistingImages(property.images || []);
        }
      } catch (error) {
        console.error('Error loading property:', error);
        if (isMounted) setError('Error al cargar la propiedad');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProperty();
    return () => { isMounted = false; };
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔍 [DEBUG 2] handleChange disparado | Campo:', name, '| Nuevo valor:', value);
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      console.log('🔍 [DEBUG 3] Nuevo estado formData.city:', newData.city);
      return newData;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (isEditing) {
        await updateProperty(id, { ...formData, images: existingImages }, images);
        setSuccess('Propiedad actualizada correctamente');
      } else {
        await createProperty(formData, images);
        setSuccess('Propiedad creada correctamente');
      }
      setTimeout(() => navigate('/admin/propiedades'), 1500);
    } catch (error) {
      console.error('Error saving property:', error);
      setError('Error al guardar la propiedad. Intenta nuevamente.');
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

  // LOG DE RENDERIZADO
  console.log('🔍 [DEBUG 4] Renderizando formulario | formData.city actual:', formData.city);

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/admin/propiedades')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="700">
          {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" gutterBottom>Información Básica</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Título" name="title" value={formData.title} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Descripción" name="description" value={formData.description} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Precio (COP)" name="price" value={formData.price} onChange={handleChange} required placeholder="Ej: 450000000" />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Área (m²)" name="area" value={formData.area} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Habitaciones" name="rooms" value={formData.rooms} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Baños" name="baths" value={formData.baths} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Garajes" name="garages" value={formData.garages} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>Tipo <span style={{ color: 'red' }}>*</span></Typography>
              <Select name="type" value={formData.type} onChange={handleChange} fullWidth required sx={{ bgcolor: 'background.paper', borderRadius: 1, '& .MuiSelect-select': { py: 1.5 } }}>
                <MenuItem value="Apartamento">Apartamento</MenuItem>
                <MenuItem value="Casa">Casa</MenuItem>
                <MenuItem value="Local">Local</MenuItem>
                <MenuItem value="Oficina">Oficina</MenuItem>
                <MenuItem value="Bodega">Bodega</MenuItem>
                <MenuItem value="Lote">Lote</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>Estado <span style={{ color: 'red' }}>*</span></Typography>
              <Select name="status" value={formData.status} onChange={handleChange} fullWidth required sx={{ bgcolor: 'background.paper', borderRadius: 1, '& .MuiSelect-select': { py: 1.5 } }}>
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="vendido">Vendido</MenuItem>
                <MenuItem value="arrendado">Arrendado</MenuItem>
                <MenuItem value="reservado">Reservado</MenuItem>
                <MenuItem value="proximamente">Próximamente</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 2 }}>Ubicación</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Dirección" name="address" value={formData.address} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Barrio" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                Ciudad <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Select
                name="city"
                value={formData.city || 'Manizales'}
                onChange={handleChange}
                fullWidth
                required
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiSelect-select': { py: 1.5 }
                }}
              >
                <MenuItem value="Armenia">Armenia</MenuItem>
                <MenuItem value="Manizales">Manizales</MenuItem>
                <MenuItem value="Pereira">Pereira</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Latitud" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Ej: 5.0689" />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Longitud" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Ej: -75.5174" />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 2 }}>Tour Virtual 360°</Typography>
              <TextField
                fullWidth
                label="URL de la imagen equirectangular 360°"
                name="image360"
                value={formData.image360 || ''}
                onChange={handleChange}
                placeholder="https://photo-sphere-viewer.js.org/assets/sphere.jpg"
                helperText="Pega aquí el enlace de la imagen panorámica 360°"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 2 }}>Imágenes</Typography>
              <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Subir Imágenes
                <input type="file" hidden accept="image/*" multiple onChange={handleImageChange} />
              </Button>

              {existingImages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Imágenes actuales:</Typography>
                  <ImageList cols={4} rowHeight={150}>
                    {existingImages.map((img, index) => (
                      <ImageListItem key={index} sx={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }} onClick={() => removeExistingImage(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}

              {images.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Nuevas imágenes a subir:</Typography>
                  <ImageList cols={4} rowHeight={150}>
                    {images.map((img, index) => (
                      <ImageListItem key={index} sx={{ position: 'relative' }}>
                        <img src={URL.createObjectURL(img)} alt="" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }} onClick={() => removeImage(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/admin/propiedades')} disabled={saving}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : (isEditing ? 'Actualizar' : 'Crear')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default PropertyForm;