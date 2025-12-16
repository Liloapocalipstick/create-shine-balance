import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WellnessHabit, HabitLog, Meditation, MeditationSession } from '@/types/wellness';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useWellnessHabits = () => {
  const [habits, setHabits] = useState<WellnessHabit[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const fetchHabits = async () => {
    if (!user) return;

    const { data: habitsData, error: habitsError } = await supabase
      .from('wellness_habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (habitsError) {
      toast({ title: 'Error', description: 'No se pudieron cargar los hábitos', variant: 'destructive' });
    } else {
      setHabits((habitsData as WellnessHabit[]) || []);
    }

    // Fetch today's logs
    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('completed_at', today);

    setTodayLogs((logsData as HabitLog[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const createHabit = async (habit: Omit<WellnessHabit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('wellness_habits')
      .insert({ ...habit, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'No se pudo crear el hábito', variant: 'destructive' });
      return null;
    }

    setHabits([...habits, data as WellnessHabit]);
    toast({ title: '¡Hábito creado!', description: 'Comienza tu nuevo ritual' });
    return data;
  };

  const toggleHabitCompletion = async (habitId: string) => {
    const existingLog = todayLogs.find(log => log.habit_id === habitId);

    if (existingLog) {
      // Remove log
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('id', existingLog.id);

      if (!error) {
        setTodayLogs(todayLogs.filter(log => log.id !== existingLog.id));
      }
    } else {
      // Add log
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({ habit_id: habitId, completed_at: today })
        .select()
        .single();

      if (!error && data) {
        setTodayLogs([...todayLogs, data as HabitLog]);
        toast({ title: '¡Bien hecho! 🎉', description: 'Hábito completado' });
      }
    }
  };

  const deleteHabit = async (habitId: string) => {
    const { error } = await supabase
      .from('wellness_habits')
      .delete()
      .eq('id', habitId);

    if (!error) {
      setHabits(habits.filter(h => h.id !== habitId));
      toast({ title: 'Hábito eliminado' });
    }
  };

  const isHabitCompletedToday = (habitId: string) => {
    return todayLogs.some(log => log.habit_id === habitId);
  };

  return { habits, todayLogs, loading, createHabit, toggleHabitCompletion, deleteHabit, isHabitCompletedToday, refetch: fetchHabits };
};

export const useMeditations = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMeditations = async () => {
      const { data, error } = await supabase
        .from('meditations')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        toast({ title: 'Error', description: 'No se pudieron cargar las meditaciones', variant: 'destructive' });
      } else {
        setMeditations((data as Meditation[]) || []);
      }
      setLoading(false);
    };

    fetchMeditations();
  }, []);

  const logSession = async (meditationId: string, durationSeconds: number) => {
    if (!user) return;

    await supabase
      .from('meditation_sessions')
      .insert({ user_id: user.id, meditation_id: meditationId, duration_seconds: durationSeconds });

    toast({ title: '¡Sesión completada! 🧘', description: 'Tu mente te lo agradece' });
  };

  return { meditations, loading, logSession };
};
