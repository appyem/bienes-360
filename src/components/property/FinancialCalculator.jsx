import { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Slider, Grid, Divider, TextField, Switch, FormControlLabel, Button 
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';


// Función robusta para formatear dinero en COP con puntos de miles (ej: 1.500.000)
const formatCOP = (value) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(value);
};

const parsePrice = (price) => {
  return Number(String(price).replace(/[^0-9.-]+/g, '')) || 0;
};

const FinancialCalculator = ({ propertyPrice }) => {
  const price = parsePrice(propertyPrice);

  // Estados
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [interestRate, setInterestRate] = useState(13);
  const [years, setYears] = useState(15);
  
  // Nuevos estados para costos adicionales (estilo Zillow)
  const [includeExtras, setIncludeExtras] = useState(false);
  const [adminFee, setAdminFee] = useState(300000); // Valor por defecto estimado
  const [annualTaxes, setAnnualTaxes] = useState(0);

  // Cálculos en tiempo real
  const calculations = useMemo(() => {
    if (price === 0) return null;

    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = years * 12;
    
    const baseMonthlyPayment = monthlyRate > 0 
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

    // Si se incluyen extras, se suman a la cuota mensual
    const monthlyExtras = includeExtras ? adminFee + (annualTaxes / 12) : 0;
    const totalMonthlyPayment = baseMonthlyPayment + monthlyExtras;
    
    const totalInterest = (baseMonthlyPayment * numPayments) - loanAmount;
    const notaryExpenses = price * 0.015; 

    // Porcentaje para la barra visual (Capital vs Intereses)
    const totalPaid = (baseMonthlyPayment * numPayments);
    const principalPercent = totalPaid > 0 ? (loanAmount / totalPaid) * 100 : 0;
    const interestPercent = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;

    return {
      downPayment,
      loanAmount,
      baseMonthlyPayment,
      totalMonthlyPayment,
      monthlyExtras,
      totalInterest,
      notaryExpenses,
      principalPercent,
      interestPercent
    };
  }, [price, downPaymentPercent, interestRate, years, includeExtras, adminFee, annualTaxes]);

  if (!calculations || price === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'rgba(35, 35, 35, 0.5)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Precio no disponible para simulación.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      mt: 3, 
      borderRadius: 3, 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      bgcolor: 'rgba(35, 35, 35, 0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AccountBalanceIcon sx={{ color: '#B8860B' }} />
        <Typography variant="h6" fontWeight="700" sx={{ color: '#FFFFFF' }}>
          Simulador de Crédito
        </Typography>
      </Box>

      {/* Resultado Principal (Foco visual) */}
      <Box sx={{ 
        bgcolor: 'rgba(184, 134, 11, 0.15)', 
        border: '1px solid rgba(184, 134, 11, 0.3)',
        p: 2, 
        borderRadius: 2, 
        textAlign: 'center',
        mb: 3
      }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Cuota Mensual Estimada
        </Typography>
        <Typography variant="h3" fontWeight="800" sx={{ color: '#B8860B', mt: 0.5, lineHeight: 1.2 }}>
          {formatCOP(calculations.totalMonthlyPayment)}
        </Typography>
        {includeExtras && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            (Incluye administración e impuestos)
          </Typography>
        )}
      </Box>

      {/* Sliders Híbridos (Estilo Zillow) */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>Cuota Inicial</Typography>
          <TextField 
            size="small" 
            value={downPaymentPercent} 
            onChange={(e) => setDownPaymentPercent(Math.min(90, Math.max(10, Number(e.target.value))))}
            sx={{ 
              width: 80, 
              '& .MuiInputBase-input': { color: '#B8860B', fontWeight: 700, textAlign: 'center', p: '4px 8px' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.05)' },
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
            }}
            InputProps={{ endAdornment: <Typography sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>%</Typography> }}
          />
        </Box>
        <Slider value={downPaymentPercent} onChange={(e, val) => setDownPaymentPercent(val)} min={10} max={90} step={5} sx={{ color: '#B8860B', '& .MuiSlider-thumb': { width: 20, height: 20 } }} />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', textAlign: 'right' }}>
          {formatCOP(calculations.downPayment)}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>Tasa de Interés</Typography>
          <TextField 
            size="small" 
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            sx={{ 
              width: 80, 
              '& .MuiInputBase-input': { color: '#fff', fontWeight: 700, textAlign: 'center', p: '4px 8px' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.05)' },
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
            }}
            InputProps={{ endAdornment: <Typography sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>%</Typography> }}
          />
        </Box>
        <Slider value={interestRate} onChange={(e, val) => setInterestRate(val)} min={5} max={25} step={0.1} sx={{ color: '#1E3A5F', '& .MuiSlider-thumb': { width: 20, height: 20 } }} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>Plazo</Typography>
          <TextField 
            size="small" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            sx={{ 
              width: 80, 
              '& .MuiInputBase-input': { color: '#fff', fontWeight: 700, textAlign: 'center', p: '4px 8px' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.05)' },
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
            }}
            InputProps={{ endAdornment: <Typography sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>Años</Typography> }}
          />
        </Box>
        <Slider value={years} onChange={(e, val) => setYears(val)} min={5} max={30} step={1} sx={{ color: '#1E3A5F', '& .MuiSlider-thumb': { width: 20, height: 20 } }} />
      </Box>

      {/* Switch para Costos Adicionales */}
      <FormControlLabel 
        control={
          <Switch 
            checked={includeExtras} 
            onChange={(e) => setIncludeExtras(e.target.checked)} 
            sx={{ '& .MuiSwitch-thumb': { bgcolor: '#fff' }, '& .MuiSwitch-track': { bgcolor: 'rgba(255,255,255,0.3)' }, '&.Mui-checked .MuiSwitch-track': { bgcolor: '#B8860B' } }} 
          />
        }
        label={<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Incluir administración e impuestos</Typography>}
        sx={{ mb: 2 }}
      />

      {includeExtras && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Administración (mensual)</Typography>
              <TextField size="small" fullWidth value={adminFee} onChange={(e) => setAdminFee(Number(e.target.value))} sx={{ mt: 0.5, '& .MuiInputBase-input': { color: '#fff', fontSize: '0.85rem' }, '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.05)' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Impuestos (anual)</Typography>
              <TextField size="small" fullWidth value={annualTaxes} onChange={(e) => setAnnualTaxes(Number(e.target.value))} sx={{ mt: 0.5, '& .MuiInputBase-input': { color: '#fff', fontSize: '0.85rem' }, '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.05)' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            </Grid>
          </Grid>
        </Box>
      )}

      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Desglose Visual */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Monto del crédito</Typography>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#fff' }}>{formatCOP(calculations.loanAmount)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Intereses totales</Typography>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#B8860B' }}>{formatCOP(calculations.totalInterest)}</Typography>
        </Box>
        
        {/* Barra visual de proporción */}
        <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', mt: 2, mb: 1 }}>
          <Box sx={{ width: `${calculations.principalPercent}%`, bgcolor: '#1E3A5F' }} />
          <Box sx={{ width: `${calculations.interestPercent}%`, bgcolor: '#B8860B' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
          <span>Capital: {Math.round(calculations.principalPercent)}%</span>
          <span>Intereses: {Math.round(calculations.interestPercent)}%</span>
        </Box>
      </Box>

      <Button 
        fullWidth 
        variant="contained" 
        sx={{ 
          mt: 2, 
          py: 1.5, 
          borderRadius: 2, 
          bgcolor: '#1E3A5F', 
          fontWeight: 700, 
          textTransform: 'none',
          '&:hover': { bgcolor: '#162B47' }
        }}
        onClick={() => window.open(`https://wa.me/573000000000?text=Hola, estoy interesado en la financiación de la propiedad: ${propertyPrice}`, '_blank')}
      >
        Consultar financiación por WhatsApp
      </Button>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '0.7rem' }}>
        *Simulación informativa sujeta a estudio de crédito de la entidad financiera.
      </Typography>
    </Paper>
  );
};

export default FinancialCalculator;