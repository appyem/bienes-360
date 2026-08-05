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
        bgcolor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Contenedor con aspect-ratio 16:9 para recorte más suave */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '177.78vh', // Mantiene aspect-ratio 16:9 basado en la altura de la pantalla
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          position: 'relative',
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
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Box>
    </Box>
  );
};

export default IntroVideo;