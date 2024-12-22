import React from 'react';
import { CheckCircle } from 'lucide-react';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import DailyReportButton from './components/DailyReportButton';
import { AddActivityInput } from './components/AddActivityInput';
import { useDashboardStats } from './hooks/useDashboardStats';

function Dashboard() {
  const stats = useDashboardStats();

  const completedTodayCard = {
    title: 'Completados Hoy',
    value: stats.completedToday.tasks + stats.completedToday.files,
    icon: CheckCircle,
    description: `${stats.completedToday.tasks} tareas, ${stats.completedToday.files} expedientes`
  };

  const tasksForTodayCard = {
    title: 'Tareas del Día',
    value: stats.completedToday.totalTasks,
    icon: CheckCircle,
    description: `${stats.completedToday.tasks} completadas, ${stats.completedToday.pendingTasks} pendientes`
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de actividades del día
          </p>
        </div>
        <DailyReportButton />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          key={completedTodayCard.title}
          title={completedTodayCard.title}
          value={completedTodayCard.value}
          icon={completedTodayCard.icon}
          description={completedTodayCard.description}
        />
        <StatCard
          key={tasksForTodayCard.title}
          title={tasksForTodayCard.title}
          value={tasksForTodayCard.value}
          icon={tasksForTodayCard.icon}
          description={tasksForTodayCard.description}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <AddActivityInput />
      </div>
    </div>
  );
}

export default Dashboard;