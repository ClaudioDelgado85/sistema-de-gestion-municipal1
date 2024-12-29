import React from 'react';
import TaskSummary from './components/TaskSummary';
import TasksOverview from './components/TasksOverview';
import UpcomingTasks from './components/UpcomingTasks';
import RecentActivity from './components/RecentActivity';
import DailyReportButton from './components/DailyReportButton';
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de actividades y estadísticas
          </p>
        </div>
        <DailyReportButton />
      </div>

      {/* Resumen de estados de tareas */}
      <TaskSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de distribución de tareas */}
        <TasksOverview />
        
        {/* Tareas próximas a vencer */}
        <UpcomingTasks />
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;