import React from 'react';
import { useTaskStore } from '../../../store/tasks';

export const taskTypes = [
  { value: 'intimacion', label: 'Intimación' },
  { value: 'infraccion', label: 'Infracción' },
  { value: 'clausura', label: 'Clausura' },
  { value: 'decomiso', label: 'Decomiso' },
  { value: 'habilitacion', label: 'Habilitación' },
  { value: 'planos', label: 'Planos' },
];

export const TaskTypeSelect = () => {
  const { filters, setFilters } = useTaskStore();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFilters({ type: values });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo
      </label>
      <select
        multiple
        value={filters.type}
        onChange={handleTypeChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
      >
        {taskTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      {filters.type.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {filters.type.length} tipo(s) seleccionado(s)
        </div>
      )}
    </div>
  );
};