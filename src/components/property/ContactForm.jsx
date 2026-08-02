import { useState } from 'react';
import { 
  Box, Typography, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, Alert, Paper 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { createLead } from '../../services/leadService';

const ContactForm = ({ property }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'visita' // 'visita' o 'informacion'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createLead({
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.price
      });
      
      setSuccess(true);
      // Limpiar formulario
      setFormData({ name: '', email: '', phone: '', message: '', type: 'visita' });
    } catch (err) {
      console.error(err);
      setError('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main">
        📩 Contáctanos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Déjanos tus datos y un asesor se comunicará contigo.
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Solicitud enviada! Un asesor te contactará pronto.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Tipo de solicitud</InputLabel>
          <Select
            name="type"
            value={formData.type}
            label="Tipo de solicitud"
            onChange={handleChange}
          >
            <MenuItem value="visita">Agendar Visita</MenuItem>
            <MenuItem value="informacion">Más Información</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          label="Nombre completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Teléfono / WhatsApp"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Mensaje (Opcional)"
          name="message"
          multiline
          rows={3}
          value={formData.message}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          endIcon={<SendIcon />}
          disabled={loading}
          sx={{ py: 1.5, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ContactForm;