import { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Slider, Grid, Divider, TextField, Switch, FormControlLabel, Button 
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// Función robusta para formatear dinero en COP con puntos de miles
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
  
  // Estados para costos adicionales
  const [includeExtras, setIncludeExtras] = useState(false);
  const [adminFee, setAdminFee] = useState(300000);
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

    const monthlyExtras = includeExtras ? adminFee + (annualTaxes / 12) : 0;
    const totalMonthlyPayment = baseMonthlyPayment + monthlyExtras;
    
    const totalInterest = (baseMonthlyPayment * numPayments) - loanAmount;
    const notaryExpenses = price * 0.015; 

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
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50', borderRadius: 3, border: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
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
      border: '1px solid', 
      borderColor: 'grey.200',
      bgcolor: 'background.paper'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AccountBalanceIcon sx={{ color: '#B8860B' }} />
        <Typography variant="h6" fontWeight="700" color="text.primary">
          Simulador de Crédito
        </Typography>
      </Box>

      {/* Resultado Principal */}
      <Box sx={{ 
        bgcolor: 'rgba(184, 134, 11, 0.08)', 
        border: '1px solid rgba(184, 134, 11, 0.2)',
        p: { xs: 1.5, sm: 2 }, 
        borderRadius: 2, 
        textAlign: 'center',
        mb: 3
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          Cuota Mensual Estimada
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
            fontWeight: 800, 
            color: '#B8860B', 
            lineHeight: 1.2,
            wordBreak: 'break-word'
          }}
        >
          {formatCOP(calculations.totalMonthlyPayment)}
        </Typography>
        {includeExtras && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            (Incluye administración e impuestos)
          </Typography>
        )}
      </Box>

      {/* Cuota Inicial */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ flexShrink: 0 }}>Cuota Inicial</Typography>
          <TextField 
            size="small" 
            value={downPaymentPercent} 
            onChange={(e) => setDownPaymentPercent(Math.min(90, Math.max(10, Number(e.target.value))))}
            sx={{ 
              width: { xs: 70, sm: 80 }, 
              flexShrink: 0,
              '& .MuiInputBase-input': { color: '#B8860B', fontWeight: 700, textAlign: 'center', p: '4px 8px', fontSize: { xs: '0.85rem', sm: '1rem' } },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
            }}
            slotProps={{
              input: {
                endAdornment: <Typography sx={{ color: 'text.secondary', mr: 1, fontSize: '0.85rem' }}>%</Typography>
              }
            }}
          />
        </Box>
        <Slider value={downPaymentPercent} onChange={(e, val) => setDownPaymentPercent(val)} min={10} max={90} step={5} sx={{ color: '#B8860B' }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'right' }}>
          {formatCOP(calculations.downPayment)}
        </Typography>
      </Box>

      {/* Tasa de Interés */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ flexShrink: 0 }}>Tasa de Interés</Typography>
          <TextField 
            size="small" 
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            sx={{ 
              width: { xs: 70, sm: 80 }, 
              flexShrink: 0,
              '& .MuiInputBase-input': { color: 'text.primary', fontWeight: 700, textAlign: 'center', p: '4px 8px', fontSize: { xs: '0.85rem', sm: '1rem' } },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
            }}
            slotProps={{
              input: {
                endAdornment: <Typography sx={{ color: 'text.secondary', mr: 1, fontSize: '0.85rem' }}>%</Typography>
              }
            }}
          />
        </Box>
        <Slider value={interestRate} onChange={(e, val) => setInterestRate(val)} min={5} max={25} step={0.1} sx={{ color: 'primary.main' }} />
      </Box>

      {/* Plazo */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ flexShrink: 0 }}>Plazo</Typography>
          <TextField 
            size="small" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            sx={{ 
              width: { xs: 70, sm: 80 }, 
              flexShrink: 0,
              '& .MuiInputBase-input': { color: 'text.primary', fontWeight: 700, textAlign: 'center', p: '4px 8px', fontSize: { xs: '0.85rem', sm: '1rem' } },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
            }}
            slotProps={{
              input: {
                endAdornment: <Typography sx={{ color: 'text.secondary', mr: 1, fontSize: '0.85rem' }}>Años</Typography>
              }
            }}
          />
        </Box>
        <Slider value={years} onChange={(e, val) => setYears(val)} min={5} max={30} step={1} sx={{ color: 'primary.main' }} />
      </Box>

      {/* Switch para Costos Adicionales */}
      <FormControlLabel 
        control={
          <Switch 
            checked={includeExtras} 
            onChange={(e) => setIncludeExtras(e.target.checked)} 
            sx={{ '& .MuiSwitch-thumb': { bgcolor: '#fff' }, '& .MuiSwitch-track': { bgcolor: 'grey.300' }, '&.Mui-checked .MuiSwitch-track': { bgcolor: '#B8860B' } }} 
          />
        }
        label={<Typography variant="body2" color="text.primary">Incluir administración e impuestos</Typography>}
        sx={{ mb: 2 }}
      />

      {includeExtras && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Administración (mensual)</Typography>
              <TextField 
                size="small" 
                fullWidth 
                value={adminFee} 
                onChange={(e) => setAdminFee(Number(e.target.value))} 
                sx={{ 
                  mt: 0.5, 
                  '& .MuiInputBase-input': { color: 'text.primary', fontSize: '0.85rem' }
                }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Impuestos (anual)</Typography>
              <TextField 
                size="small" 
                fullWidth 
                value={annualTaxes} 
                onChange={(e) => setAnnualTaxes(Number(e.target.value))} 
                sx={{ 
                  mt: 0.5, 
                  '& .MuiInputBase-input': { color: 'text.primary', fontSize: '0.85rem' }
                }} 
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Desglose Visual */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>Monto del crédito</Typography>
          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ textAlign: 'right', wordBreak: 'break-word' }}>
            {formatCOP(calculations.loanAmount)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>Intereses totales</Typography>
          <Typography variant="body2" fontWeight="600" color="#B8860B" sx={{ textAlign: 'right', wordBreak: 'break-word' }}>
            {formatCOP(calculations.totalInterest)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', mt: 2, mb: 1 }}>
          <Box sx={{ width: `${calculations.principalPercent}%`, bgcolor: 'primary.main' }} />
          <Box sx={{ width: `${calculations.interestPercent}%`, bgcolor: '#B8860B' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'text.secondary' }}>
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
          bgcolor: 'primary.main', 
          fontWeight: 700, 
          textTransform: 'none',
          '&:hover': { bgcolor: 'primary.dark' }
        }}
        onClick={() => window.open(`https://wa.me/573000000000?text=Hola, estoy interesado en la financiación de la propiedad`, '_blank')}
      >
        Consultar financiación por WhatsApp
      </Button>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', fontSize: '0.7rem' }}>
        *Simulación informativa sujeta a estudio de crédito de la entidad financiera.
      </Typography>
    </Paper>
  );
};

export default FinancialCalculator;