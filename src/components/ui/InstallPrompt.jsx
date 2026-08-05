import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Collapse } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

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
    });

    // Fallback: Si después de 1.5s no hay evento (ej. iOS), mostramos el botón de todas formas
    const timer = setTimeout(() => {
      if (!isInstalled && !isDismissed && !deferredPrompt) {
        setShowInstallButton(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') localStorage.setItem('appInstalled', 'true');
      else localStorage.setItem('installPromptDismissed', 'true');
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } else {
      // Es iOS o navegador no compatible: mostramos instrucciones manuales
      setShowIosInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    setShowIosInstructions(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showInstallButton && !showIosInstructions) return null;

  return (
    <Box sx={{ position: 'fixed', bottom: { xs: 90, sm: 85 }, left: 16, zIndex: 1050, display: 'flex', flexDirection: 'column', gap: 1 }}>
      
      {/* Mensaje de instrucciones para iOS */}
      <Collapse in={showIosInstructions}>
        <Box sx={{ bgcolor: 'rgba(35, 35, 35, 0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, p: 2, mb: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <Typography variant="body2" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>Para instalar en iPhone:</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
            1. Toca el botón <IosShareIcon sx={{ fontSize: 16 }} /> "Compartir" abajo.<br/>
            2. Desliza y selecciona <strong>"Agregar a Inicio"</strong>.
          </Typography>
        </Box>
      </Collapse>

      {/* Botón Principal */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(35, 35, 35, 0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', p: { xs: 1, sm: 1.5 }, animation: 'slideUp 0.4s ease-out', '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
        <Button variant="contained" startIcon={<DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} onClick={handleInstallClick} sx={{ bgcolor: '#B8860B', color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: 2, px: { xs: 1.5, sm: 2 }, py: { xs: 0.75, sm: 1 }, fontSize: { xs: '0.8rem', sm: '0.875rem' }, '&:hover': { bgcolor: '#9A7209' } }}>
          {deferredPrompt ? 'Instalar App' : 'Agregar a Inicio'}
        </Button>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'block' }, fontSize: '0.75rem' }}>Acceso rápido</Typography>
        <IconButton size="small" onClick={handleDismiss} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default InstallPrompt;