import React from 'react';
import { useTaskStore } from '../../../store/tasks';

export const taskStatuses = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completada', label: 'Completada' },
  { value: 'vencida', label: 'Vencida' },
];

export const TaskStatusSelect = () => {
  const { filters, setFilters } = useTaskStore();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFilters({ status: values });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Estado
      </label>
      <select
        multiple
        value={filters.status}
        onChange={handleStatusChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
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
};