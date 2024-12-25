import { useEffect, useRef } from 'react';
import { Task } from '../types/task';
import { isAfter, parseISO } from 'date-fns';
import { useTaskStore } from '../store/tasks';
import useNotifications from './useNotifications';
import { createTaskNotification } from '../utils/notifications';

export function useTaskStatus(tasks: Task[]) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const { notify } = useNotifications();
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // No hacer nada si no hay tareas
    if (!tasks || tasks.length === 0) return;

    const checkTaskStatuses = () => {
      const now = new Date();
      
      tasks.forEach((task) => {
        // Verificar que la tarea tenga todos los campos necesarios
        if (!task || !task.id || !task.estado || !task.plazo) return;

        if (
          task.estado === 'pendiente' && 
          !notifiedTasksRef.current.has(task.id.toString())
        ) {
          const deadlineDate = parseISO(task.plazo);
          
          if (isAfter(now, deadlineDate)) {
            try {
              // Notificar que la tarea está retrasada
              notify(createTaskNotification(
                task,
                'warning',
                'Tarea Retrasada'
              ));
              
              notifiedTasksRef.current.add(task.id.toString());
            } catch (error) {
              console.error('Error al crear notificación:', error);
            }
          }
        }
      });
    };

    checkTaskStatuses();
    
    let timeoutId: number;
    const scheduleNextCheck = () => {
      timeoutId = window.setTimeout(() => {
        checkTaskStatuses();
        scheduleNextCheck();
      }, 60 * 60 * 1000); // Verificar cada hora
    };

    scheduleNextCheck();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [tasks, updateTaskStatus, notify]);
}