import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/public/Home';
import Map from './pages/public/Map';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Favorites from './pages/public/Favorites';
import Compare from './pages/public/Compare';
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyList from './pages/admin/properties/PropertyList';
import PropertyForm from './pages/admin/properties/PropertyForm';
import PropertyDetail from './pages/public/PropertyDetail';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { CompareProvider } from './context/CompareProvider';
import CompareBar from './components/property/CompareBar';
import LeadsDashboard from './pages/admin/leads/LeadsDashboard';

function App() {
  return (
    <CompareProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<Map />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/comparar" element={<Compare />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />
          
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/propiedades" 
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <PropertyList />
              </ProtectedRoute>
            } 
          />

                  <Route 
          path="/admin/leads" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <LeadsDashboard />
            </ProtectedRoute>
          } 
        />

          <Route 
            path="/admin/propiedades/nueva" 
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <PropertyForm />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/propiedades/:id/editar" 
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <PropertyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {/* Barra flotante de comparación visible en toda la app */}
      <CompareBar />
    </CompareProvider>
  );
}

export default App;