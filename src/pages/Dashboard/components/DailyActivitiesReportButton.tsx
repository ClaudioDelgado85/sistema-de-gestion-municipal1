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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ReportData {
  tasks: Task[];
  files: File[];
  otherActivities: OtherActivity[];
}

function DailyActivitiesReportButton() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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

  const getItemsForDate = () => {
    if (!selectedDate) return {
      tasks: [],
      files: [],
      otherActivities: []
    };

    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    const filteredTasks = tasks.filter(task => {
      // Añadir 'T12:00:00' para asegurar que la fecha se interprete correctamente en la zona horaria local
      const taskFecha = task.fecha || task.created_at;
      const taskDateStr = taskFecha.includes('T') ? taskFecha : `${taskFecha}T12:00:00`;
      const taskDate = new Date(taskDateStr);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === targetDate.getTime();
    });

    const filteredActivities = activities.filter(activity => {
      const activityDateStr = activity.created_at.includes('T') ? activity.created_at : `${activity.created_at}T12:00:00`;
      const activityDate = new Date(activityDateStr);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === targetDate.getTime();
    });

    const filteredCompletedFiles = files.filter(file => {
      const fileDateStr = file.created_at.includes('T') ? file.created_at : `${file.created_at}T12:00:00`;
      const fileDate = new Date(fileDateStr);
      fileDate.setHours(0, 0, 0, 0);
      return fileDate.getTime() === targetDate.getTime() && file.estado === 'completado';
    });

    console.log('=== Información para el informe ===');
    console.log('Fecha seleccionada:', format(targetDate, 'dd/MM/yyyy'));
    console.log('Tareas del día:', filteredTasks);
    console.log('Otras actividades del día:', filteredActivities);
    console.log('Expedientes completados del día:', filteredCompletedFiles);
    console.log('================================');

    return {
      tasks: filteredTasks,
      files: filteredCompletedFiles,
      otherActivities: filteredActivities
    };
  };

  const generateDailyReport = (data: ReportData) => {
    if (!selectedDate) return;
    
    const doc = new jsPDF();
    const formattedDate = format(selectedDate, 'dd/MM/yyyy');

    // Título
    doc.setFontSize(16);
    doc.text(`Informe de Actividades - ${formattedDate}`, 20, 20);

    // Tareas
    doc.setFontSize(14);
    doc.text('Tareas del Día:', 20, 40);
    
    const taskRows = data.tasks.map(task => [
      task.tipo_acta,
      task.numero_acta,
      task.infractor_nombre,
      task.descripcion_falta
    ]);

    (doc as any).autoTable({
      startY: 45,
      head: [['Tipo', 'Número de Acta', 'Nombre del Infractor', 'Descripción de la Falta']],
      body: taskRows,
    });

    // Expedientes Completados
    const currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Expedientes Completados:', 20, currentY);

    const fileRows = data.files.map(file => [
      file.numeroExpediente,
      file.caratula,
      file.destino || ''
    ]);

    (doc as any).autoTable({
      startY: currentY + 5,
      head: [['Número de Expediente', 'Carátula', 'Destino']],
      body: fileRows,
    });

    // Otras Actividades
    const currentY2 = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Otras Actividades del Día:', 20, currentY2);

    const activityRows = data.otherActivities.map(activity => [
      activity.descripcion,
      activity.direccion
    ]);

    (doc as any).autoTable({
      startY: currentY2 + 5,
      head: [['Descripción', 'Dirección']],
      body: activityRows,
    });

    return doc;
  };

  const handleGenerateReport = () => {
    if (!selectedDate) return;
    
    const reportData = getItemsForDate();
    const doc = generateDailyReport(reportData);
    if (!doc) return; // Si generateDailyReport retorna undefined
    
    const formattedDate = format(selectedDate, 'dd-MM-yyyy');
    doc.save(`informe-actividades-${formattedDate}.pdf`);
  };

  const isLoading = isLoadingTasks || isLoadingActivities || isLoadingFiles;

  return (
    <div className="flex items-center gap-4">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        locale={es}
      />
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
        {isLoading ? 'Cargando...' : 'Generar Informe'}
      </button>
    </div>
  );
}

export default DailyActivitiesReportButton;
