import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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
  const [panoramaInfo, setPanoramaInfo] = useState({ title: 'Cargando...', city: '', markersCount: 0 });

  useEffect(() => {
    const container = document.querySelector('#panorama-viewer');
    
    if (container && !viewerRef.current) {
      const loadPanoramaAndMarkers = async () => {
        let imageUrl = `/panoramicas/alta-suiza.jpeg`;
        let title = 'Barrio Alta Suiza';
        let city = 'Manizales';
        let realMarkers = [];

        try {
          // 1. Obtener la panorámica activa más reciente
          const panoramasQuery = query(
            collection(db, 'panoramas'),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const panoramaSnapshot = await getDocs(panoramasQuery);
          
          if (!panoramaSnapshot.empty) {
            const panoramaData = panoramaSnapshot.docs[0].data();
            const panoramaId = panoramaSnapshot.docs[0].id;
            
            title = panoramaData.title || 'Panorámica';
            city = panoramaData.city || '';

            // Intentar cargar imagen de Firebase (con fallback local si hay CORS)
            try {
              const testResponse = await fetch(panoramaData.imageUrl, { method: 'HEAD' });
              if (testResponse.ok) {
                imageUrl = panoramaData.imageUrl;
              }
            } catch {
              console.warn('Usando imagen local de respaldo por CORS');
            }

            // 2. Obtener los marcadores/propiedades reales asociados a esta panorámica
            const propertiesQuery = query(
              collection(db, 'properties'),
              where('panoramaId', '==', panoramaId),
              where('isActive', '==', true)
            );
            const propertiesSnapshot = await getDocs(propertiesQuery);
            
            realMarkers = propertiesSnapshot.docs.map(doc => {
              const data = doc.data();
              
              // CORRECCIÓN: Buscar coordenadas en formato anidado (markerPosition) o plano (yaw/pitch)
              const yaw = data.markerPosition?.yaw ?? data.yaw;
              const pitch = data.markerPosition?.pitch ?? data.pitch;

              // Si no tiene coordenadas, no sirve para el visor 3D. Retornamos null.
              if (yaw === undefined || pitch === undefined) {
                console.warn(`⚠️ La propiedad "${data.title}" (ID: ${doc.id}) no tiene coordenadas. Se omite del visor.`);
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
                image: data.image,
                position: { yaw, pitch },
                rawData: data
              };
            }).filter(Boolean); // <-- Elimina todos los 'null' del array final

            console.log(`✅ Cargados ${realMarkers.length} marcadores reales para: ${title}`);
          }
        } catch (error) {
          console.error('❌ Error cargando datos desde Firebase:', error);
        }
        
        setPanoramaInfo({ title, city, markersCount: realMarkers.length });

        // 3. Preparar marcadores para el plugin del visor
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

        // 4. Inicializar el visor
        const newViewer = new Viewer({
          container: container,
          panorama: imageUrl,
          navbar: false,
          plugins: [
            [MarkersPlugin, { markers: pluginMarkers }],
          ],
        });
        
        viewerRef.current = newViewer;

        // 5. Configurar eventos de clic
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
      
      loadPanoramaAndMarkers();
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
      {/* BARRA SUPERIOR */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 2px 20px rgba(0, 0, 0, 0.04)' }}>
        <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ letterSpacing: '-0.5px' }}>Bienes 360°</Typography>
        <TextField size="small" placeholder="Ej: Apartamentos en Alta Suiza..." slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> } }} sx={{ width: { xs: '40%', md: '400px' }, '& .MuiOutlinedInput-root': { borderRadius: 12, bgcolor: 'rgba(255, 255, 255, 0.9)', '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' } } }} />
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