import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        // Atajo para nueva tarea
        navigate('/tasks/new');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div
      className={cn(
        "border-r min-h-screen transition-all duration-200 relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-6 border rounded-full p-1 z-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className={cn(
                  'flex-shrink-0 h-5 w-5',
                  location.pathname === item.href
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300'
                )} />
                {!isCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto pb-4">
          <button
            onClick={logout}
            className={cn(
              'flex items-center w-full py-2 text-sm font-medium rounded-md',
              isCollapsed ? 'justify-center px-2' : 'px-4',
              'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <LogOut className="flex-shrink-0 h-5 w-5 text-gray-600 dark:text-gray-300" />
            {!isCollapsed && (
              <span className="ml-3">Cerrar sesión</span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
