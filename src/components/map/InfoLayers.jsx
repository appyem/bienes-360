import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Datos mock de puntos de interés en Manizales
const infoData = {
  colegios: [
    { id: 'c1', name: 'Colegio San José', coords: [5.0720, -75.5150] },
    { id: 'c2', name: 'Liceo de Caldas', coords: [5.0680, -75.5200] },
    { id: 'c3', name: 'Colegio Integrado', coords: [5.0750, -75.5100] }
  ],
  hospitales: [
    { id: 'h1', name: 'Hospital San Jorge', coords: [5.0690, -75.5180] },
    { id: 'h2', name: 'Clínica Los Rosales', coords: [5.0730, -75.5120] }
  ],
  parques: [
    { id: 'p1', name: 'Parque Caldas', coords: [5.0689, -75.5174] },
    { id: 'p2', name: 'Parque de Los Novios', coords: [5.0650, -75.5250] },
    { id: 'p3', name: 'Jardín Botánico', coords: [5.0800, -75.5050] }
  ],
  transporte: [
    { id: 't1', name: 'Terminal de Transportes', coords: [5.0550, -75.5100] },
    { id: 't2', name: 'Paradero Central', coords: [5.0700, -75.5160] }
  ],
  comercios: [
    { id: 'co1', name: 'Centro Comercial Chipre', coords: [5.0760, -75.5210] },
    { id: 'co2', name: 'Palatino Mall', coords: [5.0670, -75.5190] }
  ]
};

const createInfoIcon = (emoji) => {
  return L.divIcon({
    className: 'info-marker',
    html: `<div style="
      width: 28px; 
      height: 28px; 
      background-color: white; 
      border: 2px solid #000;
      border-radius: 50%; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    ">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const InfoLayers = ({ activeLayers }) => {
  const layerEmojis = {
    colegios: '🏫',
    hospitales: '🏥',
    parques: '🌳',
    transporte: '🚌',
    comercios: '🏪'
  };

  return (
    <>
      {activeLayers.map((layerId) => {
        const data = infoData[layerId] || [];
        const emoji = layerEmojis[layerId];
        
        return data.map((item) => (
          <Marker 
            key={item.id} 
            position={item.coords}
            icon={createInfoIcon(emoji)}
          >
            <Popup>
              <div style={{ minWidth: '150px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{emoji}</div>
                <strong style={{ fontSize: '14px' }}>{item.name}</strong>
              </div>
            </Popup>
          </Marker>
        ));
      })}
    </>
  );
};

export default InfoLayers;