import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ArrowLeft, TrendingUp, Clock, Flame, Target, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWellnessStats } from '@/hooks/useWellnessStats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const Stats = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { weeklyStats, monthlyStats, habitStreaks, totalMeditationMinutes, totalSessionsCount, loading } = useWellnessStats();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalHabitsCompleted = monthlyStats.reduce((acc, d) => acc + d.habitsCompleted, 0);
  const avgCompletionRate = habitStreaks.length > 0 
    ? Math.round(habitStreaks.reduce((acc, h) => acc + h.completionRate, 0) / habitStreaks.length) 
    : 0;
  const bestStreak = Math.max(...habitStreaks.map(h => h.currentStreak), 0);

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-nav">
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
          <div>
            <h1 className="text-3xl font-bold font-poppins text-gray-900">
              Tu Progreso
            </h1>
            <p className="text-gray-600 font-raleway mt-1">
              Estadísticas de los últimos 30 días
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Hábitos</p>
                    <p className="text-2xl font-bold">{totalHabitsCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400 to-green-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Consistencia</p>
                    <p className="text-2xl font-bold">{avgCompletionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-400 to-purple-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Meditación</p>
                    <p className="text-2xl font-bold">{totalMeditationMinutes} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-400 to-red-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Mejor Racha</p>
                    <p className="text-2xl font-bold">{bestStreak} días</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekly Habits Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Hábitos Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyStats}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [`${value} hábitos`, 'Completados']}
                      />
                      <Bar dataKey="habitsCompleted" fill="#FF5722" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Meditation Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Meditación Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyStats}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [`${value} min`, 'Meditación']}
                      />
                      <defs>
                        <linearGradient id="colorMeditation" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="meditationMinutes" 
                        stroke="#9C27B0" 
                        fill="url(#colorMeditation)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-poppins flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Tendencia Mensual (30 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="habitsCompleted" 
                      stroke="#FF5722" 
                      strokeWidth={2}
                      dot={false}
                      name="Hábitos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meditationMinutes" 
                      stroke="#9C27B0" 
                      strokeWidth={2}
                      dot={false}
                      name="Meditación (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Habit Streaks */}
          {habitStreaks.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  Rachas por Hábito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habitStreaks.map((habit) => (
                    <div key={habit.habitId} className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{habit.habitTitle}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            {habit.currentStreak} días
                          </span>
                          <span>{habit.completionRate}% consistencia</span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${habit.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Stats;
