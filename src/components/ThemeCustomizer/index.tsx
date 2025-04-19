import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Settings, X, Check, Eye } from 'lucide-react';
import ThemeDemo from './ThemeDemo';

const fontSizeOptions = [
  { value: 'small', label: 'Pequeño' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grande' },
];

const ThemeCustomizer: React.FC = () => {
  const { theme, updateTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tempTheme, setTempTheme] = useState(theme || {
    primary: '#4F46E5',
    background: '#F9FAFB',
    fontSize: 'normal',
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Reset temp theme when opening, with fallback values
    setTempTheme(theme || {
      primary: '#4F46E5',
      background: '#F9FAFB',
      fontSize: 'normal',
    });
  };

  const handleColorChange = (key: keyof typeof tempTheme, value: string) => {
    setTempTheme({
      ...tempTheme,
      [key]: value,
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempTheme({
      ...tempTheme,
      fontSize: e.target.value,
    });
  };

  const handleApply = () => {
    updateTheme(tempTheme);
    setIsOpen(false);

    // Mostrar notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-md shadow-lg flex items-center';
    notification.innerHTML = `
      <span class="mr-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
      <span>Tema actualizado correctamente</span>
    `;
    document.body.appendChild(notification);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        title="Personalizar tema"
      >
        <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personalizar tema</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color primario
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={tempTheme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 mr-2"
                  />
                  <input
                    type="text"
                    value={tempTheme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Color para botones y elementos destacados</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color de fondo
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={tempTheme.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 mr-2"
                  />
                  <input
                    type="text"
                    value={tempTheme.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Color de fondo para la aplicación (modo claro)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tamaño de fuente
                </label>
                <select
                  value={tempTheme.fontSize}
                  onChange={handleFontSizeChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                >
                  {fontSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aplicar
                  </button>

                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center"
                    title="Vista previa"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    // Restablecer a los valores predeterminados
                    const defaultTheme = {
                      primary: '#4F46E5',
                      background: '#F9FAFB',
                      fontSize: 'normal',
                    };
                    setTempTheme(defaultTheme);
                    updateTheme(defaultTheme);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 text-sm"
                >
                  Restablecer valores predeterminados
                </button>
              </div>

              {showPreview && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <ThemeDemo />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Los cambios se guardarán automáticamente para futuras sesiones.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeCustomizer;
