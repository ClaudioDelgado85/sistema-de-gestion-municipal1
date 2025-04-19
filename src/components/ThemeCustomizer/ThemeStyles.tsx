import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeStyles: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  // Aplicar estilos directamente al documento usando useEffect
  useEffect(() => {
    // Convertir colores hexadecimales a RGB para poder usarlos con opacidad
    const hexToRgb = (hex: string | undefined) => {
      // Si hex es undefined o no es una cadena válida, devolver un valor predeterminado
      if (!hex || typeof hex !== 'string') {
        return '0, 0, 0';
      }

      try {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        return result
          ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
          : '0, 0, 0';
      } catch (error) {
        console.error('Error al convertir color hexadecimal a RGB:', error);
        return '0, 0, 0';
      }
    };

    // Crear variables CSS
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(theme.primary));
    document.documentElement.style.setProperty('--color-background', theme.background);
    document.documentElement.style.setProperty('--color-background-rgb', hexToRgb(theme.background));

    // Establecer tamaño de fuente base
    let baseFontSize = '1rem';
    if (theme.fontSize === 'small') {
      baseFontSize = '0.875rem';
    } else if (theme.fontSize === 'large') {
      baseFontSize = '1.125rem';
    }
    document.documentElement.style.setProperty('--font-size-base', baseFontSize);

    // Aplicar tamaño de fuente al body
    document.body.style.fontSize = baseFontSize;

    // Crear y añadir hoja de estilos para clases personalizadas
    const styleId = 'custom-theme-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Definir estilos para clases personalizadas
    const customStyles = `
      /* Clases de color personalizadas */
      .bg-primary { background-color: var(--color-primary) !important; }
      .text-primary { color: var(--color-primary) !important; }
      .border-primary { border-color: var(--color-primary) !important; }

      .bg-custom { background-color: var(--color-background) !important; }

      /* Botones personalizados */
      .btn-primary {
        background-color: var(--color-primary);
        color: white;
      }

      .btn-primary:hover {
        background-color: rgba(var(--color-primary-rgb), ${isDarkMode ? '0.8' : '0.9'});
      }

      /* Aplicar color de fondo personalizado */
      body:not(.dark) .bg-gray-50 { background-color: var(--color-background) !important; }
      body:not(.dark) .bg-gray-100 { background-color: rgba(var(--color-background-rgb), 0.8) !important; }
      body:not(.dark) .bg-gray-200 { background-color: rgba(var(--color-background-rgb), 0.7) !important; }

      /* Sobreescribir algunos estilos de Tailwind */
      .bg-indigo-600 { background-color: var(--color-primary) !important; }
      .hover\\:bg-indigo-700:hover { background-color: rgba(var(--color-primary-rgb), 0.9) !important; }
      .text-indigo-600 { color: var(--color-primary) !important; }
      .hover\\:text-indigo-900:hover { color: rgba(var(--color-primary-rgb), 0.8) !important; }
      .focus\\:ring-indigo-500:focus { --tw-ring-color: var(--color-primary) !important; }
      .focus\\:border-indigo-500:focus { border-color: var(--color-primary) !important; }

      /* Tamaños de fuente personalizados */
      ${theme.fontSize === 'small' ? `
        .text-xs { font-size: 0.65rem; }
        .text-sm { font-size: 0.75rem; }
        .text-base { font-size: 0.875rem; }
        .text-lg { font-size: 1rem; }
        .text-xl { font-size: 1.125rem; }
        .text-2xl { font-size: 1.25rem; }
      ` : theme.fontSize === 'large' ? `
        .text-xs { font-size: 0.875rem; }
        .text-sm { font-size: 1rem; }
        .text-base { font-size: 1.125rem; }
        .text-lg { font-size: 1.25rem; }
        .text-xl { font-size: 1.375rem; }
        .text-2xl { font-size: 1.5rem; }
      ` : ''}
    `;

    styleElement.textContent = customStyles;
  }, [theme, isDarkMode]); // Re-aplicar cuando cambie el tema o el modo oscuro

  // Este componente no renderiza nada visible
  return null;
};

export default ThemeStyles;
