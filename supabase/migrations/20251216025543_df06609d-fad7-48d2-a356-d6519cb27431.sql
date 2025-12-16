-- Create wellness_habits table
CREATE TABLE public.wellness_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '💧',
  color TEXT DEFAULT '#00BCD4',
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  target_count INTEGER DEFAULT 1,
  reminder_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit_logs table for tracking completions
CREATE TABLE public.habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.wellness_habits(id) ON DELETE CASCADE,
  completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, completed_at)
);

-- Create meditations table with preset content
CREATE TABLE public.meditations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breathing', 'relaxation', 'focus', 'sleep', 'gratitude')),
  audio_url TEXT,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meditation_sessions for user history
CREATE TABLE public.meditation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meditation_id UUID REFERENCES public.meditations(id) ON DELETE SET NULL,
  duration_seconds INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can view their own habits" ON public.wellness_habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.wellness_habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.wellness_habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.wellness_habits FOR DELETE USING (auth.uid() = user_id);

-- Habit logs policies (through habit ownership)
CREATE POLICY "Users can view their habit logs" ON public.habit_logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.wellness_habits WHERE id = habit_id AND user_id = auth.uid()));
CREATE POLICY "Users can create habit logs" ON public.habit_logs FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.wellness_habits WHERE id = habit_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete habit logs" ON public.habit_logs FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.wellness_habits WHERE id = habit_id AND user_id = auth.uid()));

-- Meditations are public for reading
CREATE POLICY "Anyone can view meditations" ON public.meditations FOR SELECT USING (true);

-- Meditation sessions policies
CREATE POLICY "Users can view their sessions" ON public.meditation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their sessions" ON public.meditation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_wellness_habits_updated_at BEFORE UPDATE ON public.wellness_habits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_wellness_habits_user_id ON public.wellness_habits(user_id);
CREATE INDEX idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX idx_habit_logs_completed_at ON public.habit_logs(completed_at);
CREATE INDEX idx_meditation_sessions_user_id ON public.meditation_sessions(user_id);

-- Insert default meditations
INSERT INTO public.meditations (title, description, duration_minutes, category) VALUES
('Respiración Consciente', 'Técnica de respiración para calmar la mente y reducir el estrés', 5, 'breathing'),
('Relajación Profunda', 'Meditación guiada para relajar todo el cuerpo', 10, 'relaxation'),
('Enfoque y Claridad', 'Mejora tu concentración con esta práctica mindfulness', 7, 'focus'),
('Preparación para Dormir', 'Relaja tu mente antes de descansar', 15, 'sleep'),
('Gratitud Diaria', 'Cultiva la gratitud con esta práctica reflexiva', 5, 'gratitude'),
('Respiración 4-7-8', 'Técnica de respiración para calmar la ansiedad', 3, 'breathing'),
('Body Scan', 'Escaneo corporal para liberar tensiones', 12, 'relaxation'),
('Meditación Matutina', 'Empieza el día con energía positiva', 8, 'focus');