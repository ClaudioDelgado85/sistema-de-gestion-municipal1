import React from 'react';
import { useAuthStore } from '../store/auth';
import NotificationBell from './notifications/NotificationBell';
import ThemeToggle from './ThemeToggle';
import ThemeCustomizer from './ThemeCustomizer';

function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sistema de Gestión Municipal
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeCustomizer />
            <ThemeToggle />
            <NotificationBell />
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;