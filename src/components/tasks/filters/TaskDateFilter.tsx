import { useCallback, memo } from 'react';
import { useTaskStore } from '../../../store/tasks';

export const TaskDateFilter = memo(() => {
  const { filters, setFilters } = useTaskStore();
  const handleDateChange = useCallback((field: 'start' | 'end', value: string) => {
    setFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: value || null,
      },
    });
  }, [filters.dateRange, setFilters]);
  const handleClearDate = useCallback((field: 'start' | 'end') => {
    handleDateChange(field, '');
  }, [handleDateChange]);
  return (
    <>
      <div>
        <label 
          htmlFor="date-from"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Fecha Desde
        </label>
        <input
          id="date-from"
          type="date"
          value={filters.dateRange.start || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
          aria-label="Seleccionar fecha desde"
        />
        {filters.dateRange.start && (
          <button
            onClick={() => handleClearDate('start')}
            className="mt-1 text-xs text-gray-500 hover:text-indigo-500 transition-colors duration-200"
            aria-label="Limpiar fecha desde"
          >
            Limpiar fecha
          </button>
        )}
      </div>

      <div>
        <label 
          htmlFor="date-to"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Fecha Hasta
        </label>
        <input
          id="date-to"
          type="date"
          value={filters.dateRange.end || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
          aria-label="Seleccionar fecha hasta"
        />
        {filters.dateRange.end && (
          <button
            onClick={() => handleClearDate('end')}
            className="mt-1 text-xs text-gray-500 hover:text-indigo-500 transition-colors duration-200"
            aria-label="Limpiar fecha hasta"
          >
            Limpiar fecha
          </button>
        )}
      </div>
    </>
  );
});

TaskDateFilter.displayName = 'TaskDateFilter';