import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Task } from '../types/task';
import { File } from '../types/api';
import { OtherActivity } from '../types/OtherActivity';

interface ReportData {
  tasks: Task[];
  files: File[];
  otherActivities: OtherActivity[];
}

export function generateDailyReport(data: ReportData) {
  console.log('Generando PDF con los siguientes datos:', data);
  
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString();

  // Título
  doc.setFontSize(16);
  doc.text(`Informe Diario - ${today}`, 20, 20);

  // Tareas
  doc.setFontSize(14);
  doc.text('Tareas Completadas:', 20, 40);
  
  const taskRows = data.tasks.map(task => [
    task.tipo_acta,
    task.numero_acta,
    task.descripcion_falta,
    task.estado
  ]);

  (doc as any).autoTable({
    startY: 45,
    head: [['Tipo', 'Número', 'Descripción', 'Estado']],
    body: taskRows,
  });

  // Expedientes
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Expedientes Completados:', 20, currentY);

  const fileRows = data.files.map(file => [
    file.numeroExpediente,
    file.caratula,
    file.destino || '',
    file.observaciones || ''
  ]);

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['Número', 'Carátula', 'Destino', 'Observaciones']],
    body: fileRows,
  });

  // Otras Actividades
  const currentY2 = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Otras Actividades Completadas:', 20, currentY2);

  const activityRows = data.otherActivities.map(activity => [
    activity.descripcion,
    activity.tipo,
    activity.estado,
    new Date(activity.created_at).toLocaleDateString()
  ]);

  (doc as any).autoTable({
    startY: currentY2 + 5,
    head: [['Descripción', 'Tipo', 'Estado', 'Fecha']],
    body: activityRows,
  });

  console.log('PDF generado exitosamente');
  return doc;
}