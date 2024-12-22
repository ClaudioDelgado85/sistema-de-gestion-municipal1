import { useTaskStore } from '../../../store/tasks';
import { useFileStore } from '../../../store/files';
import { isTaskNearDeadline, isTaskOverdue } from '../../../utils/taskUtils';
import { Task } from '../../../types/task';
import { File } from '../../../types/file';

interface DashboardStats {
  pendingTasks: number;
  overdueTasks: number;
  activeFiles: number;
  filesNeedingAttention: number;
  intimations: number;
  intimationsNearDeadline: number;
  completedToday: {
    tasks: number;
    files: number;
    pendingTasks: number;
    totalTasks: number;
  };
}

export function useDashboardStats(): DashboardStats {
  const tasks = useTaskStore((state) => state.tasks);
  const files = useFileStore((state) => state.files);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: string) => {
    const taskDate = new Date(date + 'T12:00:00');
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  const pendingTasks = tasks.filter(task => task.estado === 'pendiente').length;
  const overdueTasks = tasks.filter(task => isTaskOverdue(task)).length;

  const intimationTasks = tasks.filter(
    (task: Task) => task.tipoActa === 'intimacion' && task.estado === 'pendiente'
  );
  const intimationsNearDeadline = intimationTasks.filter(task => 
    isTaskNearDeadline(task, 3)
  ).length;

  const activeFiles = files.filter(
    (file: File) => file.estado === 'en_proceso'
  ).length;

  const filesNeedingAttention = files.filter(
    (file: File) => 
      file.estado === 'en_proceso' && 
      new Date(file.fecha + 'T12:00:00').setHours(0, 0, 0, 0) < today.getTime()
  ).length;

  // Obtener todas las tareas del día
  const todaysTasks = tasks.filter(task => isToday(task.fecha));
  const completedTodayTasks = todaysTasks.filter(task => {
    if (task.estado !== 'completada') return false;
    
    // Obtener el último cambio de estado
    const lastStatusChange = [...task.historialEstados]
      .sort((a, b) => new Date(b.date + 'T12:00:00').getTime() - new Date(a.date + 'T12:00:00').getTime())
      .find(history => history.to === 'completada');
      
    return lastStatusChange && isToday(lastStatusChange.date);
  });

  const pendingTodayTasks = todaysTasks.filter(task => task.estado === 'pendiente');

  const completedToday = {
    tasks: completedTodayTasks.length,
    pendingTasks: pendingTodayTasks.length,
    totalTasks: todaysTasks.length,
    files: files.filter(file => 
      file.estado === 'completado' && 
      file.fecha && isToday(file.fecha)
    ).length
  };

  return {
    pendingTasks,
    overdueTasks,
    activeFiles,
    filesNeedingAttention,
    intimations: intimationTasks.length,
    intimationsNearDeadline,
    completedToday
  };
}