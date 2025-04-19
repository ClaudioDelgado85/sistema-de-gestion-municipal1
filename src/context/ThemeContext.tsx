import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = {
  primary: string;
  background: string;
  fontSize: string;
};

type ThemeContextType = {
  theme: ThemeType;
  updateTheme: (newTheme: ThemeType) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: {
    primary: '#4F46E5',
    background: '#F9FAFB',
    fontSize: 'normal',
  },
  updateTheme: () => {},
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState({
    primary: '#4F46E5',
    background: '#F9FAFB',
    fontSize: 'normal',
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar preferencia de modo oscuro al iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Cargar tema guardado si existe
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (error) {
        console.error('Error al cargar el tema guardado:', error);
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));

      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return newMode;
    });
  };

  const updateTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('userTheme', JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
