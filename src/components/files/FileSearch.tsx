import React from 'react';
import { Search, X } from 'lucide-react';
import { useFileStore } from '../../store/files';

function FileSearch() {
  const { filters, setFilters, setSearchTerm } = useFileStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda general */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por número o carátula..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filtro de estado */}
        <div className="sm:w-48">
          <select
            value={filters.status[0] || ''}
            onChange={(e) => setFilters({ status: e.target.value ? [e.target.value as any] : [] })}
            className="w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todos los estados</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completado">Completado</option>
          </select>
        </div>

        {/* Filtro de fecha */}
        <div className="sm:w-48">
          <input
            type="date"
            value={filters.dateRange.start || ''}
            onChange={(e) => setFilters({
              dateRange: { ...filters.dateRange, start: e.target.value || null }
            })}
            className="w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Botón limpiar filtros */}
        {(filters.status.length > 0 || filters.dateRange.start) && (
          <button
            onClick={() => {
              setFilters({
                status: [],
                dateRange: { start: null, end: null }
              });
              setSearchTerm('');
            }}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}

export default FileSearch;