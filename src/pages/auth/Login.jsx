import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, Paper, Link, Alert 
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

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
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 150px)',
      px: 2 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%', 
          maxWidth: 500, /* Un poco más ancho para acomodar el logo grande */
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.8)' 
        }}
      >
        {/* LOGO OFICIAL 3 VECES MÁS GRANDE */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box 
            component="img"
            src={logo}
            alt="Bienes 360° Logo"
            sx={{ 
              height: 240, /* 80px * 3 = 240px */
              width: 'auto', 
              maxWidth: '100%', /* Para que no se salga en pantallas muy pequeñas */
              objectFit: 'contain',
              mb: 3,
              filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.08))' /* Sombra un poco más pronunciada para el tamaño grande */
            }} 
          />
          <Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ingresa a tu cuenta de Bienes 360º
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 4 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            disabled={loading}
            sx={{ mb: 3, py: 1.5 }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes una cuenta?{' '}
              <Link component={RouterLink} to="/registro" underline="hover" fontWeight="600" color="primary.main">
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;