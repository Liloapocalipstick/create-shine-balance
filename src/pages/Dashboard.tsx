import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, Heart, Sparkles, LogOut, User, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Proyectos Creativos",
      description: "Organiza tus ideas y proyectos",
      color: "bg-gradient-creative",
      available: true,
      link: "/projects"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Rituales de Bienestar",
      description: "Tu rutina diaria de autocuidado",
      color: "bg-gradient-wellness",
      available: true,
      link: "/wellness"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Inspiración Diaria",
      description: "Contenido motivacional para ti",
      color: "bg-gradient-calm",
      available: false,
      link: "#"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Mi Progreso",
      description: "Estadísticas y rachas",
      color: "bg-gradient-to-br from-purple-500 to-indigo-500",
      available: true,
      link: "/stats"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
              Luminous
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-5 w-5" />
              <span className="font-medium">{user.email}</span>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Welcome */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-poppins text-gray-900">
              ¡Hola! 👋
            </h1>
            <p className="text-xl text-gray-600 font-raleway">
              Bienvenido a tu espacio de creatividad y bienestar
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                to={action.link}
                className={!action.available ? 'pointer-events-none' : ''}
              >
                <Card 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full ${
                    action.available ? 'cursor-pointer hover:-translate-y-1' : 'opacity-75'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                      {action.icon}
                    </div>
                    <CardTitle className="text-lg font-poppins flex items-center justify-between">
                      {action.title}
                      {!action.available && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-normal">
                          Próximamente
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-raleway text-sm">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Placeholder Content */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-poppins text-gray-900">
                  Tu viaje comienza aquí
                </h3>
                <p className="text-gray-600 font-raleway max-w-md mx-auto">
                  Pronto podrás crear proyectos creativos, establecer rituales de bienestar 
                  y recibir inspiración diaria personalizada.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
