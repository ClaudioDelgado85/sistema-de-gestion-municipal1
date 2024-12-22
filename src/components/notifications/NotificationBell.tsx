import React from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../store/notifications';
import NotificationPopover from './NotificationPopover';

function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <NotificationPopover onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default NotificationBell;