import { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, Alert, MenuItem, Grid, InputLabel 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createProperty } from '../../services/propertyService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

const PropertyMarkerForm = () => {
  const viewerRef = useRef(null);
  const viewerContainerRef = useRef(null);
  const [panoramas, setPanoramas] = useState([]);
  const [formData, setFormData] = useState({
    panoramaId: '',
    title: '',
    propertyType: 'apartamento',
    status: 'disponible',
    price: '',
    city: '',
    neighborhood: '',
    area: '',
    rooms: '',
    bathrooms: '',
    garages: '',
    description: '',
    yaw: '',
    pitch: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [markerPlaced, setMarkerPlaced] = useState(false);

  // Cargar panorámicas activas para el selector
  useEffect(() => {
    const fetchPanoramas = async () => {
      try {
        const q = query(collection(db, 'panoramas'), where('isActive', '==', true));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          title: doc.data().title,
          imageUrl: doc.data().imageUrl 
        }));
        setPanoramas(list);
      } catch (error) {
        console.error('Error cargando panorámicas:', error);
      }
    };
    fetchPanoramas();
  }, []);

  // Inicializar visor 360° cuando se selecciona una panorámica
  useEffect(() => {
    if (formData.panoramaId && viewerContainerRef.current) {
      const selectedPanorama = panoramas.find(p => p.id === formData.panoramaId);
      if (selectedPanorama && !viewerRef.current) {
        const newViewer = new Viewer({
          container: viewerContainerRef.current,
          panorama: selectedPanorama.imageUrl,
          navbar: false,
          defaultYaw: 0,
          defaultPitch: 0,
        });
        
        viewerRef.current = newViewer;

        // Listener de clic para capturar coordenadas
        newViewer.addEventListener('click', () => {
          const position = newViewer.getPosition();
          const yaw = (position.yaw * 180 / Math.PI).toFixed(2);
          const pitch = (position.pitch * 180 / Math.PI).toFixed(2);
          
          setFormData(prev => ({
            ...prev,
            yaw: yaw,
            pitch: pitch,
          }));
          setMarkerPlaced(true);
          
          console.log(`✅ Marcador colocado en Yaw: ${yaw}, Pitch: ${pitch}`);
        });
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        setMarkerPlaced(false);
      }
    };
  }, [formData.panoramaId, panoramas]);

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
    
    if (!markerPlaced) {
      setMessage({ type: 'error', text: 'Debes hacer clic en la panorámica para colocar el marcador' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const propertyData = {
        panoramaId: formData.panoramaId,
        title: formData.title,
        propertyType: formData.propertyType,
        status: formData.status,
        price: Number(formData.price),
        city: formData.city,
        neighborhood: formData.neighborhood,
        area: Number(formData.area),
        rooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms),
        garages: Number(formData.garages),
        description: formData.description,
        yaw: Number(formData.yaw),
        pitch: Number(formData.pitch),
      };

      await createProperty(propertyData, formData.imageFile ? [formData.imageFile] : []);

      setMessage({ type: 'success', text: '¡Marcador/Propiedad guardado exitosamente!' });
      
      // Limpiar formulario
      setFormData(prev => ({
        ...prev,
        title: '', price: '', area: '', rooms: '', bathrooms: '', garages: '',
        description: '', yaw: '', pitch: '', imageFile: null,
      }));
      setMarkerPlaced(false);
      document.getElementById('property-image-input').value = '';

    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar: ' + error.message });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: 'primary.main' }}>
        Agregar Propiedad como Marcador 3D
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona una panorámica, haz clic en la imagen para colocar el marcador, y completa los datos de la propiedad.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.8)', mb: 4 }}>
        {/* 1. Selección de Panorámica */}
        <TextField 
          select 
          name="panoramaId" 
          label="Selecciona la Panorámica" 
          value={formData.panoramaId} 
          onChange={handleChange} 
          required 
          fullWidth 
          sx={{ mb: 3 }}
        >
          {panoramas.map((pano) => (
            <MenuItem key={pano.id} value={pano.id}>{pano.title}</MenuItem>
          ))}
        </TextField>

        {/* 2. Visor 360° Interactivo */}
        {formData.panoramaId && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: 'primary.main' }}>
              👆 Haz clic en la imagen para colocar el marcador
            </Typography>
            <Box 
              ref={viewerContainerRef}
              sx={{ 
                width: '100%', 
                height: '400px', 
                borderRadius: 2,
                overflow: 'hidden',
                border: markerPlaced ? '3px solid #4CAF50' : '3px solid #2196F3',
                transition: 'border-color 0.3s ease',
              }}
            />
            {markerPlaced && (
              <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                ✅ Marcador colocado en Yaw: {formData.yaw}°, Pitch: {formData.pitch}°
              </Alert>
            )}
          </Box>
        )}

        {/* 3. Coordenadas (se llenan automáticamente pero se pueden editar) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField 
              name="yaw" 
              label="Yaw (Rotación Horizontal)" 
              type="number" 
              value={formData.yaw} 
              onChange={handleChange} 
              required 
              fullWidth 
              helperText="Se llena automáticamente al hacer clic"
              InputProps={{ readOnly: markerPlaced }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="pitch" 
              label="Pitch (Inclinación Vertical)" 
              type="number" 
              value={formData.pitch} 
              onChange={handleChange} 
              required 
              fullWidth 
              helperText="Se llena automáticamente al hacer clic"
              InputProps={{ readOnly: markerPlaced }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.8)' }}
      >
        {/* 4. Datos Básicos de la Propiedad */}
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: 'primary.main' }}>
          🏠 Datos de la Propiedad
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField name="title" label="Título de la Propiedad" value={formData.title} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select name="status" label="Estado" value={formData.status} onChange={handleChange} required fullWidth>
              <MenuItem value="disponible">Disponible</MenuItem>
              <MenuItem value="venta">Venta</MenuItem>
              <MenuItem value="arriendo">Arriendo</MenuItem>
              <MenuItem value="reservado">Reservado</MenuItem>
              <MenuItem value="vendido">Vendido</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField name="price" label="Precio (solo números)" type="number" value={formData.price} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select name="propertyType" label="Tipo" value={formData.propertyType} onChange={handleChange} required fullWidth>
              <MenuItem value="apartamento">Apartamento</MenuItem>
              <MenuItem value="casa">Casa</MenuItem>
              <MenuItem value="lote">Lote</MenuItem>
              <MenuItem value="local">Local</MenuItem>
              <MenuItem value="oficina">Oficina</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField name="city" label="Ciudad" value={formData.city} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField name="neighborhood" label="Barrio" value={formData.neighborhood} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField name="area" label="Área (m²)" type="number" value={formData.area} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField name="rooms" label="Habitaciones" type="number" value={formData.rooms} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField name="bathrooms" label="Baños" type="number" value={formData.bathrooms} onChange={handleChange} required fullWidth />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField name="garages" label="Garajes" type="number" value={formData.garages} onChange={handleChange} required fullWidth />
          </Grid>
        </Grid>

        <TextField 
          name="description" 
          label="Descripción detallada" 
          value={formData.description} 
          onChange={handleChange} 
          multiline 
          rows={3} 
          fullWidth 
          sx={{ mb: 3 }} 
        />

        {/* 5. Imagen Principal */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Foto Principal de la Propiedad</InputLabel>
          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<CloudUploadIcon />}
            sx={{ py: 2, borderRadius: 2, borderWidth: 2 }}
          >
            {formData.imageFile ? formData.imageFile.name : 'Seleccionar archivo de imagen'}
            <input
              id="property-image-input"
              type="file"
              hidden
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          fullWidth 
          disabled={loading || !formData.imageFile || !formData.panoramaId || !markerPlaced}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          {loading ? 'Guardando en Firebase...' : 'Guardar Marcador 3D'}
        </Button>
      </Paper>
    </Box>
  );
};

export default PropertyMarkerForm;