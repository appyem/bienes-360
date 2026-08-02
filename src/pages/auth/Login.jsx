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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/perfil');
   } catch (error) {
      console.error('Error de login:', error);
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
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

    <Box sx={{ textAlign: 'center', mb: 3 }}>
  <img 
    src="/logo.png" 
    alt="Bienes 360°" 
    style={{ 
      height: '80px', 
      width: 'auto',
      marginBottom: '16px'
    }} 
  />
  <Typography variant="h4" fontWeight="700" color="primary.main" gutterBottom>
    Bienvenido
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Todo en bienes raíces, en un solo lugar
  </Typography>
</Box>



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
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Accede a tu cuenta de Bienes 360º
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          ¿No tienes cuenta?{' '}
          <Link component={RouterLink} to="/registro" underline="hover" fontWeight="500">
            Regístrate aquí
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;