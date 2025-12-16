import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, ArrowLeft, Heart, Target, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWellnessHabits, useMeditations } from '@/hooks/useWellness';
import { Meditation, MEDITATION_CATEGORIES } from '@/types/wellness';
import { HabitCard } from '@/components/wellness/HabitCard';
import { CreateHabitDialog } from '@/components/wellness/CreateHabitDialog';
import { MeditationCard } from '@/components/wellness/MeditationCard';
import { MeditationPlayer } from '@/components/wellness/MeditationPlayer';
import { NotificationPrompt } from '@/components/wellness/NotificationPrompt';
import { HabitReminderScheduler } from '@/components/wellness/HabitReminderScheduler';

const Wellness = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { habits, loading: habitsLoading, createHabit, toggleHabitCompletion, deleteHabit, isHabitCompletedToday } = useWellnessHabits();
  const { meditations, loading: meditationsLoading, logSession } = useMeditations();
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const completedToday = habits.filter(h => isHabitCompletedToday(h.id)).length;
  const progressPercent = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  if (authLoading || habitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
                Luminous
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-poppins text-gray-900">
                Rituales de Bienestar
              </h1>
              <p className="text-gray-600 font-raleway mt-1">
                Cuida tu mente y cuerpo cada día
              </p>
            </div>

            {/* Progress Card */}
            <Card className="border-0 shadow-lg bg-gradient-wellness text-white w-full md:w-auto">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{progressPercent}%</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Progreso de hoy</p>
                    <p className="font-semibold">{completedToday} de {habits.length} hábitos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="habits" className="space-y-6">
            <TabsList className="bg-white shadow-md">
              <TabsTrigger value="habits" className="gap-2">
                <Target className="h-4 w-4" />
                Mis Hábitos
              </TabsTrigger>
              <TabsTrigger value="meditations" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Meditaciones
              </TabsTrigger>
            </TabsList>

            {/* Habits Tab */}
            <TabsContent value="habits" className="space-y-6">
              {/* Notification Prompt */}
              <NotificationPrompt />
              
              {/* Habit Reminder Scheduler */}
              <HabitReminderScheduler habits={habits} isHabitCompletedToday={isHabitCompletedToday} />

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold font-poppins">Hábitos Diarios</h2>
                <CreateHabitDialog onCreateHabit={createHabit} />
              </div>

              {habits.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-gradient-wellness rounded-full mx-auto flex items-center justify-center">
                        <Heart className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold font-poppins text-gray-900">
                        Crea tu primer hábito
                      </h3>
                      <p className="text-gray-600 font-raleway max-w-md mx-auto">
                        Empieza con pequeños rituales diarios que transformarán tu bienestar
                      </p>
                      <CreateHabitDialog onCreateHabit={createHabit} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompleted={isHabitCompletedToday(habit.id)}
                      onToggle={toggleHabitCompletion}
                      onDelete={deleteHabit}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Meditations Tab */}
            <TabsContent value="meditations" className="space-y-6">
              <h2 className="text-xl font-semibold font-poppins">Meditaciones Guiadas</h2>

              {Object.entries(MEDITATION_CATEGORIES).map(([key, category]) => {
                const categoryMeditations = meditations.filter(m => m.category === key);
                if (categoryMeditations.length === 0) return null;

                return (
                  <div key={key} className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {categoryMeditations.map((meditation) => (
                        <MeditationCard
                          key={meditation.id}
                          meditation={meditation}
                          onSelect={setSelectedMeditation}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Meditation Player */}
      {selectedMeditation && (
        <MeditationPlayer
          meditation={selectedMeditation}
          isOpen={!!selectedMeditation}
          onClose={() => setSelectedMeditation(null)}
          onComplete={logSession}
        />
      )}
    </div>
  );
};

export default Wellness;
