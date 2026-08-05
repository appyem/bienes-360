import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import InfoLayers from './InfoLayers'; 
import { getAllProperties } from '../../services/propertyService';

const MANIZALES_CENTER = [5.0689, -75.5174];

const getStatusColor = (status) => {
  const colors = { disponible: '#2C3E50', vendido: '#4A4A4A', arrendado: '#1E3A5F', reservado: '#B8860B', proximamente: '#6A5ACD' };
  return colors[status] || '#6A5ACD';
};

const getStatusName = (status) => {
  const names = { disponible: 'Disponible', vendido: 'Vendido', arrendado: 'Arrendado', reservado: 'Reservado', proximamente: 'Próximamente' };
  return names[status] || status;
};

const createCustomIcon = (status) => {
  const color = getStatusColor(status);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 24px; height: 24px; background-color: ${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
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
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0,
      width: '100vw', 
      height: '100dvh', // CAMBIO CLAVE: Dynamic Viewport Height para móviles
      bgcolor: '#1a1a1a', 
      overflow: 'hidden',
      zIndex: 1,
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
                  <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', backgroundColor: getStatusColor(prop.status), color: 'white', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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