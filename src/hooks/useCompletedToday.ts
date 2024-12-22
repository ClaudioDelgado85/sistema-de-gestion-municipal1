import { useTaskStore } from '../store/tasks';
import { useFileStore } from '../store/files';
import { useAdditionalActivitiesStore } from '../store/additionalActivities';
import { Task } from '../types/task';
import { File } from '../types/file';
import { AdditionalActivity } from '../types/additionalActivity';

export function useCompletedToday() {
  const tasks = useTaskStore((state) => state.tasks);
  const files = useFileStore((state) => state.files);
  const activities = useAdditionalActivitiesStore((state) => state.activities);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: string) => {
    const taskDate = new Date(date + 'T12:00:00');
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  // Obtener todas las tareas del día
  const todaysTasks = tasks.filter(task => isToday(task.fecha));
  const completedTasks = todaysTasks.filter(task => {
    if (task.estado !== 'completada') return false;
    
    // Obtener el último cambio de estado
    const lastStatusChange = [...task.historialEstados]
      .sort((a, b) => new Date(b.date + 'T12:00:00').getTime() - new Date(a.date + 'T12:00:00').getTime())
      .find(history => history.to === 'completada');
      
    return lastStatusChange && isToday(lastStatusChange.date);
  });

  const pendingTasks = todaysTasks.filter(task => task.estado === 'pendiente');

  const completedFiles = files.filter(file => 
    file.estado === 'completado' && 
    isToday(file.fecha)
  );

  // Filtrar actividades adicionales del día
  const todaysActivities = activities.filter(activity => isToday(activity.createdAt));

  return {
    tasks: completedTasks,
    pendingTasks,
    files: completedFiles,
    activities: todaysActivities,
    date: today
  };
}