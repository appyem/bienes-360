import { Button } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useCompare } from '../../hooks/useCompare'; // <-- Ruta corregida

const CompareButton = ({ property, variant = "outlined", size = "small" }) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isAdded = isInCompare(property.id);

  const handleClick = () => {
    if (isAdded) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property);
    }
  };

  return (
    <Button
      variant={isAdded ? "contained" : variant}
      color={isAdded ? "secondary" : "primary"}
      size={size}
      startIcon={<CompareArrowsIcon />}
      onClick={handleClick}
      sx={{ textTransform: 'none', fontWeight: 600 }}
    >
      {isAdded ? 'Quitando de Comparar' : 'Comparar'}
    </Button>
  );
};

export default CompareButton;