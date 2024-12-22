import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNotificationStore } from '../../store/notifications';
import { Notification } from '../../types/notification';
import { cn } from '../../lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
};

const bgColorMap = {
  info: 'bg-blue-50',
  warning: 'bg-yellow-50',
  success: 'bg-green-50',
  error: 'bg-red-50',
};

const textColorMap = {
  info: 'text-blue-700',
  warning: 'text-yellow-700',
  success: 'text-green-700',
  error: 'text-red-700',
};

function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, removeNotification } = useNotificationStore();
  const Icon = iconMap[notification.type];

  const getRelatedItemPath = () => {
    switch (notification.relatedItemType) {
      case 'task':
        return `/tasks/${notification.relatedItemId}`;
      case 'file':
        return `/files/${notification.relatedItemId}`;
      case 'intimation':
        return `/tasks/${notification.relatedItemId}`;
      default:
        return null;
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación
    e.stopPropagation(); // Detener la propagación del evento
    removeNotification(notification.id);
  };

  const relatedItemPath = getRelatedItemPath();
  const content = (
    <div
      className={cn(
        'p-4 rounded-lg relative group',
        notification.status === 'unread' ? bgColorMap[notification.type] : 'bg-gray-50',
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', textColorMap[notification.type])} />
        </div>
        <div className="ml-3 flex-1">
          <p className={cn('text-sm font-medium', textColorMap[notification.type])}>
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );

  const handleClick = () => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  return relatedItemPath ? (
    <Link to={relatedItemPath} onClick={handleClick}>
      {content}
    </Link>
  ) : (
    <div onClick={handleClick}>{content}</div>
  );
}

export default NotificationItem;