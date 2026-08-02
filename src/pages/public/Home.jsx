import { useRef, useEffect } from 'react';
import { Box, Typography, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

const Home = () => {
  const viewerRef = useRef(null);

    useEffect(() => {
    const container = document.querySelector('#panorama-viewer');
    console.log('🔍 ¿Contenedor encontrado?', container ? 'SÍ ✅' : 'NO ❌');
    
    if (container && !viewerRef.current) {
      console.log('🔍 Inicializando visor...');
      
      // TRUCO: Agregamos ?v=timestamp para engañar al navegador y forzar una descarga fresca siempre
      const imageUrl = `/panoramicas/alta-suiza.jpeg?v=${Date.now()}`;
      console.log('🔍 Intentando cargar:', imageUrl);

      const newViewer = new Viewer({
        container: container,
        panorama: imageUrl,
        navbar: false,
      });
      
      viewerRef.current = newViewer;
      console.log('✅ Visor inicializado correctamente');

      newViewer.addEventListener('load', () => {
        console.log('✅ ¡Imagen cargada y renderizada con éxito!');
      });

      newViewer.addEventListener('error', (err) => {
        console.error('❌ Error interno del visor al cargar la imagen:', err);
      });
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      bgcolor: '#F7F8FA'
    }}>
      {/* BARRA SUPERIOR GLASSMORPHISM */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        px: { xs: 2, md: 4 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.04)',
      }}>
        <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ letterSpacing: '-0.5px' }}>
          Bienes 360°
        </Typography>

        <TextField
          size="small"
          placeholder="Ej: Apartamentos en Alta Suiza..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: '40%', md: '400px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
              '&:hover fieldset': { borderColor: 'rgba(26, 58, 82, 0.3)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', '&:hover': { bgcolor: 'white' } }}>
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      {/* CHIPS DE FILTROS RÁPIDOS */}
      <Box sx={{
        position: 'fixed',
        top: { xs: 70, md: 80 },
        left: 0,
        right: 0,
        zIndex: 999,
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {['🏠 Todos', '💰 Venta', '🔑 Arriendo', '🔄 Cambio', '🏛 Subastas', '⭐ Destacados', '🆕 Nuevos', '❤️ Favoritos'].map((chip, index) => (
          <Chip
            key={index}
            label={chip}
            size="small"
            sx={{
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.85rem',
              bgcolor: index === 0 ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
              color: index === 0 ? 'white' : 'text.primary',
              border: index === 0 ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                bgcolor: index === 0 ? 'primary.dark' : 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          />
        ))}
      </Box>

      {/* VISOR DE PANORÁMICA (Con posición absoluta para garantizar que tome el espacio) */}
      <Box 
        id="panorama-viewer"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          '& .psv-canvas': {
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
          },
        }}
      />

      {/* BARRA INFERIOR DE INFORMACIÓN CONTEXTUAL */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        px: { xs: 2, md: 4 },
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.04)',
      }}>
        <Box>
          <Typography variant="body2" fontWeight="600" color="text.primary">
            Barrio Alta Suiza
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Manizales, Caldas
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="600" color="primary.main">
            12 propiedades visibles
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Precio promedio: $450M
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;