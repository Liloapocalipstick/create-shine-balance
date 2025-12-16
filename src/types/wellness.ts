export interface WellnessHabit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  target_count: number;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  count: number;
  notes: string | null;
  created_at: string;
}

export interface Meditation {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  category: 'breathing' | 'relaxation' | 'focus' | 'sleep' | 'gratitude';
  audio_url: string | null;
  image_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  meditation_id: string | null;
  duration_seconds: number;
  completed_at: string;
}

export const MEDITATION_CATEGORIES = {
  breathing: { label: 'Respiración', icon: '🌬️', color: 'bg-blue-500' },
  relaxation: { label: 'Relajación', icon: '🧘', color: 'bg-purple-500' },
  focus: { label: 'Enfoque', icon: '🎯', color: 'bg-orange-500' },
  sleep: { label: 'Sueño', icon: '🌙', color: 'bg-indigo-500' },
  gratitude: { label: 'Gratitud', icon: '💛', color: 'bg-yellow-500' }
} as const;

export const HABIT_ICONS = ['💧', '🏃', '📖', '🧘', '💤', '🥗', '💊', '✍️', '🎨', '🎵', '🌿', '❤️'];
