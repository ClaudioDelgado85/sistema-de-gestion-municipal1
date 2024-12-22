import React from 'react';
import { useNotificationStore } from '../../store/notifications';
import NotificationItem from './NotificationItem';
import { Check, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationPopoverProps {
  onClose: () => void;
}

function NotificationPopover({ onClose }: NotificationPopoverProps) {
  const { notifications, markAllAsRead } = useNotificationStore();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="p-1 rounded-full hover:bg-gray-100"
              title="Marcar todas como leídas"
            >
              <Check className="h-4 w-4 text-gray-500" />
            </button>
            <Link
              to="/settings/notifications"
              className="p-1 rounded-full hover:bg-gray-100"
              title="Configuración de notificaciones"
              onClick={onClose}
            >
              <Settings className="h-4 w-4 text-gray-500" />
            </Link>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No hay notificaciones
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPopover;