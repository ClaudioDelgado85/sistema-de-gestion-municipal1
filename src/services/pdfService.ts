import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Task } from '../types/task';
import { File } from '../types/file';
import { OtherActivity } from '../types/OtherActivity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface ReportData {
  tasks: Task[];
  files: File[];
  otherActivities: OtherActivity[];
  date: Date;
}

export interface ReportOptions {
  showTaskDetails?: boolean;
  showFileDetails?: boolean;
  showActivityDetails?: boolean;
  includeObservations?: boolean;
  pageSize?: string; // 'a4', 'letter', etc.
  orientation?: 'portrait' | 'landscape';
}

const defaultOptions: ReportOptions = {
  showTaskDetails: true,
  showFileDetails: true,
  showActivityDetails: true,
  includeObservations: true,
  pageSize: 'a4',
  orientation: 'portrait'
};

/**
 * Genera un informe PDF de actividades diarias
 * @param data Datos para el informe
 * @param options Opciones de configuración del informe
 * @returns Documento PDF generado
 */
export function generateDailyReport(data: ReportData, options: ReportOptions = {}): jsPDF {
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Crear documento con las opciones especificadas
  const doc = new jsPDF({
    orientation: mergedOptions.orientation,
    unit: 'mm',
    format: mergedOptions.pageSize
  });

  // Formatear la fecha para el título
  const formattedDate = format(data.date, 'dd/MM/yyyy', { locale: es });

  // Configurar título del documento
  doc.setFontSize(16);
  doc.text(`Informe de Actividades - ${formattedDate}`, 20, 20);

  let currentY = 40;

  // Sección de tareas
  if (mergedOptions.showTaskDetails && data.tasks.length > 0) {
    doc.setFontSize(14);
    doc.text('Tareas del Día:', 20, currentY);
    
    const taskRows = data.tasks.map(task => {
      const row = [
        task.tipo_acta,
        task.numero_acta,
        task.infractor_nombre,
        task.descripcion_falta
      ];
      
      if (mergedOptions.includeObservations && task.observaciones) {
        row.push(task.observaciones);
      }
      
      return row;
    });

    const headers = ['Tipo', 'Número de Acta', 'Nombre del Infractor', 'Descripción de la Falta'];
    if (mergedOptions.includeObservations) {
      headers.push('Observaciones');
    }

    (doc as any).autoTable({
      startY: currentY + 5,
      head: [headers],
      body: taskRows,
      didDrawPage: (data: any) => {
        // Agregar pie de página con número de página
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  } else if (data.tasks.length === 0) {
    doc.setFontSize(12);
    doc.text('No hay tareas registradas para esta fecha', 20, currentY);
    currentY += 10;
  }

  // Sección de expedientes
  if (mergedOptions.showFileDetails && data.files.length > 0) {
    doc.setFontSize(14);
    doc.text('Expedientes Completados:', 20, currentY);

    const fileRows = data.files.map(file => {
      const row = [
        file.numeroExpediente,
        file.caratula,
        file.destino || ''
      ];
      
      if (mergedOptions.includeObservations && file.observaciones) {
        row.push(file.observaciones);
      }
      
      return row;
    });

    const headers = ['Número de Expediente', 'Carátula', 'Destino'];
    if (mergedOptions.includeObservations) {
      headers.push('Observaciones');
    }

    (doc as any).autoTable({
      startY: currentY + 5,
      head: [headers],
      body: fileRows
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  } else if (data.files.length === 0) {
    doc.setFontSize(12);
    doc.text('No hay expedientes completados para esta fecha', 20, currentY);
    currentY += 10;
  }

  // Sección de otras actividades
  if (mergedOptions.showActivityDetails && data.otherActivities.length > 0) {
    doc.setFontSize(14);
    doc.text('Otras Actividades del Día:', 20, currentY);

    const activityRows = data.otherActivities.map(activity => {
      const row = [
        activity.descripcion,
        activity.tipo,
        activity.direccion || ''
      ];
      
      if (mergedOptions.includeObservations && activity.observaciones) {
        row.push(activity.observaciones);
      }
      
      return row;
    });

    const headers = ['Descripción', 'Tipo', 'Dirección'];
    if (mergedOptions.includeObservations) {
      headers.push('Observaciones');
    }

    (doc as any).autoTable({
      startY: currentY + 5,
      head: [headers],
      body: activityRows
    });
  } else if (data.otherActivities.length === 0) {
    doc.setFontSize(12);
    doc.text('No hay otras actividades registradas para esta fecha', 20, currentY);
  }

  return doc;
}

/**
 * Genera y descarga un informe PDF
 * @param data Datos para el informe
 * @param options Opciones de configuración
 * @param filename Nombre del archivo a descargar
 */
export function generateAndDownloadReport(data: ReportData, options: ReportOptions = {}, filename?: string): void {
  const doc = generateDailyReport(data, options);
  const formattedDate = format(data.date, 'dd-MM-yyyy', { locale: es });
  const outputFilename = filename || `informe-actividades-${formattedDate}.pdf`;
  doc.save(outputFilename);
}

/**
 * Obtiene una vista previa del informe como URL de datos
 * @param data Datos para el informe
 * @param options Opciones de configuración
 * @returns URL de datos del PDF
 */
export function getReportPreviewUrl(data: ReportData, options: ReportOptions = {}): string {
  const doc = generateDailyReport(data, options);
  return doc.output('datauristring');
}