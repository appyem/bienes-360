import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';

const AdminDashboard = () => {
  const stats = [
    { title: 'Inmobiliarias', value: '0', icon: <BusinessIcon sx={{ fontSize: 40 }} />, color: '#000000' },
    { title: 'Usuarios Totales', value: '1', icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#333333' },
    { title: 'Propiedades', value: '0', icon: <MapIcon sx={{ fontSize: 40 }} />, color: '#666666' },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="700">
          Panel de Super Administrador
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Control absoluto del sistema. Desde aquí podrás gestionar inmobiliarias, configuraciones globales y métricas.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" fontWeight="700">
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color, opacity: 0.8 }}>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (Estas funcionalidades se desarrollarán en la Fase 2, Paso 4 y Fase 3)
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;