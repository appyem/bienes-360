import { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Slider, Grid, Divider 
} from '@mui/material';

// Función auxiliar para formatear dinero en COP
const formatCOP = (value) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(value);
};

// Función auxiliar para limpiar el precio (por si viene con signos o comas)
const parsePrice = (price) => {
  return Number(String(price).replace(/[^0-9.-]+/g, '')) || 0;
};

const FinancialCalculator = ({ propertyPrice }) => {
  const price = parsePrice(propertyPrice);

  // Estados para los inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(30); // 30% inicial
  const [interestRate, setInterestRate] = useState(13); // 13% E.A.
  const [years, setYears] = useState(15); // 15 años

  // Cálculos en tiempo real
  const calculations = useMemo(() => {
    if (price === 0) return null;

    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = years * 12;
    
    // Cálculo limpio sin reasignación para evitar warning de ESLint
    const monthlyPayment = monthlyRate > 0 
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    const notaryExpenses = price * 0.015; // Estimado 1.5% para escrituración

    return {
      downPayment,
      loanAmount,
      monthlyPayment,
      totalInterest,
      notaryExpenses
    };
  }, [price, downPaymentPercent, interestRate, years]);

  if (!calculations) {
    return (
      <Paper sx={{ p: 3, mt: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Ingresa un precio válido para simular el crédito.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom color="primary.main">
        🧮 Simulador de Crédito
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ajusta los valores para ver tu cuota estimada.
      </Typography>

      {/* Cuota Inicial */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="600">Cuota Inicial</Typography>
          <Typography variant="body2" fontWeight="700" color="secondary.main">
            {downPaymentPercent}% ({formatCOP(calculations.downPayment)})
          </Typography>
        </Box>
        <Slider
          value={downPaymentPercent}
          onChange={(e, val) => setDownPaymentPercent(val)}
          min={10}
          max={70}
          step={5}
          color="secondary"
          valueLabelDisplay="auto"
        />
      </Box>

      {/* Tasa de Interés */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="600">Tasa de Interés (E.A.)</Typography>
          <Typography variant="body2" fontWeight="700">{interestRate}%</Typography>
        </Box>
        <Slider
          value={interestRate}
          onChange={(e, val) => setInterestRate(val)}
          min={5}
          max={20}
          step={0.5}
          color="primary"
          valueLabelDisplay="auto"
        />
      </Box>

      {/* Plazo */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="600">Plazo (Años)</Typography>
          <Typography variant="body2" fontWeight="700">{years} años</Typography>
        </Box>
        <Slider
          value={years}
          onChange={(e, val) => setYears(val)}
          min={5}
          max={20}
          step={1}
          color="primary"
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Resultados */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2, 
        borderRadius: 2, 
        textAlign: 'center',
        mb: 2
      }}>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Cuota Mensual Estimada
        </Typography>
        <Typography variant="h4" fontWeight="800" sx={{ mt: 1 }}>
          {formatCOP(calculations.monthlyPayment)}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">Monto del crédito</Typography>
          <Typography variant="body2" fontWeight="600">{formatCOP(calculations.loanAmount)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">Intereses totales</Typography>
          <Typography variant="body2" fontWeight="600">{formatCOP(calculations.totalInterest)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">Gastos de escrituración (est. 1.5%)</Typography>
          <Typography variant="body2" fontWeight="600" color="secondary.main">{formatCOP(calculations.notaryExpenses)}</Typography>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
        *Simulación informativa. Los valores reales dependen de la entidad financiera.
      </Typography>
    </Paper>
  );
};

export default FinancialCalculator;