import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Chip, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, Modal, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import PanoramaIcon from '@mui/icons-material/Panorama';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BusinessIcon from '@mui/icons-material/Business';
import KeyIcon from '@mui/icons-material/Key';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import PanoramaMarker from '../../components/property/PanoramaMarker';

const toRad = (deg) => deg * (Math.PI / 180);

// Paleta de colores PREMIUM (más sobrios y elegantes)
const STATUS_COLORS = {
  todos: '#2C3E50',      // Azul carbón profundo
  venta: '#1E3A5F',      // Azul profundo elegante
  arriendo: '#B8860B',   // Dorado oscuro / Ámbar
};

const getStatusColor = (status) => {
  const colors = {
    disponible: '#2C3E50',
    venta: '#1E3A5F',
    arriendo: '#B8860B',
    cambio: '#6A5ACD',
    subasta: '#DAA520',
    reservado: '#8B0000',
    vendido: '#4A4A4A',
  };
  return colors[status] || colors.disponible;
};

const Home = () => {
  const viewerRef = useRef(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [panoramas, setPanoramas] = useState([]);
  const [selectedPanoramaId, setSelectedPanoramaId] = useState('');
  const [panoramaInfo, setPanoramaInfo] = useState({ title: 'Cargando...', city: '', markersCount: 0 });
  
  const [activeFilter, setActiveFilter] = useState('todos');
  
  const [showTutorial, setShowTutorial] = useState(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    return !hasSeenTutorial;
  });
  
  const [tutorialStep, setTutorialStep] = useState(1);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleNextTutorialStep = () => {
    if (tutorialStep === 1) {
      setTutorialStep(2);
    } else {
      handleCloseTutorial();
    }
  };

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
        if (list.length > 0) {
          setSelectedPanoramaId(list[0].id);
        }
      } catch (error) {
        console.error('❌ Error cargando panorámicas:', error);
      }
    };
    
    loadAllPanoramas();
  }, []);

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
        try {
          const testResponse = await fetch(selectedPanorama.imageUrl, { method: 'HEAD' });
          if (testResponse.ok) {
            imageUrl = selectedPanorama.imageUrl;
          }
        } catch {
          console.warn('Usando imagen local de respaldo por CORS');
        }

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

      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      const container = document.querySelector('#panorama-viewer');
      if (!container) return;

      const filteredMarkers = realMarkers.filter(marker => {
        if (activeFilter === 'todos') return true;
        if (activeFilter === 'venta') return marker.status === 'venta';
        if (activeFilter === 'arriendo') return marker.status === 'arriendo';
        return true;
      });

      const pluginMarkers = filteredMarkers.map(marker => ({
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

      const newViewer = new Viewer({
        container: container,
        panorama: imageUrl,
        navbar: false,
        plugins: [
          [MarkersPlugin, { markers: pluginMarkers }],
        ],
      });
      
      viewerRef.current = newViewer;

      window._handlePsvMarkerClick = (markerId) => {
        const marker = filteredMarkers.find((m) => m.id === markerId);
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
  }, [selectedPanoramaId, panoramas, activeFilter]);

  const handlePanoramaChange = (event) => {
    setSelectedPanoramaId(event.target.value);
  };

  const handleCloseModal = () => {
    setSelectedMarkerData(null);
  };

  // Chips con iconos profesionales (sin emojis)
  const filterChips = [
    { id: 'todos', label: 'Todos', icon: <HomeWorkIcon sx={{ fontSize: 18 }} />, color: STATUS_COLORS.todos },
    { id: 'venta', label: 'Venta', icon: <BusinessIcon sx={{ fontSize: 18 }} />, color: STATUS_COLORS.venta },
    { id: 'arriendo', label: 'Arriendo', icon: <KeyIcon sx={{ fontSize: 18 }} />, color: STATUS_COLORS.arriendo },
  ];

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      // Fondo oscuro elegante con degradado sutil
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    }}>
      {/* BARRA SUPERIOR PREMIUM (Glassmorphism refinado) */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        px: { xs: 2, md: 4 }, py: { xs: 1.5, md: 2 }, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, 
        background: 'rgba(15, 15, 15, 0.65)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            component="img" 
            src="/logo.png" 
            alt="Logo Bienes 360°"
            sx={{ 
              height: { xs: 32, md: 40 }, 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'brightness(1.1) contrast(1.05)',
            }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <Typography 
            variant="h6" 
            fontWeight="700" 
            sx={{ 
              letterSpacing: '0.5px', 
              whiteSpace: 'nowrap',
              color: '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Bienes 360°
          </Typography>
        </Box>
        
        {panoramas.length > 0 && (
          <FormControl size="small" sx={{ minWidth: { xs: 120, md: 250 } }}>
            <Select
              value={selectedPanoramaId}
              onChange={handlePanoramaChange}
              displayEmpty
              startAdornment={<PanoramaIcon sx={{ mr: 1, color: '#B8860B' }} />}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '& .MuiSelect-icon': { color: '#FFFFFF' },
                '& .MuiSvgIcon-root': { color: '#FFFFFF' },
              }}
            >
              {panoramas.map((pano) => (
                <MenuItem key={pano.id} value={pano.id} sx={{ bgcolor: '#1a1a1a', color: '#FFFFFF' }}>
                  {pano.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField 
          size="small" 
          placeholder="Buscar..." 
          slotProps={{ 
            input: { 
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.6)' }} /></InputAdornment> 
            } 
          }} 
          sx={{ 
            width: { xs: '30%', md: '300px' }, 
            display: { xs: 'none', sm: 'block' },
            '& .MuiOutlinedInput-root': { 
              borderRadius: 2, 
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '& input::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
            } 
          }} 
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.08)', 
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' } 
          }}>
            <TuneIcon />
          </IconButton>
        </Box>
      </Box>

      {/* CHIPS PREMIUM (con iconos profesionales, sin emojis) */}
      <Box sx={{ 
        position: 'fixed', 
        top: { xs: 65, md: 80 }, 
        left: 0, right: 0, zIndex: 999, 
        px: { xs: 2, md: 4 }, py: 1.5, 
        display: 'flex', gap: 1.5, 
        overflowX: 'auto', 
        background: 'rgba(15, 15, 15, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        scrollbarWidth: 'none', 
        '&::-webkit-scrollbar': { display: 'none' } 
      }}>
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <Chip 
              key={chip.id}
              icon={chip.icon}
              label={chip.label.toUpperCase()}
              size="medium" 
              onClick={() => setActiveFilter(chip.id)}
              sx={{ 
                borderRadius: 2, 
                fontWeight: 700, 
                fontSize: '0.8rem',
                letterSpacing: '0.8px',
                px: 2,
                py: 2.5,
                height: 'auto',
                bgcolor: isActive ? chip.color : 'rgba(255, 255, 255, 0.06)',
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                whiteSpace: 'nowrap', 
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                '& .MuiChip-icon': { 
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  ml: '4px',
                },
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  bgcolor: isActive ? chip.color : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isActive ? `0 6px 20px ${chip.color}60` : '0 4px 12px rgba(0,0,0,0.3)',
                },
                boxShadow: isActive ? `0 4px 16px ${chip.color}50` : 'none',
              }} 
            />
          );
        })}
      </Box>

      {/* VISOR 360° */}
      <Box id="panorama-viewer" sx={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, 
        '& .psv-canvas': { cursor: 'grab', '&:active': { cursor: 'grabbing' } } 
      }} />

      {/* MODAL DE PROPIEDAD */}
      {selectedMarkerData && <PanoramaMarker marker={selectedMarkerData} onClose={handleCloseModal} />}

      {/* BARRA INFERIOR PREMIUM */}
      <Box sx={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, 
        px: { xs: 2, md: 4 }, py: 2, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: 'rgba(15, 15, 15, 0.75)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.4)',
      }}>
        <Box>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#FFFFFF' }}>
            {panoramaInfo.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {panoramaInfo.city}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#B8860B' }}>
            {panoramaInfo.markersCount} propiedades visibles
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Explora el sector en 360°
          </Typography>
        </Box>
      </Box>

      {/* TUTORIAL DE BIENVENIDA (Premium) */}
      <Modal
        open={showTutorial}
        onClose={handleCloseTutorial}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: 450 },
            maxWidth: 500,
            bgcolor: '#1a1a1a',
            borderRadius: 4,
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            p: { xs: 3, sm: 4 },
            outline: 'none',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.3s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'scale(0.9)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: tutorialStep === 1 ? '#B8860B' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
            <Box sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: tutorialStep === 2 ? '#B8860B' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
          </Box>

          {tutorialStep === 1 ? (
            <>
              <Box sx={{ 
                width: 80, height: 80, mx: 'auto', mb: 2,
                borderRadius: '50%', 
                bgcolor: 'rgba(184, 134, 11, 0.15)',
                border: '1px solid rgba(184, 134, 11, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <PanoramaIcon sx={{ fontSize: 44, color: '#B8860B' }} />
              </Box>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: '#FFFFFF' }}>
                Bienvenido a Bienes 360°
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
                Primero, <strong style={{ color: '#FFFFFF' }}>elige el sector</strong> donde quieres buscar tu vivienda usando el selector de la parte superior.
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 3, fontStyle: 'italic', 
                bgcolor: 'rgba(255,255,255,0.05)', 
                p: 2, borderRadius: 2, 
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                💡 Podrás rotar la imagen 360° arrastrando con el dedo o el mouse para explorar todo el sector.
              </Typography>
            </>
          ) : (
            <>
              <Box sx={{ 
                width: 80, height: 80, mx: 'auto', mb: 2,
                borderRadius: '50%', 
                bgcolor: 'rgba(30, 58, 95, 0.2)',
                border: '1px solid rgba(30, 58, 95, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <TuneIcon sx={{ fontSize: 44, color: '#1E3A5F' }} />
              </Box>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: '#FFFFFF' }}>
                Excelente
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
                Ahora, <strong style={{ color: '#FFFFFF' }}>filtra por tipo</strong> usando los botones de abajo: <strong style={{ color: '#4A90E2' }}>Venta</strong> o <strong style={{ color: '#B8860B' }}>Arriendo</strong>.
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 3, fontStyle: 'italic', 
                bgcolor: 'rgba(255,255,255,0.05)', 
                p: 2, borderRadius: 2, 
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                💡 Los marcadores en el visor cambiarán de color según el filtro seleccionado.
              </Typography>
            </>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            {tutorialStep === 2 && (
              <Button
                onClick={handleCloseTutorial}
                variant="outlined"
                sx={{ 
                  flex: 1, py: 1.5, borderRadius: 2,
                  fontWeight: 600, textTransform: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Saltar
              </Button>
            )}
            <Button
              onClick={handleNextTutorialStep}
              variant="contained"
              sx={{ 
                flex: 1, py: 1.5, borderRadius: 2,
                fontWeight: 700, textTransform: 'none', fontSize: '1rem',
                bgcolor: tutorialStep === 1 ? '#B8860B' : '#1E3A5F',
                '&:hover': {
                  bgcolor: tutorialStep === 1 ? '#9A7209' : '#162B47',
                },
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              }}
            >
              {tutorialStep === 1 ? 'Siguiente' : 'Entendido'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;