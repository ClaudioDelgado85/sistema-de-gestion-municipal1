export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'intimation' | 'infraction' | 'closure' | 'seizure' | 'commercial_license' | 'blueprint_approval';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  createdAt: string;
  dueDate: string;
}

export interface File {
  id: string;
  number: string;
  entryDate: string;
  exitDate?: string;
  status: 'pending' | 'closed';
  description: string;
  assignedTo: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'intimation' | 'task' | 'file';
  status: 'unread' | 'read';
  createdAt: string;
  dueDate?: string;
}