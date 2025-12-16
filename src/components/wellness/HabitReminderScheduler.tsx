import { useEffect, useRef } from 'react';
import { WellnessHabit } from '@/types/wellness';
import { useNotifications } from '@/hooks/useNotifications';

interface HabitReminderSchedulerProps {
  habits: WellnessHabit[];
  isHabitCompletedToday: (habitId: string) => boolean;
}

export const HabitReminderScheduler = ({ habits, isHabitCompletedToday }: HabitReminderSchedulerProps) => {
  const { permission, scheduleHabitReminder } = useNotifications();
  const scheduledTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (permission !== 'granted') return;

    // Clear all existing timeouts
    scheduledTimeouts.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeouts.current.clear();

    // Schedule reminders for habits that have reminder_time set and aren't completed
    habits.forEach(habit => {
      if (habit.reminder_time && !isHabitCompletedToday(habit.id)) {
        const timeoutId = scheduleHabitReminder(habit.title, habit.reminder_time);
        if (timeoutId) {
          scheduledTimeouts.current.set(habit.id, timeoutId);
        }
      }
    });

    return () => {
      scheduledTimeouts.current.forEach(timeout => clearTimeout(timeout));
      scheduledTimeouts.current.clear();
    };
  }, [habits, permission, scheduleHabitReminder, isHabitCompletedToday]);

  // This component doesn't render anything
  return null;
};
