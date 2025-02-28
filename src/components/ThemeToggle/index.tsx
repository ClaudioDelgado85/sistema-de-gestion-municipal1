import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors duration-200 ${
        isDarkMode 
          ? 'hover:bg-gray-300 text-gray-300' 
          : 'hover:bg-gray-700 text-gray-700'
      }`}
      title={isDarkMode ? "Modo claro" : "Modo oscuro"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
