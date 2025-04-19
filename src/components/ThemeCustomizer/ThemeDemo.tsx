import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeDemo: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Vista previa del tema</h3>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Color primario</div>
          <div
            className="h-10 rounded-md"
            style={{ backgroundColor: theme?.primary || '#4F46E5' }}
          ></div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Color de fondo (modo claro)</div>
          <div
            className="h-10 rounded-md border border-gray-200"
            style={{ backgroundColor: theme?.background || '#F9FAFB' }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Ejemplo de interfaz</div>
          <div className="rounded-md overflow-hidden border border-gray-200">
            <div className="p-3" style={{ backgroundColor: isDarkMode ? '#1F2937' : (theme?.background || '#F9FAFB') }}>
              <div className="text-sm font-medium mb-2" style={{ color: isDarkMode ? '#E5E7EB' : '#111827' }}>Panel de ejemplo</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-primary text-white rounded-md">
                  Botón primario
                </button>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 rounded-md">
                  Botón secundario
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tamaño de texto</div>
          <div className="space-y-1">
            <p className="text-xs text-gray-700 dark:text-gray-300">Texto muy pequeño (xs)</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Texto pequeño (sm)</p>
            <p className="text-base text-gray-700 dark:text-gray-300">Texto base (base)</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">Texto grande (lg)</p>
            <p className="text-xl text-gray-700 dark:text-gray-300">Texto muy grande (xl)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
