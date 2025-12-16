import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface DailyStats {
  date: string;
  habitsCompleted: number;
  totalHabits: number;
  meditationMinutes: number;
}

interface HabitStreak {
  habitId: string;
  habitTitle: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export const useWellnessStats = () => {
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<DailyStats[]>([]);
  const [habitStreaks, setHabitStreaks] = useState<HabitStreak[]>([]);
  const [totalMeditationMinutes, setTotalMeditationMinutes] = useState(0);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      const thirtyDaysAgo = subDays(today, 30);

      // Fetch habits
      const { data: habits } = await supabase
        .from('wellness_habits')
        .select('id, title');

      // Fetch habit logs for the month
      const { data: logs } = await supabase
        .from('habit_logs')
        .select('habit_id, completed_at')
        .gte('completed_at', format(thirtyDaysAgo, 'yyyy-MM-dd'));

      // Fetch meditation sessions
      const { data: sessions } = await supabase
        .from('meditation_sessions')
        .select('duration_seconds, completed_at')
        .eq('user_id', user.id);

      // Calculate weekly stats
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      const weeklyData = weekDays.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayLogs = logs?.filter(l => l.completed_at === dateStr) || [];
        const daySessions = sessions?.filter(s => 
          format(new Date(s.completed_at), 'yyyy-MM-dd') === dateStr
        ) || [];

        return {
          date: format(day, 'EEE', { locale: es }),
          habitsCompleted: dayLogs.length,
          totalHabits: habits?.length || 0,
          meditationMinutes: Math.round(daySessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60)
        };
      });
      setWeeklyStats(weeklyData);

      // Calculate monthly stats (last 30 days)
      const monthDays = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
      const monthlyData = monthDays.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayLogs = logs?.filter(l => l.completed_at === dateStr) || [];
        const daySessions = sessions?.filter(s => 
          format(new Date(s.completed_at), 'yyyy-MM-dd') === dateStr
        ) || [];

        return {
          date: format(day, 'd MMM', { locale: es }),
          habitsCompleted: dayLogs.length,
          totalHabits: habits?.length || 0,
          meditationMinutes: Math.round(daySessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60)
        };
      });
      setMonthlyStats(monthlyData);

      // Calculate habit streaks
      if (habits && logs) {
        const streaks = habits.map(habit => {
          const habitLogs = logs
            .filter(l => l.habit_id === habit.id)
            .map(l => l.completed_at)
            .sort()
            .reverse();

          // Calculate current streak
          let currentStreak = 0;
          let checkDate = format(today, 'yyyy-MM-dd');
          
          for (let i = 0; i <= 30; i++) {
            const dateToCheck = format(subDays(today, i), 'yyyy-MM-dd');
            if (habitLogs.includes(dateToCheck)) {
              currentStreak++;
            } else if (i > 0) {
              break;
            }
          }

          // Calculate completion rate (last 30 days)
          const last30Days = Array.from({ length: 30 }, (_, i) => 
            format(subDays(today, i), 'yyyy-MM-dd')
          );
          const completedInLast30 = habitLogs.filter(d => last30Days.includes(d)).length;
          const completionRate = Math.round((completedInLast30 / 30) * 100);

          return {
            habitId: habit.id,
            habitTitle: habit.title,
            currentStreak,
            longestStreak: currentStreak, // Simplified
            completionRate
          };
        });
        setHabitStreaks(streaks);
      }

      // Calculate total meditation stats
      if (sessions) {
        const totalMinutes = Math.round(sessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60);
        setTotalMeditationMinutes(totalMinutes);
        setTotalSessionsCount(sessions.length);
      }

      setLoading(false);
    };

    fetchStats();
  }, [user]);

  return { weeklyStats, monthlyStats, habitStreaks, totalMeditationMinutes, totalSessionsCount, loading };
};
