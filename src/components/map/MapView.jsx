import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import InfoLayers from './InfoLayers';

const MANIZALES_CENTER = [5.0689, -75.5174];

const mockProperties = [
  { id: '1', title: 'Apartamento en Chipre', type: 'Apartamento', price: 450000000, priceText: '$450,000,000', area: '85 m²', rooms: 3, baths: 2, status: 'disponible', coords: [5.0750, -75.5200] },
  { id: '2', title: 'Casa en La Enea', type: 'Casa', price: 850000000, priceText: '$850,000,000', area: '150 m²', rooms: 4, baths: 3, status: 'vendido', coords: [5.0600, -75.5300] },
  { id: '3', title: 'Local en el Centro', type: 'Local', price: 3500000, priceText: '$3,500,000/mes', area: '60 m²', rooms: 1, baths: 1, status: 'arrendado', coords: [5.0689, -75.5174] },
  { id: '4', title: 'Penthouse en Palogrande', type: 'Apartamento', price: 1200000000, priceText: '$1,200,000,000', area: '120 m²', rooms: 3, baths: 3, status: 'reservado', coords: [5.0800, -75.5100] },
  { id: '5', title: 'Proyecto Nuevo en Villa del Prado', type: 'Apartamento', price: 380000000, priceText: 'Desde $380,000,000', area: '70 m²', rooms: 2, baths: 2, status: 'proximamente', coords: [5.0500, -75.5000] }
];

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
  const filteredProperties = mockProperties.filter(prop => {
    if (filters.tipo !== 'todos' && prop.type !== filters.tipo) return false;
    if (filters.precioMax && prop.price > Number(filters.precioMax)) return false;
    if (filters.habitaciones !== 'todos' && prop.rooms < Number(filters.habitaciones)) return false;
    return true;
  });

  // Configuración de base maps
  const baseMaps = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
  };

  const currentBaseMap = baseMaps[baseMap] || baseMaps.streets;

  return (
    <MapContainer
      center={MANIZALES_CENTER}
      zoom={13}
      style={{ width: '100%', height: 'calc(100vh - 130px)' }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        key={baseMap} // Forzar re-render cuando cambie el baseMap
        attribution={currentBaseMap.attribution}
        url={currentBaseMap.url}
      />
      
      {filteredProperties.map((prop) => (
        <Marker 
          key={prop.id} 
          position={prop.coords}
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
              <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>{prop.priceText}</p>
              <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '12px' }}>
                <span>📐 {prop.area}</span>
                <span>🛏️ {prop.rooms} Hab</span>
                <span>🚿 {prop.baths} Baños</span>
              </div>
              <button style={{
                marginTop: '12px', width: '100%', padding: '8px', backgroundColor: '#000',
                color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
              }}>
                Ver Propiedad
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Renderizar capas de información */}
      <InfoLayers activeLayers={activeLayers} />

      {filteredProperties.length === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>No se encontraron propiedades</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>Intenta ajustar los filtros</p>
        </div>
      )}
    </MapContainer>
  );
};

export default MapView;