import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const isInstalled = localStorage.getItem('appInstalled') === 'true';
    const isDismissed = localStorage.getItem('installPromptDismissed') === 'true';

    if (isInstalled || isDismissed) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
      localStorage.setItem('appInstalled', 'true');
      setDeferredPrompt(null);
    });

    // FALLBACK: Si después de 2 segundos no se dispara el evento (ej. iOS), lo mostramos igual
    // para que el usuario sepa que puede agregarlo manualmente desde el menú del navegador.
    const timer = setTimeout(() => {
      if (!isInstalled && !isDismissed && !deferredPrompt) {
        setShowInstallButton(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('appInstalled', 'true');
      } else {
        localStorage.setItem('installPromptDismissed', 'true');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback para iOS: solo cerramos el prompt, el usuario debe usar "Compartir > Agregar a Inicio"
      localStorage.setItem('installPromptDismissed', 'true');
    }
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showInstallButton) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        // CAMBIO CLAVE: 90px en móvil para estar encima del BottomNav, 85px en desktop
        bottom: { xs: 90, sm: 85 }, 
        left: 16,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'rgba(35, 35, 35, 0.9)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        p: { xs: 1, sm: 1.5 }, // Menos padding en móvil
        animation: 'slideUp 0.4s ease-out',
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        }
      }}
    >
      <Button
        variant="contained"
        startIcon={<DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
        onClick={handleInstallClick}
        sx={{
          bgcolor: '#B8860B', color: '#fff', fontWeight: 700, textTransform: 'none',
          borderRadius: 2, px: { xs: 1.5, sm: 2 }, py: { xs: 0.75, sm: 1 },
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          boxShadow: '0 4px 12px rgba(184, 134, 11, 0.3)',
          '&:hover': { bgcolor: '#9A7209' }
        }}
      >
        Instalar
      </Button>
      
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'block' }, fontSize: '0.75rem' }}>
        Acceso rápido
      </Typography>

      <IconButton size="small" onClick={handleDismiss} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }, p: { xs: 0.5, sm: 1 } }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default InstallPrompt;