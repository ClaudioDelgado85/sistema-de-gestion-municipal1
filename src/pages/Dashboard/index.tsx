import React from 'react';
import TaskSummary from './components/TaskSummary';
import TasksOverview from './components/TasksOverview';
import UpcomingTasks from './components/UpcomingTasks';
import FilesAnalysis from './components/FilesAnalysis';
import DailyActivitiesReportButton from './components/DailyActivitiesReportButton';
import { useTaskStore } from '../../store/tasks';
import { useFileStore } from '../../store/files';

function Dashboard() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const fetchFiles = useFileStore((state) => state.fetchFiles);

  React.useEffect(() => {
    fetchTasks();
    fetchFiles();
  }, [fetchTasks, fetchFiles]);

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de actividades y estadísticas
          </p>
        </div>
        <DailyActivitiesReportButton />
      </div>

      {/* Primera fila: KPIs principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Resumen de Tareas
          </h3>
          <TaskSummary />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Resumen de Expedientes
          </h3>
          <FilesAnalysis />
        </div>
      </div>

      {/* Segunda fila: Gráficos y Tareas próximas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de distribución de tareas - 2/3 del ancho */}
        <div className="lg:col-span-2">
          <TasksOverview />
        </div>
        
        {/* Tareas próximas - 1/3 del ancho */}
        <div className="lg:col-span-1">
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
