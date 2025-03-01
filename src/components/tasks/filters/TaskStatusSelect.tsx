import React, { useCallback, memo } from 'react';
import { useTaskStore } from '../../../store/tasks';

export const taskStatuses = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completada', label: 'Completada' },
  { value: 'vencida', label: 'Vencida' },
] as const;

export type TaskStatus = typeof taskStatuses[number]['value'];

export const TaskStatusSelect = memo(() => {
  const { filters, setFilters } = useTaskStore();

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value as TaskStatus);
    setFilters({ status: values });
  }, [setFilters]);

  return (
    <div>
      <label 
        htmlFor="task-status-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Estado
      </label>
      <select
        id="task-status-select"
        multiple
        value={filters.status}
        onChange={handleStatusChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] transition-colors duration-200"
        aria-label="Seleccionar estados de tareas"
      >
        {taskStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      {filters.status.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {filters.status.length} estado(s) seleccionado(s)
        </div>
      )}
    </div>
  );
});

TaskStatusSelect.displayName = 'TaskStatusSelect';