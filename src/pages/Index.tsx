import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, Sun } from "lucide-react";
import heroImage from "@/assets/hero-luminous.jpg";
import logoImage from "@/assets/logo.png";
const Index = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Proyectos Creativos",
      description: "Organiza tus ideas con tableros visuales y herramientas que inspiran tu creatividad.",
      color: "bg-gradient-creative"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Rituales de Bienestar",
      description: "Crea rutinas personalizadas de meditación, ejercicio y autocuidado diario.",
      color: "bg-gradient-wellness"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Inspiración Diaria",
      description: "Recibe contenido motivacional y ejercicios creativos para despertar tu potencial.",
      color: "bg-gradient-calm"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidad Luminosa",
      description: "Conéctate con otros creadores y comparte tu viaje de crecimiento personal.",
      color: "bg-gradient-primary"
    }
  ];

  const stats = [
    { number: "10K+", label: "Usuarios Activos" },
    { number: "25K+", label: "Proyectos Creados" },
    { number: "50K+", label: "Rituales Completados" },
    { number: "100+", label: "Desafíos Disponibles" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-background/90 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoImage} alt="Luminous Mind" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
              Luminous Mind
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground font-medium transition-smooth">
              Funciones
            </a>
            <a href="#community" className="text-muted-foreground hover:text-foreground font-medium transition-smooth">
              Comunidad
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground font-medium transition-smooth">
              Nosotros
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="hidden md:inline-flex">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" className="shadow-lg">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-page relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold font-poppins leading-tight">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Despierta
                  </span>
                  <br />
                  tu creatividad y{" "}
                  <span className="bg-gradient-wellness bg-clip-text text-transparent">
                    bienestar
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground font-raleway max-w-lg">
                  Plataforma digital para inspirar y organizar proyectos creativos, 
                  rituales de bienestar y momentos de reflexión diaria.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                    <Sun className="mr-2 h-5 w-5" />
                    Comienza Tu Viaje
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
                  Ver Demo
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 font-poppins">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-raleway">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-float">
              <img 
                src={heroImage} 
                alt="Luminous - Creatividad y Bienestar" 
                className="w-full h-auto rounded-3xl shadow-2xl shadow-creative"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-wellness rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold font-poppins text-gray-900">
              Funcionalidades que{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Transforman
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-raleway max-w-3xl mx-auto">
              Herramientas diseñadas para potenciar tu creatividad y bienestar en un solo lugar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold font-poppins text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-raleway text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-poppins">
              ¿Listo para Brillar?
            </h2>
            <p className="text-xl text-white/90 font-raleway max-w-2xl mx-auto">
              Únete a miles de personas que ya están transformando su vida creativa y bienestar con Luminous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Comenzar Ahora
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900">
                Explorar Funciones
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce"></div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src={logoImage} alt="Luminous Mind" className="h-10 w-10 object-contain" />
                <span className="text-xl font-bold font-poppins">
                  Luminous Mind
                </span>
              </div>
              <p className="text-gray-400 font-raleway">
                Despierta tu creatividad y bienestar cada día
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-poppins">Producto</h3>
              <ul className="space-y-2 text-gray-400 font-raleway">
                <li><a href="#" className="hover:text-white transition-smooth">Funciones</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Integraciones</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-poppins">Comunidad</h3>
              <ul className="space-y-2 text-gray-400 font-raleway">
                <li><a href="#" className="hover:text-white transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Eventos</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Soporte</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 font-poppins">Empresa</h3>
              <ul className="space-y-2 text-gray-400 font-raleway">
                <li><a href="#" className="hover:text-white transition-smooth">Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Carrera</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 font-raleway">
              © 2024 Luminous. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;