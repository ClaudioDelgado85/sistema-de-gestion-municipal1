import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';

function TaskSearch() {
  const { filters, setFilters, searchTerm: storeSearchTerm, setSearchTerm } = useTaskStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(storeSearchTerm);

  // Sincronizar el término de búsqueda local con el del store
  useEffect(() => {
    setLocalSearchTerm(storeSearchTerm);
  }, [storeSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    setSearchTerm(value);

    // Aplicar el término de búsqueda inmediatamente
    // No es necesario hacer nada más aquí, ya que el componente TaskList
    // usará getFilteredTasks que incluye la lógica de búsqueda
  };

  const clearFilters = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setFilters({
      status: [],
      type: [],
      dateRange: { start: null, end: null }
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Buscador */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por número, infractor o descripción..."
              value={localSearchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Botón limpiar */}
        {(localSearchTerm || filters.status.length > 0 || filters.type.length > 0 || filters.dateRange.start) && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar búsqueda
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskSearch;
