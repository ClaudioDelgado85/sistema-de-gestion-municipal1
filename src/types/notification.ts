export type NotificationType = 'info' | 'warning' | 'success' | 'error';
export type NotificationStatus = 'unread' | 'read';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  dueDate?: string;
  relatedItemId?: string;
  relatedItemType?: 'task' | 'file' | 'intimation';
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  taskReminders: boolean;
  fileUpdates: boolean;
  intimationDeadlines: boolean;
}