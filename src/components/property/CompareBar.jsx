import { Box, Typography, Button, Chip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../hooks/useCompare'; // <-- Ruta corregida

const CompareBar = () => {
  const { compareList, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        bgcolor: 'primary.main',
        color: 'white',
        px: 3,
        py: 1.5,
        borderRadius: 4,
        boxShadow: '0 8px 24px rgba(26, 58, 82, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        maxWidth: '90%',
      }}
    >
      <CompareArrowsIcon />
      <Typography variant="body2" fontWeight="600" sx={{ whiteSpace: 'nowrap' }}>
        {compareList.length} {compareList.length === 1 ? 'propiedad para comparar' : 'propiedades para comparar'}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, ml: 1, overflow: 'hidden' }}>
        {compareList.map((p) => (
          <Chip 
            key={p.id} 
            label={p.title?.substring(0, 15) + '...'} 
            size="small" 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
          />
        ))}
      </Box>

      <Button 
        variant="contained" 
        size="small" 
        onClick={() => navigate('/comparar')}
        sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' }, ml: 1 }}
      >
        Ver Comparación
      </Button>

      <Button 
        size="small" 
        onClick={clearCompare}
        sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}
      >
        Limpiar
      </Button>
    </Box>
  );
};

export default CompareBar;