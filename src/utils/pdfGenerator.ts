import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../types/task';
import { File } from '../types/file';
import { AdditionalActivity } from '../types/additionalActivity';

interface DailyReport {
  tasks: Task[];
  pendingTasks: Task[];
  files: File[];
  activities: AdditionalActivity[];
  date: Date;
}

export const generateDailyReport = (data: DailyReport) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Título y fecha
  doc.setFontSize(20);
  doc.text('Informe Diario de Actividades', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(
    `Fecha: ${format(data.date, 'dd/MM/yyyy', { locale: es })}`,
    pageWidth / 2,
    30,
    { align: 'center' }
  );

  // Resumen
  doc.setFontSize(14);
  doc.text('Resumen del Día:', 14, 40);
  doc.setFontSize(12);
  doc.text(`Total de Tareas: ${data.tasks.length + data.pendingTasks.length}`, 20, 48);
  doc.text(`Tareas Completadas: ${data.tasks.length}`, 20, 54);
  doc.text(`Tareas Pendientes: ${data.pendingTasks.length}`, 20, 60);
  doc.text(`Expedientes Completados: ${data.files.length}`, 20, 66);
  doc.text(`Actividades Adicionales: ${data.activities.length}`, 20, 72);

  let yPos = 85;

  // Sección de Tareas Completadas
  if (data.tasks.length > 0) {
    doc.setFontSize(16);
    doc.text('Tareas Completadas', 14, yPos);

    const completedTaskRows = data.tasks.map(task => [
      format(new Date(task.fecha + 'T12:00:00'), 'dd/MM/yyyy'),
      task.tipoActa,
      task.numeroActa,
      task.infractor.nombre,
      task.descripcionFalta || '',
      task.historialEstados[task.historialEstados.length - 1]?.observaciones || ''
    ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Fecha', 'Tipo', 'Número', 'Infractor', 'Descripción', 'Observaciones']],
      body: completedTaskRows,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 45 },
        5: { cellWidth: 35 }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Sección de Tareas Pendientes
  if (data.pendingTasks.length > 0) {
    doc.setFontSize(16);
    doc.text('Tareas Pendientes', 14, yPos);

    const pendingTaskRows = data.pendingTasks.map(task => [
      format(new Date(task.fecha + 'T12:00:00'), 'dd/MM/yyyy'),
      task.tipoActa,
      task.numeroActa,
      task.infractor.nombre,
      task.descripcionFalta || ''
    ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Fecha', 'Tipo', 'Número', 'Infractor', 'Descripción']],
      body: pendingTaskRows,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
        4: { cellWidth: 55 }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Sección de Expedientes Completados
  if (data.files.length > 0) {
    doc.setFontSize(16);
    doc.text('Expedientes Completados', 14, yPos);

    const fileRows = data.files.map(file => [
      format(new Date(file.fecha + 'T12:00:00'), 'dd/MM/yyyy'),
      file.numeroExpediente,
      file.observaciones || '',
      file.estado
    ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Fecha', 'Número', 'Descripción', 'Estado']],
      body: fileRows,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 95 },
        3: { cellWidth: 30 }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Sección de Actividades Adicionales
  if (data.activities.length > 0) {
    doc.setFontSize(16);
    doc.text('Actividades Adicionales', 14, yPos);

    const activityRows = data.activities.map((activity, index) => [
      format(new Date(activity.createdAt + 'T12:00:00'), 'dd/MM/yyyy'),
      activity.description
    ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Fecha', 'Descripción']],
      body: activityRows,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 150 }
      }
    });
  }

  return doc;
};