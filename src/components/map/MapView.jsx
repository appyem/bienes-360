import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import InfoLayers from './InfoLayers'; // Ajusta la ruta si es necesario
import { getAllProperties } from '../../services/propertyService';

const MANIZALES_CENTER = [5.0689, -75.5174];

const getStatusColor = (status) => {
  const colors = { disponible: '#4CAF50', vendido: '#F44336', arrendado: '#2196F3', reservado: '#FFC107', proximamente: '#9E9E9E' };
  return colors[status] || '#9E9E9E';
};

const getStatusName = (status) => {
  const names = { disponible: 'Disponible', vendido: 'Vendido', arrendado: 'Arrendado', reservado: 'Reservado', proximamente: 'Próximamente' };
  return names[status] || status;
};

const createCustomIcon = (status) => {
  const color = getStatusColor(status);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 24px; height: 24px; background-color: ${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
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
    if (!prop.latitude || !prop.longitude) return false;
    if (filters.tipo !== 'todos' && prop.type !== filters.tipo) return false;
    const propPrice = Number(String(prop.price).replace(/[^0-9.-]+/g, ''));
    if (filters.precioMax && propPrice > Number(filters.precioMax)) return false;
    if (filters.habitaciones !== 'todos' && Number(prop.rooms) < Number(filters.habitaciones)) return false;
    return true;
  });

  const baseMaps = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri'
    }
  };

  const currentBaseMap = baseMaps[baseMap] || baseMaps.streets;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Cargando propiedades del mapa...</Typography>
      </Box>
    );
  }

  return (
    // CAMBIO CLAVE: Contenedor que ajusta la altura dinámicamente según el tamaño de pantalla
    <Box sx={{ width: '100%', height: { xs: 'calc(100vh - 220px)', sm: 'calc(100vh - 130px)' }, position: 'relative' }}>
      <MapContainer
        center={MANIZALES_CENTER}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={baseMap}
          attribution={currentBaseMap.attribution}
          url={currentBaseMap.url}
        />
        
        {filteredProperties.map((prop) => (
          <Marker 
            key={prop.id} 
            position={[Number(prop.latitude), Number(prop.longitude)]}
            icon={createCustomIcon(prop.status)}
          >
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <div style={{ 
                  display: 'inline-block', padding: '2px 8px', borderRadius: '4px', 
                  backgroundColor: getStatusColor(prop.status), color: 'white', 
                  fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase'
                }}>
                  {getStatusName(prop.status)}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{prop.title}</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>{prop.price}</p>
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '12px' }}>
                  <span>📐 {prop.area}</span>
                  <span>🛏️ {prop.rooms} Hab</span>
                  <span>🚿 {prop.baths || prop.bathrooms} Baños</span>
                </div>
                <button 
                  onClick={() => navigate(`/propiedad/${prop.id}`)}
                  style={{
                    marginTop: '12px', width: '100%', padding: '8px', backgroundColor: '#000',
                    color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
                  }}
                >
                  Ver Propiedad
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <InfoLayers activeLayers={activeLayers} />

        {filteredProperties.length === 0 && !loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textAlign: 'center', width: '80%' }}>
            <p style={{ margin: 0, fontWeight: '600' }}>No se encontraron propiedades</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>Intenta ajustar los filtros.</p>
          </div>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapView;