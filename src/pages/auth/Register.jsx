import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Link
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, displayName);
      navigate('/perfil');
     } catch (error) {
      console.error('Error de registro:', error);
      setError('Error al crear la cuenta. Verifica los datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 200px)',
      px: 2
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 400,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h5" fontWeight="600" gutterBottom textAlign="center">
          Crear Cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Únete a Bienes 360º
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre completo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            helperText="Mínimo 6 caracteres"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta?{' '}
          <Link component={RouterLink} to="/login" underline="hover" fontWeight="500">
            Inicia sesión aquí
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;