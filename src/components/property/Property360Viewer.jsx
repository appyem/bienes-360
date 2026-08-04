import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { Box, Typography, CircularProgress } from '@mui/material';

const Property360Viewer = ({ imageUrl, title }) => {
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!!imageUrl);

  useEffect(() => {
    if (!imageUrl) return;

    let isMounted = true;

    const initViewer = async () => {
      // Esperamos un frame para asegurar que React adjuntó el ref al DOM
      await new Promise(resolve => requestAnimationFrame(resolve));

      if (!isMounted || !viewerRef.current) {
        console.log('⛔ Ref no disponible, cancelando.');
        return;
      }

      // Limpiar instancia previa si existe
      if (viewerInstance.current) {
        try {
          viewerInstance.current.destroy();
        } catch (e) {
          console.warn('⚠️ Error limpiando instancia:', e.message);
        }
        viewerInstance.current = null;
      }

      try {
        console.log('🛠️ Creando instancia de Viewer...');
        viewerInstance.current = new Viewer({
          container: viewerRef.current,
          panorama: imageUrl,
          caption: title || 'Recorrido Virtual 360°',
          navbar: ['zoom', 'move', 'caption', 'fullscreen'],
          defaultZoomLvl: 0,
          touchmoveTwoFingers: true,
          mousewheelCtrlKey: true,
        });

        viewerInstance.current.addEventListener('ready', () => {
          console.log('🎉 Viewer listo y renderizado.');
          if (isMounted) setLoading(false);
        });

        viewerInstance.current.addEventListener('error', (err) => {
          console.error('💥 Error del Viewer:', err);
          if (isMounted) {
            setError(`Error al cargar: ${err.message || 'Desconocido'}`);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('💥 Excepción al crear Viewer:', err);
        if (isMounted) {
          setError(`Error técnico: ${err.message}`);
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (viewerInstance.current) {
        try {
          viewerInstance.current.destroy();
        } catch (e) {
          console.warn('⚠️ Error al destruir:', e.message);
        }
        viewerInstance.current = null;
      }
    };
  }, [imageUrl, title]);

  if (!imageUrl) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
        <Typography variant="h6" color="text.secondary">Tour 360° no disponible.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '500px', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: '#000' }}>
      
      {/* 1. Spinner de carga SUPERPUESTO (No reemplaza al contenedor) */}
      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.8)', zIndex: 10 }}>
          <CircularProgress color="primary" />
          <Typography sx={{ ml: 2, color: 'white', fontWeight: 600 }}>Cargando recorrido virtual...</Typography>
        </Box>
      )}
      
      {/* 2. Mensaje de error SUPERPUESTO */}
      {error && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffebee', zIndex: 20, p: 4, textAlign: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight="600" color="error">⚠️ Error al cargar</Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>
          </Box>
        </Box>
      )}

      {/* 3. Contenedor del visor: SIEMPRE en el DOM para que el ref funcione */}
      <Box 
        ref={viewerRef} 
        sx={{ 
          width: '100%', 
          height: '100%',
          '& .psv-container': { borderRadius: '8px' }
        }} 
      />
    </Box>
  );
};

export default Property360Viewer;