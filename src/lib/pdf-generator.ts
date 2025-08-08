import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingData {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
  price: number;
}

interface ReportData {
  businessName: string;
  period: string;
  startDate: Date;
  endDate: Date;
  bookings: BookingData[];
  totalRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}

export function generateDashboardPDF(data: ReportData) {
  const doc = new jsPDF();
  
  // Configurar fuentes
  doc.setFont('helvetica');
  
  // Título del reporte
  doc.setFontSize(20);
  doc.setTextColor(75, 85, 99);
  doc.text('Reporte de Negocio', 20, 30);
  
  // Información del negocio
  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128);
  doc.text(data.businessName, 20, 45);
  
  // Período del reporte
  doc.setFontSize(12);
  doc.text(`Período: ${data.period}`, 20, 55);
  doc.text(`Desde: ${format(data.startDate, 'dd/MM/yyyy', { locale: es })}`, 20, 65);
  doc.text(`Hasta: ${format(data.endDate, 'dd/MM/yyyy', { locale: es })}`, 20, 75);
  
  // Estadísticas principales
  doc.setFontSize(16);
  doc.setTextColor(75, 85, 99);
  doc.text('Resumen', 20, 95);
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(`Total de reservas: ${data.totalBookings}`, 20, 105);
  doc.text(`Reservas confirmadas: ${data.confirmedBookings}`, 20, 115);
  doc.text(`Reservas pendientes: ${data.pendingBookings}`, 20, 125);
  doc.text(`Reservas canceladas: ${data.cancelledBookings}`, 20, 135);
  doc.text(`Ingresos totales: $${data.totalRevenue.toLocaleString('es-CL')}`, 20, 145);
  
  // Tabla de reservas
  if (data.bookings.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(75, 85, 99);
    doc.text('Detalle de Reservas', 20, 165);
    
    const tableData = data.bookings.map(booking => [
      booking.customer_name,
      booking.service_name,
      format(new Date(booking.booking_date), 'dd/MM/yyyy', { locale: es }),
      booking.booking_time,
      booking.status === 'confirmed' ? 'Confirmada' : 
      booking.status === 'pending' ? 'Pendiente' : 
      booking.status === 'cancelled' ? 'Cancelada' : 'Completada',
      `$${booking.price.toLocaleString('es-CL')}`
    ]);
    
    autoTable(doc, {
      head: [['Cliente', 'Servicio', 'Fecha', 'Hora', 'Estado', 'Precio']],
      body: tableData,
      startY: 175,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [139, 92, 246], // Lavender
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });
  }
  
  // Pie de página
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
      20,
      doc.internal.pageSize.height - 10
    );
  }
  
  return doc;
}

export function downloadPDF(data: ReportData, filename?: string) {
  const doc = generateDashboardPDF(data);
  const defaultFilename = `reporte-${data.businessName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(filename || defaultFilename);
} 