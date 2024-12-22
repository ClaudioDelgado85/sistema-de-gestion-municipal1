import { Task } from '../types/task';
import { isAfter, isBefore, parseISO, addDays } from 'date-fns';

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.plazo) return false;
  return isAfter(new Date(), parseISO(task.plazo));
};

export const isTaskNearDeadline = (task: Task, daysThreshold = 3): boolean => {
  if (!task.plazo || task.estado !== 'pendiente') return false;
  const deadlineDate = parseISO(task.plazo);
  const warningDate = addDays(new Date(), daysThreshold);
  return isBefore(deadlineDate, warningDate) && !isTaskOverdue(task);
};

export const filterTasks = (
  tasks: Task[],
  filters: {
    status: string[];
    type: string[];
    dateRange: {
      start: string | null;
      end: string | null;
    };
  }
): Task[] => {
  return tasks.filter((task) => {
    // Filtro por estado
    if (filters.status.length && !filters.status.includes(task.estado)) {
      return false;
    }

    // Filtro por tipo
    if (filters.type.length && !filters.type.includes(task.tipoActa)) {
      return false;
    }

    // Filtro por rango de fechas
    const taskDate = parseISO(task.fecha);
    if (filters.dateRange.start && isBefore(taskDate, parseISO(filters.dateRange.start))) {
      return false;
    }
    if (filters.dateRange.end && isAfter(taskDate, parseISO(filters.dateRange.end))) {
      return false;
    }

    return true;
  });
};

export const sortTasks = (
  tasks: Task[],
  sortConfig: { key: keyof Task | null; direction: 'asc' | 'desc' }
): Task[] => {
  if (!sortConfig.key) return tasks;

  return [...tasks].sort((a, b) => {
    let aValue = a[sortConfig.key as keyof Task];
    let bValue = b[sortConfig.key as keyof Task];

    // Manejar casos especiales
    if (sortConfig.key === 'plazo') {
      aValue = a.plazo || '9999-12-31'; // Tareas sin plazo al final
      bValue = b.plazo || '9999-12-31';
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
};