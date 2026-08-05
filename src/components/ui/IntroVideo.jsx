import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const IntroVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn('Autoplay bloqueado por el navegador:', error);
        setTimeout(() => onComplete(), 100);
      });
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        bgcolor: '#000', // Fondo negro cinematográfico
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <video
        ref={videoRef}
        src="/iniciologo.mov" // <-- Nuevo video
        onEnded={handleVideoEnd}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100vw',
          maxHeight: '100vh',
          // CAMBIO CLAVE: 'contain' evita que se recorte o se pixelé por estiramiento
          objectFit: 'contain', 
          objectPosition: 'center',
        }}
      />
    </Box>
  );
};

export default IntroVideo;