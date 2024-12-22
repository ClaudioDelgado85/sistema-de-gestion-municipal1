import { useEffect } from 'react';
import { useNotificationStore } from '../store/notifications';

export function useNotifications() {
  const { preferences, addNotification } = useNotificationStore();

  useEffect(() => {
    // Request browser notification permissions if enabled
    if (preferences.browser && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [preferences.browser]);

  const showBrowserNotification = (title: string, message: string) => {
    if (preferences.browser && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  };

  const notify = (notification: Parameters<typeof addNotification>[0]) => {
    addNotification(notification);
    showBrowserNotification(notification.title, notification.message);
  };

  return { notify };
}

export default useNotifications;