import { FileDown, Loader2, Eye, Settings } from 'lucide-react';
import { useTaskStore } from '../../../store/tasks';
import { useOtherActivitiesStore } from '../../../store/otherActivities';
import { useFileStore } from '../../../store/files';
import { useEffect, useState } from 'react';
import { Task } from '../../../types/task';
import { OtherActivity } from '../../../types/OtherActivity';
import { File } from '../../../types/file';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ReportData, ReportOptions, generateAndDownloadReport, getReportPreviewUrl } from '../../../services/pdfService';

interface ReportFormOptions extends ReportOptions {
  showPreview: boolean;
}

function DailyActivitiesReportButton() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [reportOptions, setReportOptions] = useState<ReportFormOptions>({
    showTaskDetails: true,
    showFileDetails: true,
    showActivityDetails: true,
    includeObservations: true,
    orientation: 'portrait',
    pageSize: 'a4',
    showPreview: false
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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

  const getItemsForDate = (): ReportData => {
    if (!selectedDate) return {
      tasks: [],
      files: [],
      otherActivities: [],
      date: new Date()
    };

    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    const filteredTasks = tasks.filter(task => {
      // Normalizar la fecha para evitar problemas de zona horaria
      const taskFecha = task.fecha || task.created_at;
      let taskDate: Date;
      
      if (taskFecha.includes('T')) {
        // Si ya tiene formato ISO
        taskDate = parseISO(taskFecha);
      } else {
        // Si es solo fecha YYYY-MM-DD, añadir hora
        taskDate = parseISO(`${taskFecha}T00:00:00`);
      }
      
      // Crear una nueva fecha con los mismos componentes de año, mes y día
      // para evitar problemas de zona horaria
      const normalizedDate = new Date(
        taskDate.getFullYear(),
        taskDate.getMonth(),
        taskDate.getDate(),
        0, 0, 0, 0
      );
      
      return normalizedDate.getTime() === targetDate.getTime();
    });
    
    console.log('Debug - Fecha objetivo:', targetDate.toISOString());

    const filteredActivities = activities.filter(activity => {
      let activityDate: Date;
      
      if (activity.fecha) {
        // Usar fecha específica si existe
        activityDate = activity.fecha.includes('T') 
          ? parseISO(activity.fecha)
          : parseISO(`${activity.fecha}T00:00:00`);
      } else {
        // Usar created_at como fallback
        activityDate = activity.created_at.includes('T')
          ? parseISO(activity.created_at)
          : parseISO(`${activity.created_at}T00:00:00`);
      }
      
      // Crear una nueva fecha con los mismos componentes de año, mes y día
      const normalizedDate = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate(),
        0, 0, 0, 0
      );
      
      return normalizedDate.getTime() === targetDate.getTime();
    });

    const filteredCompletedFiles = files.filter(file => {
      let fileDate: Date;
      
      if (file.fecha) {
        fileDate = file.fecha.includes('T')
          ? parseISO(file.fecha)
          : parseISO(`${file.fecha}T00:00:00`);
      } else {
        fileDate = file.created_at.includes('T')
          ? parseISO(file.created_at)
          : parseISO(`${file.created_at}T00:00:00`);
      }
      
      // Crear una nueva fecha con los mismos componentes de año, mes y día
      const normalizedDate = new Date(
        fileDate.getFullYear(),
        fileDate.getMonth(),
        fileDate.getDate(),
        0, 0, 0, 0
      );
      
      return normalizedDate.getTime() === targetDate.getTime() && file.estado === 'completado';
    });

    console.log('=== Información para el informe ===');
    console.log('Fecha seleccionada:', format(targetDate, 'dd/MM/yyyy'));
    console.log('Tareas del día:', filteredTasks.length);
    console.log('Otras actividades del día:', filteredActivities.length);
    console.log('Expedientes completados del día:', filteredCompletedFiles.length);
    console.log('================================');

    return {
      tasks: filteredTasks,
      files: filteredCompletedFiles,
      otherActivities: filteredActivities,
      date: targetDate
    };
  };

  const toggleOptionsModal = () => {
    setShowOptionsModal(!showOptionsModal);
    // Cerrar la vista previa si estaba abierta
    if (previewUrl) {
      setPreviewUrl(null);
    }
  };
  
  const handleOptionChange = (key: keyof ReportFormOptions, value: boolean | string) => {
    setReportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateReport = () => {
    if (!selectedDate) return;
    
    const reportData = getItemsForDate();
    
    // Extraer las opciones relevantes para el informe (excluyendo showPreview)
    const { showPreview, ...pdfOptions } = reportOptions;
    
    if (showPreview) {
      // Generar URL para vista previa
      const previewDataUrl = getReportPreviewUrl(reportData, pdfOptions);
      setPreviewUrl(previewDataUrl);
    } else {
      // Descargar directamente
      generateAndDownloadReport(reportData, pdfOptions);
    }
    
    // Cerrar el modal de opciones si estaba abierto
    if (showOptionsModal) {
      setShowOptionsModal(false);
    }
  };
  
  const closePreview = () => {
    setPreviewUrl(null);
  };

  const isLoading = isLoadingTasks || isLoadingActivities || isLoadingFiles;

  return (
    <>
      {/* Modal de opciones */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={toggleOptionsModal} />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold mb-4">Opciones del Informe</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Contenido del informe</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={reportOptions.showTaskDetails}
                          onChange={(e) => handleOptionChange('showTaskDetails', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm">Incluir tareas</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={reportOptions.showFileDetails}
                          onChange={(e) => handleOptionChange('showFileDetails', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm">Incluir expedientes</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={reportOptions.showActivityDetails}
                          onChange={(e) => handleOptionChange('showActivityDetails', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm">Incluir otras actividades</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={reportOptions.includeObservations}
                          onChange={(e) => handleOptionChange('includeObservations', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm">Incluir observaciones</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Formato del documento</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tamaño de página</label>
                        <select
                          value={reportOptions.pageSize}
                          onChange={(e) => handleOptionChange('pageSize', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="a4">A4</option>
                          <option value="letter">Carta</option>
                          <option value="legal">Legal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Orientación</label>
                        <select
                          value={reportOptions.orientation}
                          onChange={(e) => handleOptionChange('orientation', e.target.value as 'portrait' | 'landscape')}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="portrait">Vertical</option>
                          <option value="landscape">Horizontal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={reportOptions.showPreview}
                        onChange={(e) => handleOptionChange('showPreview', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm">Vista previa antes de descargar</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  {reportOptions.showPreview ? 'Generar Vista Previa' : 'Descargar Informe'}
                </button>
                <button
                  type="button"
                  onClick={toggleOptionsModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Vista previa del PDF */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closePreview} />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl h-[80vh]">
              <div className="absolute right-0 top-0 pr-4 pt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const reportData = getItemsForDate();
                    const { showPreview, ...pdfOptions } = reportOptions;
                    generateAndDownloadReport(reportData, pdfOptions);
                  }}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                >
                  <FileDown className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-full w-full overflow-auto p-4">
                <iframe src={previewUrl} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          locale={es}
        />
        <button
          onClick={toggleOptionsModal}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Settings className="h-5 w-5 mr-2" />
          )}
          {isLoading ? 'Cargando...' : 'Opciones de Informe'}
        </button>
        <button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-5 w-5 mr-2" />
          )}
          {isLoading ? 'Cargando...' : 'Generar Informe'}
        </button>
      </div>
    </>
  );
}

export default DailyActivitiesReportButton;
