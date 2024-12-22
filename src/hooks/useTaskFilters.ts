import { useTaskStore } from '../store/tasks';
import { Task } from '../types/task';
import { isAfter, isBefore, parseISO } from 'date-fns';

export function useTaskFilters() {
  const { tasks, filters, sortConfig } = useTaskStore();

  const filteredTasks = tasks.filter((task) => {
    if (filters.status.length && !filters.status.includes(task.estado)) {
      return false;
    }

    if (filters.type.length && !filters.type.includes(task.tipoActa)) {
      return false;
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      const taskDate = parseISO(task.fecha);
      if (
        filters.dateRange.start &&
        isBefore(taskDate, parseISO(filters.dateRange.start))
      ) {
        return false;
      }
      if (
        filters.dateRange.end &&
        isAfter(taskDate, parseISO(filters.dateRange.end))
      ) {
        return false;
      }
    }

    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'plazo') {
      const aDate = aValue ? new Date(aValue as string).getTime() : Infinity;
      const bDate = bValue ? new Date(bValue as string).getTime() : Infinity;
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedTasks;
}