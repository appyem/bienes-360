import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import PanoramaMarker from '../../components/property/PanoramaMarker';

const toRad = (deg) => deg * (Math.PI / 180);

const getStatusColor = (status) => {
  const colors = {
    disponible: '#4CAF50',
    venta: '#2196F3',
    arriendo: '#FF9800',
    cambio: '#9C27B0',
    subasta: '#FFD700',
    reservado: '#F44336',
    vendido: '#9E9E9E',
  };
  return colors[status] || colors.disponible;
};

const MOCK_MARKERS = [
  {
    id: '1',
    propertyId: 'prop_001',
    title: 'Apartamento de Lujo en Alta Suiza',
    price: '$450M',
    status: 'disponible',
    neighborhood: 'Alta Suiza',
    area: '85',
    rooms: '3',
    garages: '1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    position: { yaw: -30, pitch: 10 },
  },
  {
    id: '2',
    propertyId: 'prop_002',
    title: 'Casa Moderna con Vista Panorámica',
    price: '$680M',
    status: 'venta',
    neighborhood: 'Alta Suiza',
    area: '120',
    rooms: '4',
    garages: '2',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    position: { yaw: 45, pitch: 5 },
  },
  {
    id: '3',
    propertyId: 'prop_003',
    title: 'Penthouse Exclusivo',
    price: '$1.2B',
    status: 'disponible',
    neighborhood: 'Alta Suiza',
    area: '150',
    rooms: '5',
    garages: '3',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    position: { yaw: 90, pitch: -5 },
  },
];

const Home = () => {
  const viewerRef = useRef(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);

  useEffect(() => {
    const container = document.querySelector('#panorama-viewer');
    
    if (container && !viewerRef.current) {
      const imageUrl = `/panoramicas/alta-suiza.jpeg?v=${Date.now()}`;

      const pluginMarkers = MOCK_MARKERS.map(marker => ({
        id: marker.id,
        position: {
          yaw: toRad(marker.position.yaw),
          pitch: toRad(marker.position.pitch),
        },
        // PRUEBA DE FUEGO: console.log directo en el HTML + !important para anular cualquier bloqueo
        html: `
          <div class="psv-custom-marker" onclick="console.log('🔥 ¡CLICK INLINE DETECTADO! ID:', '${marker.id}'); window._handlePsvMarkerClick('${marker.id}')" style="background: radial-gradient(circle, ${getStatusColor(marker.status)} 0%, rgba(0,0,0,0) 70%); box-shadow: 0 0 20px ${getStatusColor(marker.status)}, 0 0 40px ${getStatusColor(marker.status)}40, inset 0 2px 4px rgba(255,255,255,0.4); border: 2px solid rgba(255,255,255,0.8); pointer-events: auto !important; cursor: pointer !important; z-index: 9999 !important;">
            <div class="psv-marker-price" style="pointer-events: none !important;">${marker.price}</div>
          </div>
        `,
        data: marker,
        clickable: true,
      }));

      const newViewer = new Viewer({
        container: container,
        panorama: imageUrl,
        navbar: false,
        plugins: [
          [MarkersPlugin, { markers: pluginMarkers }],
        ],
      });
      
      viewerRef.current = newViewer;

      // Definimos la función en window para que el HTML inline pueda llamarla
      window._handlePsvMarkerClick = (markerId) => {
        console.log('✅ Función window ejecutada. Buscando marcador:', markerId);
        const marker = MOCK_MARKERS.find((m) => m.id === markerId);
        if (marker) {
          console.log('✅ ¡CLIC DETECTADO! Datos:', marker);
          setSelectedMarkerData(marker);
        }
      };

      // Fallback por si el plugin logra capturar el evento
      newViewer.addEventListener('select-marker', (e, marker) => {
        console.log('📡 Evento select-marker del plugin disparado');
        if (marker && marker.data) {
          setSelectedMarkerData(marker.data);
        }
      });

      newViewer.addEventListener('unselect-marker', () => {
        setSelectedMarkerData(null);
      });
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  const handleCloseModal = () => {
    setSelectedMarkerData(null);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', bgcolor: '#F7F8FA' }}>
      {/* BARRA SUPERIOR GLASSMORPHISM */}
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, px: { xs: 2, md: 4 }, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 2px 20px rgba(0, 0, 0, 0.04)',
      }}>
        <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ letterSpacing: '-0.5px' }}>Bienes 360°</Typography>
        <TextField size="small" placeholder="Ej: Apartamentos en Alta Suiza..." slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> } }} sx={{ width: { xs: '40%', md: '400px' }, '& .MuiOutlinedInput-root': { borderRadius: 12, bgcolor: 'rgba(255, 255, 255, 0.9)', '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' } } }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', '&:hover': { bgcolor: 'white' } }}><FilterListIcon /></IconButton>
        </Box>
      </Box>

      {/* CHIPS DE FILTROS RÁPIDOS */}
      <Box sx={{
        position: 'fixed', top: { xs: 70, md: 80 }, left: 0, right: 0, zIndex: 999, px: { xs: 2, md: 4 }, py: 1.5,
        display: 'flex', gap: 1, overflowX: 'auto', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {['🏠 Todos', '💰 Venta', '🔑 Arriendo', '🔄 Cambio', '🏛 Subastas', '⭐ Destacados', '🆕 Nuevos', '❤️ Favoritos'].map((chip, index) => (
          <Chip key={index} label={chip} size="small" sx={{ borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', bgcolor: index === 0 ? 'primary.main' : 'rgba(255, 255, 255, 0.9)', color: index === 0 ? 'white' : 'text.primary', border: index === 0 ? 'none' : '1px solid rgba(0, 0, 0, 0.08)', whiteSpace: 'nowrap', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-1px)', bgcolor: index === 0 ? 'primary.dark' : 'white' } }} />
        ))}
      </Box>

      {/* VISOR DE PANORÁMICA */}
      <Box id="panorama-viewer" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, '& .psv-canvas': { cursor: 'grab', '&:active': { cursor: 'grabbing' } } }} />

      {/* MODAL DE PROPIEDAD */}
      {selectedMarkerData && (
        <PanoramaMarker marker={selectedMarkerData} onClose={handleCloseModal} />
      )}

      {/* BARRA INFERIOR DE INFORMACIÓN CONTEXTUAL */}
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, px: { xs: 2, md: 4 }, py: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.04)',
      }}>
        <Box>
          <Typography variant="body2" fontWeight="600" color="text.primary">Barrio Alta Suiza</Typography>
          <Typography variant="caption" color="text.secondary">Manizales, Caldas</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="600" color="primary.main">{MOCK_MARKERS.length} propiedades visibles</Typography>
          <Typography variant="caption" color="text.secondary">Precio promedio: $450M</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;