import { create } from 'zustand';
import { Notification, NotificationPreferences } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'status' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  browser: true,
  taskReminders: true,
  fileUpdates: true,
  intimationDeadlines: true,
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  preferences: DEFAULT_PREFERENCES,
  unreadCount: 0,
  
  addNotification: (notification) => set((state) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((notification) =>
      notification.id === id ? { ...notification, status: 'read' } : notification
    ),
    unreadCount: state.unreadCount - 1,
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((notification) => ({
      ...notification,
      status: 'read',
    })),
    unreadCount: 0,
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((notification) => notification.id !== id),
    unreadCount: state.notifications.find((n) => n.id === id)?.status === 'unread'
      ? state.unreadCount - 1
      : state.unreadCount,
  })),
  
  updatePreferences: (preferences) => set((state) => ({
    preferences: { ...state.preferences, ...preferences },
  })),
}));