import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { Box, Typography, Paper } from '@mui/material';

const Property360Viewer = ({ imageUrl, title }) => {
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);

  useEffect(() => {
    if (!imageUrl || !viewerRef.current) return;

    // 1. Limpiar instancia previa de forma segura
    if (viewerInstance.current) {
      try {
        viewerInstance.current.destroy();
      } catch (e) {
        console.warn('Limpieza de instancia previa:', e.message);
      }
      viewerInstance.current = null;
    }

    // 2. Inicializar nuevo visor
    try {
      viewerInstance.current = new Viewer({
        container: viewerRef.current,
        panorama: imageUrl,
        caption: title || 'Recorrido Virtual 360°',
        navbar: ['zoom', 'move', 'caption', 'fullscreen'],
        defaultZoomLvl: 0,
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: true,
      });
    } catch (error) {
      console.error('Error al inicializar el visor 360:', error);
    }

    // 3. Función de limpieza al desmontar (con protección contra errores de DOM)
    return () => {
      if (viewerInstance.current) {
        try {
          viewerInstance.current.destroy();
        } catch (error) {
          // Ignorar silenciosamente si React ya eliminó el nodo del DOM
          console.warn('Aviso de limpieza del visor 360 (DOM ya desmontado):', error.message);
        }
        viewerInstance.current = null;
      }
    };
  }, [imageUrl, title]);

  if (!imageUrl) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Tour 360° no disponible para esta propiedad.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          El administrador aún no ha subido el recorrido virtual.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box 
      ref={viewerRef} 
      sx={{ 
        width: '100%', 
        height: '500px', 
        borderRadius: 2, 
        overflow: 'hidden', 
        border: '1px solid', 
        borderColor: 'divider',
        '& .psv-container': { borderRadius: '8px' }
      }} 
    />
  );
};

export default Property360Viewer;