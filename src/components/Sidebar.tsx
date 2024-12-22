import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, ClipboardList, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/auth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tareas', href: '/tasks', icon: ClipboardList },
  { name: 'Expedientes', href: '/files', icon: FileText },
];

function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="flex flex-col h-full">
        <div className="space-y-1 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                  location.pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto pb-4">
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;