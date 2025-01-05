import { useTaskStore } from '../store/tasks';
import { Task } from '../types/task';

export function useCompletedToday(): Task[] {
  const tasks = useTaskStore((state) => state.tasks);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('Estado del store de tareas:', useTaskStore.getState());
  console.log('Todas las tareas disponibles:', tasks);

  const completedTasks = tasks.filter(task => {
    // Convertir la fecha de la tarea a fecha local
    const taskDate = new Date(task.fecha || task.created_at);
    taskDate.setHours(0, 0, 0, 0);

    const isToday = taskDate.getTime() === today.getTime();
    // Aceptar tanto 'completada' como 'completado'
    const isCompleted = task.estado === 'completada' || task.estado === 'completado';

    console.log('Evaluando tarea:', {
      id: task.id,
      fecha: task.fecha,
      created_at: task.created_at,
      fechaParseada: taskDate.toISOString(),
      today: today.toISOString(),
      isToday,
      estado: task.estado,
      isCompleted
    });

    return isToday && isCompleted;
  });

  console.log('Tareas filtradas para hoy:', completedTasks);
  return completedTasks;
}