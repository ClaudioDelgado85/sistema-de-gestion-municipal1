import { Task } from '../types/task';
import { isToday, parseISO, startOfDay } from 'date-fns';
import { NotificationType } from '../types/notification';

export const createNotificationKey = (taskId: string, date: Date): string => {
  const dayTimestamp = startOfDay(date).getTime();
  return `${taskId}-${dayTimestamp}`;
};

export const shouldNotifyDeadline = (
  task: Task,
  notifiedKeys: Set<string>
): boolean => {
  if (
    task.tipoActa !== 'intimacion' ||
    !task.plazo ||
    task.estado !== 'pendiente'
  ) {
    return false;
  }

  const deadlineDate = parseISO(task.plazo);
  const notificationKey = createNotificationKey(task.id, new Date());
  
  return isToday(deadlineDate) && !notifiedKeys.has(notificationKey);
};

export const createTaskNotification = (
  task: Task,
  type: NotificationType,
  title: string
) => ({
  title,
  message: `La tarea ${task.numeroActa} para ${task.infractor.nombre} ${
    type === 'warning' ? 'vence hoy' : 'ha vencido'
  }.`,
  type,
  relatedItemId: task.id,
  relatedItemType: 'task' as const
});