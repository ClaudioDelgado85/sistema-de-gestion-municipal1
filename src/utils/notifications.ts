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
  if (!task || !task.tipo_acta || !task.plazo || !task.estado) {
    return false;
  }

  if (
    task.tipo_acta !== 'intimacion' ||
    task.estado !== 'pendiente'
  ) {
    return false;
  }

  const deadlineDate = parseISO(task.plazo);
  const notificationKey = createNotificationKey(task.id.toString(), new Date());
  
  return isToday(deadlineDate) && !notifiedKeys.has(notificationKey);
};

export const createTaskNotification = (
  task: Task,
  type: NotificationType,
  title: string
) => {
  if (!task || !task.numero_acta || !task.infractor_nombre) {
    throw new Error('La tarea no tiene todos los campos necesarios para crear una notificación');
  }

  return {
    title,
    message: `La tarea ${task.numero_acta} para ${task.infractor_nombre} ${
      type === 'warning' ? 'vence hoy' : 'está retrasada'
    }.`,
    type,
    relatedItemId: task.id.toString(),
    relatedItemType: 'task' as const
  };
};