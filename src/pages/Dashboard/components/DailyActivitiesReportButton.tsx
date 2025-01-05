import { FileDown, Loader2 } from 'lucide-react';
import { useTaskStore } from '../../../store/tasks';
import { useOtherActivitiesStore } from '../../../store/otherActivities';
import { useFileStore } from '../../../store/files';
import { useEffect, useState } from 'react';
import { Task } from '../../../types/task';
import { OtherActivity } from '../../../types/OtherActivity';
import { File } from '../../../types/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  tasks: Task[];
  files: File[];
  otherActivities: OtherActivity[];
}

function DailyActivitiesReportButton() {
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const isLoadingTasks = useTaskStore((state) => state.isLoading);

  const activities = useOtherActivitiesStore((state) => state.activities);
  const fetchActivities = useOtherActivitiesStore((state) => state.fetchActivities);
  const isLoadingActivities = useOtherActivitiesStore((state) => state.isLoading);

  const files = useFileStore((state) => state.files);
  const fetchFiles = useFileStore((state) => state.fetchFiles);

  useEffect(() => {
    console.log('Montando DailyActivitiesReportButton - Cargando datos...');
    
    const loadData = async () => {
      setIsLoadingFiles(true);
      try {
        await Promise.all([
          fetchTasks().catch(error => {
            console.error('Error al cargar tareas:', error);
            return [];
          }),
          fetchActivities().catch(error => {
            console.error('Error al cargar actividades:', error);
            return [];
          }),
          fetchFiles().catch(error => {
            console.error('Error al cargar expedientes:', error);
            return [];
          })
        ]);
        console.log('Datos cargados exitosamente');
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    loadData();
  }, [fetchTasks, fetchActivities, fetchFiles]);

  const getTodayItems = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.fecha || task.created_at);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });

    const todayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.created_at);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });

    const todayCompletedFiles = files.filter(file => {
      const fileDate = new Date(file.created_at);
      fileDate.setHours(0, 0, 0, 0);
      return fileDate.getTime() === today.getTime() && file.estado === 'completado';
    });

    console.log('=== Información para el informe ===');
    console.log('Tareas del día:', todayTasks);
    console.log('Otras actividades del día:', todayActivities);
    console.log('Expedientes completados del día:', todayCompletedFiles);
    console.log('================================');

    return {
      tasks: todayTasks,
      files: todayCompletedFiles,
      otherActivities: todayActivities
    };
  };

  const generateDailyReport = (data: ReportData) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Título
    doc.setFontSize(16);
    doc.text(`Informe de Actividades del Día - ${today}`, 20, 20);

    // Tareas
    doc.setFontSize(14);
    doc.text('Tareas del Día:', 20, 40);
    
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

    // Expedientes Completados
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
    doc.text('Otras Actividades del Día:', 20, currentY2);

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

    return doc;
  };

  const handleGenerateReport = () => {
    const reportData = getTodayItems();
    const doc = generateDailyReport(reportData);
    doc.save('informe-actividades-diario.pdf');
  };

  const isLoading = isLoadingTasks || isLoadingActivities || isLoadingFiles;

  return (
    <button
      onClick={handleGenerateReport}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-5 w-5 mr-2" />
      )}
      {isLoading ? 'Cargando...' : 'Informe de Actividades del Día'}
    </button>
  );
}

export default DailyActivitiesReportButton;
