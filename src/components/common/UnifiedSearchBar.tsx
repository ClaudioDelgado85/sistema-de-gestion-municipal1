import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface UnifiedSearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
}

function UnifiedSearchBar({
  searchTerm,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  showClearButton = true
}: UnifiedSearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sincronizar el término de búsqueda local con el prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearch('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Buscador */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              value={localSearchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Botón limpiar */}
        {showClearButton && localSearchTerm && (
          <button
            onClick={handleClear}
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

export default UnifiedSearchBar;
