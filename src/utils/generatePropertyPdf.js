import jsPDF from 'jspdf';

// Función auxiliar para formatear dinero
const formatCOP = (value) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(value || 0);
};

const parsePrice = (price) => {
  return Number(String(price).replace(/[^0-9.-]+/g, '')) || 0;
};

export const generatePropertyPdf = (property) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Encabezado con colores de la marca
  doc.setFillColor(26, 58, 82); // Azul oscuro Bienes 360
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Bienes 360º', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Ficha Técnica de Propiedad', 14, 30);

  // 2. Título de la propiedad
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(property.title || 'Propiedad sin título', 14, 55);

  // 3. Precio y Estado
  doc.setFontSize(14);
  doc.setTextColor(76, 175, 80); // Verde de la marca
  doc.text(formatCOP(parsePrice(property.price)), 14, 65);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Estado: ${(property.status || '').toUpperCase()}`, 14, 75);

  // 4. Ubicación
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Ubicación: ${property.address}, ${property.neighborhood}, ${property.city}`, 14, 85);

  // 5. Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 90, pageWidth - 14, 90);

  // 6. Características Principales (Caja destacada)
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, 95, pageWidth - 28, 35, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Área: ${property.area}`, 20, 108);
  doc.text(`Habitaciones: ${property.rooms}`, 20, 118);
  doc.text(`Baños: ${property.baths}`, 80, 108);
  doc.text(`Garajes: ${property.garages || '0'}`, 80, 118);
  doc.text(`Tipo: ${property.type}`, 140, 108);

  // 7. Descripción
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción', 14, 145);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(property.description || 'Sin descripción disponible.', pageWidth - 28);
  doc.text(splitDescription, 14, 155);

  // 8. Pie de página
  doc.setFillColor(26, 58, 82);
  doc.rect(0, 280, pageWidth, 17, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Bienes 360º - Todo en bienes raíces, en un solo lugar.', pageWidth / 2, 288, { align: 'center' });
  doc.text('Documento generado automáticamente. Los valores son referenciales.', pageWidth / 2, 293, { align: 'center' });

  // 9. Descargar
  doc.save(`Ficha_${property.title.replace(/\s+/g, '_')}.pdf`);
};