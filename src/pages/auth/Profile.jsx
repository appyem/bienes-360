import { Box, Paper, Typography, Button, Avatar } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Profile = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getRoleName = (role) => {
    const roles = {
      superadmin: 'Super Administrador',
      admin: 'Administrador Inmobiliaria',
      advisor: 'Asesor Comercial',
      client: 'Cliente Público'
    };
    return roles[role] || 'Cliente';
  };

  // 1. Si no hay usuario logueado, redirigir al login
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, px: 2 }}>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
      </Box>
    );
  }

  // 2. Si hay usuario pero NO hay perfil en Firestore (tu caso actual)
  if (!userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, px: 2 }}>
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', maxWidth: 400, width: '100%' }}>
          <Typography variant="h6" fontWeight="600" gutterBottom color="error">
            Perfil incompleto
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tu cuenta existe, pero no se pudo guardar tu perfil en la base de datos en un intento anterior.
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout} sx={{ width: '100%' }}>
            Cerrar sesión y registrarse de nuevo
          </Button>
        </Paper>
      </Box>
    );
  }

  // 3. Si todo está bien, mostrar el perfil normal
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 4 }, px: 2 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 500, 
          border: '1px solid', 
          borderColor: 'divider', 
          textAlign: 'center' 
        }}
      >
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2, 
            bgcolor: 'primary.main', 
            color: 'background.paper',
            fontSize: 32,
            fontWeight: 600
          }}
        >
          {userProfile.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </Avatar>
        
        <Typography variant="h5" fontWeight="600" gutterBottom>
          {userProfile.displayName}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
        
        <Box sx={{ my: 2, px: 2, py: 1, bgcolor: 'background.default', borderRadius: 1, display: 'inline-block' }}>
          <Typography variant="body2" fontWeight="600" color="primary.main">
            {getRoleName(userProfile.role)}
          </Typography>
        </Box>

        {userProfile.role === 'superadmin' && (
          <Button 
            variant="contained" 
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => navigate('/admin')} 
            sx={{ mt: 2, mb: 2, width: '100%', py: 1.5 }}
          >
            Ir al Panel de Administración
          </Button>
        )}
        
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleLogout} 
          sx={{ mt: 2, width: '100%', py: 1.5 }}
        >
          Cerrar Sesión
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;