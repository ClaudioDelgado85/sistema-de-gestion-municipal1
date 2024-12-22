import { useEffect, useRef } from 'react';
import { Task } from '../types/task';
import { isAfter, parseISO } from 'date-fns';
import { useTaskStore } from '../store/tasks';
import useNotifications from './useNotifications';
import { createTaskNotification } from '../utils/notifications';

export function useTaskStatus(tasks: Task[]) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const { notify } = useNotifications();
  const expiredTasksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkTaskStatuses = () => {
      const now = new Date();
      
      tasks.forEach((task) => {
        if (
          task.estado === 'pendiente' && 
          task.plazo && 
          !expiredTasksRef.current.has(task.id)
        ) {
          const deadlineDate = parseISO(task.plazo);
          
          if (isAfter(now, deadlineDate)) {
            // Solo actualizamos si la tarea aún está pendiente
            updateTaskStatus({
              taskId: task.id,
              newStatus: 'vencida',
              observaciones: 'Tarea marcada automáticamente como vencida por sistema',
              usuario: 'sistema'
            });

            notify(createTaskNotification(
              task,
              'error',
              'Tarea Vencida'
            ));
            
            expiredTasksRef.current.add(task.id);
          }
        }
      });
    };

    checkTaskStatuses();
    
    let timeoutId: NodeJS.Timeout;
    const scheduleNextCheck = () => {
      timeoutId = setTimeout(() => {
        checkTaskStatuses();
        scheduleNextCheck();
      }, 60 * 60 * 1000); // Verificar cada hora
    };

    scheduleNextCheck();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [tasks, updateTaskStatus, notify]);
}