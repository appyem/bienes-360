import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  // 1. Mostrar spinner mientras verifica el estado de autenticación
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Si no hay usuario, redirigir al login y guardar la ruta a la que quería ir
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si hay roles permitidos definidos y el usuario no tiene uno de ellos, redirigir al inicio
  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Si todo está bien, renderizar la página protegida
  return children;
};

export default ProtectedRoute;