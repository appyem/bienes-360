import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, 
  Select, MenuItem, FormControl, CircularProgress, IconButton
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { getLeads, updateLeadStatus } from '../../../services/leadService';

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchLeads = async () => {
      try {
        if (isMounted) setLoading(true);
        const data = await getLeads();
        if (isMounted) setLeads(data);
      } catch (error) {
        console.error('Error cargando leads:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLeads();
    return () => { isMounted = false; };
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 4 }}>
        Gestión de Leads (CRM)
      </Typography>

      {leads.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aún no hay solicitudes de clientes.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Contacto</strong></TableCell>
                <TableCell><strong>Propiedad</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">{lead.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.email}</Typography>
                    <Typography variant="caption" color="text.secondary">{lead.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate(`/propiedad/${lead.propertyId}`)}>
                      {lead.propertyTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {lead.propertyPrice}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.type === 'visita' ? 'Agendar Visita' : 'Más Info'} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <Select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        sx={{ 
                          bgcolor: 'background.default',
                          '& .MuiSelect-select': { py: 0.5 }
                        }}
                      >
                        <MenuItem value="nuevo">🔵 Nuevo</MenuItem>
                        <MenuItem value="contactado">🟡 Contactado</MenuItem>
                        <MenuItem value="visitado">🟣 Visitado</MenuItem>
                        <MenuItem value="cerrado">🟢 Cerrado (Venta)</MenuItem>
                        <MenuItem value="perdido">🔴 Perdido</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/propiedad/${lead.propertyId}`)}
                      title="Ver Propiedad"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LeadsDashboard;