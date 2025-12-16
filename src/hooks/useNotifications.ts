import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

type NotificationPermission = 'default' | 'granted' | 'denied';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: 'No soportado',
        description: 'Tu navegador no soporta notificaciones',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: '¡Notificaciones activadas!',
          description: 'Recibirás recordatorios de tus hábitos'
        });
        return true;
      } else if (result === 'denied') {
        toast({
          title: 'Notificaciones bloqueadas',
          description: 'Puedes habilitarlas en la configuración del navegador',
          variant: 'destructive'
        });
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, toast]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.log('Notifications not permitted');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'luminous-reminder',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }, [permission]);

  const scheduleHabitReminder = useCallback((habitTitle: string, reminderTime: string) => {
    if (permission !== 'granted' || !reminderTime) return null;

    const now = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);
    
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const delay = reminderDate.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      sendNotification(`🌟 Recordatorio: ${habitTitle}`, {
        body: '¡Es hora de completar tu hábito!',
        requireInteraction: true
      });

      // Reschedule for the next day
      scheduleHabitReminder(habitTitle, reminderTime);
    }, delay);

    return timeoutId;
  }, [permission, sendNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleHabitReminder
  };
};
