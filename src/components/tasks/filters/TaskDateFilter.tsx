import React from 'react';
import { useTaskStore } from '../../../store/tasks';

export const TaskDateFilter = () => {
  const { filters, setFilters } = useTaskStore();

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: value || null,
      },
    });
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha Desde
        </label>
        <input
          type="date"
          value={filters.dateRange.start || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {filters.dateRange.start && (
          <button
            onClick={() => handleDateChange('start', '')}
            className="mt-1 text-xs text-gray-500 hover:text-indigo-500"
          >
            Limpiar fecha
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha Hasta
        </label>
        <input
          type="date"
          value={filters.dateRange.end || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {filters.dateRange.end && (
          <button
            onClick={() => handleDateChange('end', '')}
            className="mt-1 text-xs text-gray-500 hover:text-indigo-500"
          >
            Limpiar fecha
          </button>
        )}
      </div>
    </>
  );
};