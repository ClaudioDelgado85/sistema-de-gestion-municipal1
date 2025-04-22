import { useEffect } from 'react';
import { Task } from '../types/task';
import { isAfter, parseISO } from 'date-fns';
import { useTaskStore } from '../store/tasks';
import useNotifications from './useNotifications';
import { createTaskNotification } from '../utils/notifications';
import { useNotificationStore } from '../store/notifications';

export function useTaskStatus(tasks: Task[]) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const { notify } = useNotifications();
  const { notifiedTaskIds, addNotifiedTaskId } = useNotificationStore();

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const checkTaskStatuses = async () => {
      const now = new Date();
      
      // Procesar todas las tareas vencidas en paralelo
      const updatePromises = tasks
        .filter(task => 
          task && 
          task.id && 
          task.estado === 'pendiente' && 
          task.plazo && 
          isAfter(now, parseISO(task.plazo)) &&
          !notifiedTaskIds.has(task.id.toString())
        )
        .map(async (task) => {
          const taskIdStr = task.id.toString();
          
          try {
            await updateTaskStatus({
              taskId: task.id,
              newStatus: 'vencida',
              observaciones: 'Tarea marcada automáticamente como vencida'
            });

            notify(createTaskNotification(
              task,
              'warning',
              'Tarea Vencida'
            ));
            
            addNotifiedTaskId(taskIdStr);
          } catch (error) {
            console.error(`Error procesando tarea ${taskIdStr}:`, error);
          }
        });

      await Promise.all(updatePromises);
    };

    // Ejecutar la verificación inicial
    checkTaskStatuses();
    
    // Configurar el intervalo para verificaciones posteriores
    const intervalId = setInterval(checkTaskStatuses, 60 * 60 * 1000); // Cada hora

    return () => {
      clearInterval(intervalId);
    };
  }, [tasks, notifiedTaskIds]);
}
