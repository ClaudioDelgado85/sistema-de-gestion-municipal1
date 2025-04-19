import React from 'react';
import { Outlet } from 'react-router-dom';
import { FileText, ClipboardList, Home, Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../context/ThemeContext';

function Layout() {
  const { theme, isDarkMode } = useTheme();

  return (
    <div
      className="min-h-screen dark:bg-gray-900 transition-colors duration-200"
      style={{ backgroundColor: isDarkMode ? '' : (theme?.background || '#F9FAFB') }}
    >
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;