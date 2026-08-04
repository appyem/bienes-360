import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Chip, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
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

const Home = () => {
  const viewerRef = useRef(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [panoramas, setPanoramas] = useState([]);
  const [selectedPanoramaId, setSelectedPanoramaId] = useState('');
  const [panoramaInfo, setPanoramaInfo] = useState({ title: 'Cargando...', city: '', markersCount: 0 });

  // Cargar todas las panorámicas activas al inicio
  useEffect(() => {
    const loadAllPanoramas = async () => {
      try {
        const panoramasQuery = query(
          collection(db, 'panoramas'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(panoramasQuery);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPanoramas(list);
        
        // Seleccionar automáticamente la primera (más reciente)
        if (list.length > 0) {
          setSelectedPanoramaId(list[0].id);
        }
      } catch (error) {
        console.error('❌ Error cargando panorámicas:', error);
      }
    };
    
    loadAllPanoramas();
  }, []);

  // Cuando cambia la panorámica seleccionada, recargar el visor
  useEffect(() => {
    if (!selectedPanoramaId || panoramas.length === 0) return;

    const loadSelectedPanorama = async () => {
      const selectedPanorama = panoramas.find(p => p.id === selectedPanoramaId);
      if (!selectedPanorama) return;

      let imageUrl = `/panoramicas/alta-suiza.jpeg`;
      let title = selectedPanorama.title || 'Panorámica';
      let city = selectedPanorama.city || '';
      let realMarkers = [];

      try {
        // Intentar cargar imagen de Firebase
        try {
          const testResponse = await fetch(selectedPanorama.imageUrl, { method: 'HEAD' });
          if (testResponse.ok) {
            imageUrl = selectedPanorama.imageUrl;
          }
        } catch {
          console.warn('Usando imagen local de respaldo por CORS');
        }

        // Obtener los marcadores asociados a esta panorámica
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('panoramaId', '==', selectedPanoramaId),
          where('isActive', '==', true)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        
        realMarkers = propertiesSnapshot.docs.map(doc => {
          const data = doc.data();
          
          const yaw = data.markerPosition?.yaw ?? data.yaw;
          const pitch = data.markerPosition?.pitch ?? data.pitch;

          if (yaw === undefined || pitch === undefined) {
            return null;
          }

          return {
            id: doc.id,
            propertyId: doc.id,
            title: data.title,
            price: data.priceFormatted || `$${data.price}`,
            status: data.status,
            neighborhood: data.neighborhood,
            area: data.area,
            rooms: data.rooms,
            garages: data.garages,
            image: (data.images && data.images.length > 0) ? data.images[0] : (data.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'),
            position: { yaw, pitch },
            rawData: data
          };
        }).filter(Boolean);

        console.log(`✅ Cargados ${realMarkers.length} marcadores para: ${title}`);
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }
      
      setPanoramaInfo({ title, city, markersCount: realMarkers.length });

      // Destruir visor anterior si existe
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      const container = document.querySelector('#panorama-viewer');
      if (!container) return;

      // Preparar marcadores para el plugin
      const pluginMarkers = realMarkers.map(marker => ({
        id: marker.id,
        position: {
          yaw: toRad(marker.position.yaw),
          pitch: toRad(marker.position.pitch),
        },
        html: `
          <div class="psv-custom-marker" 
               onclick="window._handlePsvMarkerClick('${marker.id}')" 
               ontouchend="window._handlePsvMarkerClick('${marker.id}')" 
               style="background: radial-gradient(circle, ${getStatusColor(marker.status)} 0%, rgba(0,0,0,0) 70%); box-shadow: 0 0 20px ${getStatusColor(marker.status)}, 0 0 40px ${getStatusColor(marker.status)}40, inset 0 2px 4px rgba(255,255,255,0.4); border: 2px solid rgba(255,255,255,0.8); pointer-events: auto !important; cursor: pointer !important; z-index: 9999 !important; touch-action: manipulation !important; -webkit-tap-highlight-color: transparent;">
            <div class="psv-marker-price" style="pointer-events: none !important;">${marker.price}</div>
          </div>
        `,
        data: marker,
        clickable: true,
      }));

      // Crear nuevo visor
      const newViewer = new Viewer({
        container: container,
        panorama: imageUrl,
        navbar: false,
        plugins: [
          [MarkersPlugin, { markers: pluginMarkers }],
        ],
      });
      
      viewerRef.current = newViewer;

      // Configurar eventos de clic
      window._handlePsvMarkerClick = (markerId) => {
        const marker = realMarkers.find((m) => m.id === markerId);
        if (marker) {
          setSelectedMarkerData(marker);
        }
      };

      newViewer.addEventListener('select-marker', (marker) => {
        if (marker && marker.data) {
          setSelectedMarkerData(marker.data);
        }
      });

      newViewer.addEventListener('unselect-marker', () => {
        setSelectedMarkerData(null);
      });
    };
    
    loadSelectedPanorama();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [selectedPanoramaId, panoramas]);

  const handlePanoramaChange = (event) => {
    setSelectedPanoramaId(event.target.value);
  };

  const handleCloseModal = () => {
    setSelectedMarkerData(null);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', bgcolor: '#F7F8FA' }}>
      {/* BARRA SUPERIOR CON SELECTOR DE PANORÁMICA */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 2px 20px rgba(0, 0, 0, 0.04)' }}>
        <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>Bienes 360°</Typography>
        
        {/* SELECTOR DE PANORÁMICA */}
        {panoramas.length > 0 && (
          <FormControl size="small" sx={{ minWidth: { xs: 150, md: 250 } }}>
            <Select
              value={selectedPanoramaId}
              onChange={handlePanoramaChange}
              displayEmpty
              startAdornment={<PanoramaIcon sx={{ mr: 1, color: 'primary.main' }} />}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: 3,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
              }}
            >
              {panoramas.map((pano) => (
                <MenuItem key={pano.id} value={pano.id}>
                  {pano.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField size="small" placeholder="Ej: Apartamentos en Alta Suiza..." slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> } }} sx={{ width: { xs: '30%', md: '300px' }, '& .MuiOutlinedInput-root': { borderRadius: 12, bgcolor: 'rgba(255, 255, 255, 0.9)', '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' } } }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', '&:hover': { bgcolor: 'white' } }}><FilterListIcon /></IconButton>
        </Box>
      </Box>

      {/* CHIPS */}
      <Box sx={{ position: 'fixed', top: { xs: 70, md: 80 }, left: 0, right: 0, zIndex: 999, px: { xs: 2, md: 4 }, py: 1.5, display: 'flex', gap: 1, overflowX: 'auto', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {['🏠 Todos', '💰 Venta', '🔑 Arriendo', '🔄 Cambio', '🏛 Subastas', '⭐ Destacados', '🆕 Nuevos', '❤️ Favoritos'].map((chip, index) => (
          <Chip key={index} label={chip} size="small" sx={{ borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', bgcolor: index === 0 ? 'primary.main' : 'rgba(255, 255, 255, 0.9)', color: index === 0 ? 'white' : 'text.primary', border: index === 0 ? 'none' : '1px solid rgba(0, 0, 0, 0.08)', whiteSpace: 'nowrap', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-1px)', bgcolor: index === 0 ? 'primary.dark' : 'white' } }} />
        ))}
      </Box>

      {/* VISOR */}
      <Box id="panorama-viewer" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, '& .psv-canvas': { cursor: 'grab', '&:active': { cursor: 'grabbing' } } }} />

      {/* MODAL */}
      {selectedMarkerData && <PanoramaMarker marker={selectedMarkerData} onClose={handleCloseModal} />}

      {/* BARRA INFERIOR */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, px: { xs: 2, md: 4 }, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.04)' }}>
        <Box>
          <Typography variant="body2" fontWeight="600" color="text.primary">{panoramaInfo.title}</Typography>
          <Typography variant="caption" color="text.secondary">{panoramaInfo.city}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="600" color="primary.main">{panoramaInfo.markersCount} propiedades visibles</Typography>
          <Typography variant="caption" color="text.secondary">Explora el sector en 360°</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;