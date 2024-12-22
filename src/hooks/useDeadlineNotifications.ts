import { useEffect, useRef } from 'react';
import { Task } from '../types/task';
import { createNotificationKey, shouldNotifyDeadline, createTaskNotification } from '../utils/notifications';
import useNotifications from './useNotifications';

export function useDeadlineNotifications(tasks: Task[]) {
  const { notify } = useNotifications();
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkDeadlines = () => {
      tasks.forEach((task) => {
        if (shouldNotifyDeadline(task, notifiedTasksRef.current)) {
          const notification = createTaskNotification(
            task,
            'warning',
            'Plazo de Intimación por Vencer'
          );
          
          notify(notification);
          notifiedTasksRef.current.add(
            createNotificationKey(task.id, new Date())
          );
        }
      });
    };

    checkDeadlines();
    
    // Usar requestAnimationFrame para manejar el intervalo de manera más eficiente
    let frameId: number;
    const scheduleNextCheck = () => {
      frameId = requestAnimationFrame(() => {
        checkDeadlines();
        // Verificar cada hora
        setTimeout(scheduleNextCheck, 60 * 60 * 1000);
      });
    };

    scheduleNextCheck();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [tasks, notify]);
}