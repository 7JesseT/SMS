import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { NotificationItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: uuidv4(),
      title: 'Welcome to School Management System',
      message: 'You have successfully logged in.',
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Simulate real-time notifications (polling)
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to add a notification (10% every 30 seconds)
      if (Math.random() < 0.1) {
        const randomNotifications = [
          { title: 'New Notice Posted', message: 'Check the notice board for updates', type: 'info' as const },
          { title: 'Attendance Marked', message: 'Your attendance has been recorded', type: 'success' as const },
          { title: 'Exam Results Published', message: 'New exam results are available', type: 'info' as const },
        ];
        const random = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(random);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
