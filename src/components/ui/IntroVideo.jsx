import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const IntroVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Asegurar que el video se reproduzca automáticamente
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn('Autoplay bloqueado por el navegador:', error);
        // Si el autoplay falla, completamos inmediatamente
        setTimeout(() => onComplete(), 100);
      });
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    // Animación de salida suave
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500); // Espera a que termine la animación de fade-out
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
        bgcolor: '#000',
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
        src="/anilogo360.mp4"
        onEnded={handleVideoEnd}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Recorta los bordes en móvil para llenar la pantalla
          objectPosition: 'center',
        }}
      />
    </Box>
  );
};

export default IntroVideo;