import { useState, useCallback } from 'react';
import { CompareContext } from './compareContext';

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = useCallback((property) => {
    setCompareList((prev) => {
      if (prev.find(p => p.id === property.id)) return prev;
      if (prev.length >= 3) {
        alert('Solo puedes comparar hasta 3 propiedades a la vez.');
        return prev;
      }
      return [...prev, property];
    });
  }, []);

  const removeFromCompare = useCallback((propertyId) => {
    setCompareList((prev) => prev.filter(p => p.id !== propertyId));
  }, []);

  const isInCompare = useCallback((propertyId) => {
    return compareList.some(p => p.id === propertyId);
  }, [compareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return (
    <CompareContext.Provider value={{ 
      compareList, 
      addToCompare, 
      removeFromCompare, 
      isInCompare, 
      clearCompare 
    }}>
      {children}
    </CompareContext.Provider>
  );
};