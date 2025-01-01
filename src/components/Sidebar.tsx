import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, ClipboardList, LogOut, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/auth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tareas', href: '/tasks', icon: ClipboardList },
  { name: 'Expedientes', href: '/files', icon: FileText },
  { name: 'Otras Actividades', href: '/other-activities', icon: Activity },
];

function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 min-h-screen transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <nav className="flex flex-col h-full">
        <div className="space-y-1 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center py-2 text-sm font-medium rounded-md',
                  isCollapsed ? 'justify-center px-2' : 'px-4',
                  location.pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto pb-4">
          <button
            onClick={logout}
            className={cn(
              'flex items-center py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full',
              isCollapsed ? 'justify-center px-2' : 'px-4'
            )}
            title={isCollapsed ? "Cerrar sesión" : undefined}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && "Cerrar sesión"}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;