import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const { user } = useAuth();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('luminous-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // Load theme from user preferences when logged in
  useEffect(() => {
    if (user) {
      loadUserTheme();
    }
  }, [user]);

  const loadUserTheme = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.preferences) {
      const prefs = data.preferences as { darkMode?: boolean };
      const userTheme = prefs.darkMode ? 'dark' : 'light';
      setThemeState(userTheme);
      applyTheme(userTheme);
      localStorage.setItem('luminous-theme', userTheme);
    }
  };

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('luminous-theme', newTheme);

    // Save to database if logged in
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      const currentPrefs = (data?.preferences as Record<string, unknown>) || {};
      
      await supabase
        .from('profiles')
        .update({
          preferences: {
            ...currentPrefs,
            darkMode: newTheme === 'dark'
          }
        })
        .eq('user_id', user.id);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
