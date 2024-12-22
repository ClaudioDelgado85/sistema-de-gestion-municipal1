import React from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { TaskTypeSelect } from './filters/TaskTypeSelect';
import { TaskStatusSelect } from './filters/TaskStatusSelect';
import { TaskDateFilter } from './filters/TaskDateFilter';

const TaskFilters = () => {
  const { filters, setFilters } = useTaskStore();

  const clearFilters = () => {
    setFilters({
      status: [],
      type: [],
      dateRange: {
        start: null,
        end: null,
      },
    });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.type.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TaskStatusSelect />
        <TaskTypeSelect />
        <TaskDateFilter />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 p-2 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Filtros activos:
            {filters.status.length > 0 && ` ${filters.status.length} estados,`}
            {filters.type.length > 0 && ` ${filters.type.length} tipos,`}
            {filters.dateRange.start && ' fecha desde,'}
            {filters.dateRange.end && ' fecha hasta'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;