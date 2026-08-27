import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import InfoLayers from './InfoLayers'; 
import { getAllProperties } from '../../services/propertyService';

const MANIZALES_CENTER = [5.0689, -75.5174];

// Colores de ALTO CONTRASTE para que no se pierdan en el mapa
const getMarkerColors = (status) => {
  if (status === 'venta') return { 
    border: '#FF007F', 
    glow: 'rgba(255, 0, 127, 0.8)', 
    tail: '#FF007F',
    pulseClass: 'pulse-magenta'
  };
  if (status === 'arriendo') return { 
    border: '#00E5FF', 
    glow: 'rgba(0, 229, 255, 0.8)', 
    tail: '#00E5FF',
    pulseClass: 'pulse-cyan'
  };
  return { 
    border: '#B8860B', 
    glow: 'rgba(184, 134, 11, 0.8)', 
    tail: '#B8860B',
    pulseClass: 'pulse-default'
  };
};

const getStatusName = (status) => {
  const names = { disponible: 'Disponible', vendido: 'Vendido', arrendado: 'Arrendado', reservado: 'Reservado', proximamente: 'Próximamente', venta: 'Venta', arriendo: 'Arriendo' };
  return names[status] || status;
};

const createCustomIcon = (status) => {
  const colors = getMarkerColors(status);
  
  return L.divIcon({
    className: 'custom-map-marker-wrapper',
    html: `
      <style>
        @keyframes markerBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-magenta {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 0, 127, 0.5), 0 0 30px rgba(255, 0, 127, 0.3); transform: scale(1); }
          50% { box-shadow: 0 0 40px rgba(255, 0, 127, 1), 0 0 70px rgba(255, 0, 127, 0.7); transform: scale(1.08); }
        }
        @keyframes pulse-cyan {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.5), 0 0 30px rgba(0, 229, 255, 0.3); transform: scale(1); }
          50% { box-shadow: 0 0 40px rgba(0, 229, 255, 1), 0 0 70px rgba(0, 229, 255, 0.7); transform: scale(1.08); }
        }
        .custom-map-marker-wrapper {
          animation: markerBounce 2.5s infinite ease-in-out;
        }
        .marker-circle {
          animation-duration: 1.5s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .pulse-magenta { animation-name: pulse-magenta; }
        .pulse-cyan { animation-name: pulse-cyan; }
      </style>
      <div style="position: relative; width: 60px; height: 76px; display: flex; flex-direction: column; align-items: center;">
        <!-- Cuerpo del marcador MÁS GRANDE con latido -->
        <div class="marker-circle ${colors.pulseClass}" style="
          width: 60px; height: 60px; border-radius: 50%; background: #ffffff;
          border: 4px solid ${colors.border};
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
        ">
          <!-- Logo más grande con sombra para contraste -->
          <img src="/logo.png" alt="Logo" style="width: 40px; height: 40px; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));" />
        </div>
        <!-- Cola del marcador proporcionalmente más grande -->
        <div style="
          width: 0; height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 16px solid ${colors.tail};
          margin-top: -5px;
          z-index: 1;
          filter: drop-shadow(0 4px 4px rgba(0,0,0,0.4));
        "></div>
      </div>
    `,
    iconSize: [60, 76],
    iconAnchor: [30, 76], // La punta de la cola apunta exactamente a la coordenada
    popupAnchor: [0, -76]
  });
};

const cleanCoordinate = (value) => {
  if (!value) return NaN;
  const cleaned = String(value).replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned);
};

const MapView = ({ filters, activeLayers, baseMap }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error cargando propiedades para el mapa:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const filteredProperties = properties.filter(prop => {
    const lat = cleanCoordinate(prop.latitude);
    const lng = cleanCoordinate(prop.longitude);
    if (isNaN(lat) || isNaN(lng)) return false;
    if (filters.tipo !== 'todos' && prop.type !== filters.tipo) return false;
    const propPrice = Number(String(prop.price).replace(/[^0-9.-]+/g, ''));
    if (filters.precioMax && propPrice > Number(filters.precioMax)) return false;
    if (filters.habitaciones !== 'todos' && Number(prop.rooms) < Number(filters.habitaciones)) return false;
    return true;
  });

  const baseMaps = {
    streets: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap' },
    satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Tiles &copy; Esri' }
  };
  const currentBaseMap = baseMaps[baseMap] || baseMaps.streets;

  if (loading) {
    return (
      <Box sx={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#1a1a1a', zIndex: 500 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Cargando mapa...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      width: '100vw', height: '100dvh', bgcolor: '#1a1a1a', overflow: 'hidden', zIndex: 1,
    }}>
      <MapContainer center={MANIZALES_CENTER} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={true} scrollWheelZoom={true}>
        <TileLayer key={baseMap} attribution={currentBaseMap.attribution} url={currentBaseMap.url} />
        
        {filteredProperties.map((prop) => {
          const lat = cleanCoordinate(prop.latitude);
          const lng = cleanCoordinate(prop.longitude);
          return (
            <Marker key={prop.id} position={[lat, lng]} icon={createCustomIcon(prop.status)}>
              <Popup>
                <div style={{ minWidth: '180px', fontFamily: 'sans-serif' }}>
                  <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', backgroundColor: getMarkerColors(prop.status).border, color: 'white', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {getStatusName(prop.status)}
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>{prop.title}</h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#B8860B' }}>{prop.price}</p>
                  <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '12px' }}>
                    <span>📐 {prop.area}</span>
                    <span>🛏️ {prop.rooms} Hab</span>
                    <span>🚿 {prop.baths || prop.bathrooms} Baños</span>
                  </div>
                  <button onClick={() => navigate(`/propiedad/${prop.id}`)} style={{ marginTop: '12px', width: '100%', padding: '8px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    Ver Propiedad
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <InfoLayers activeLayers={activeLayers} />

        {filteredProperties.length === 0 && !loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: 'rgba(35, 35, 35, 0.9)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', textAlign: 'center', width: '80%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#fff' }}>No se encontraron propiedades</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Intenta ajustar los filtros.</p>
          </div>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapView;