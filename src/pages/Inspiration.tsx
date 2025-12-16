import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, ArrowLeft, Quote, Palette, Target, RefreshCw, 
  Heart, Star, Sparkles, BookOpen, Zap, Share2, Copy, Check
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Motivational quotes database
const QUOTES = [
  { text: "La creatividad es la inteligencia divirtiéndose.", author: "Albert Einstein", category: "creatividad" },
  { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs", category: "trabajo" },
  { text: "Cada día es una nueva oportunidad para cambiar tu vida.", author: "Desconocido", category: "motivación" },
  { text: "La felicidad no es algo hecho. Viene de tus propias acciones.", author: "Dalai Lama", category: "bienestar" },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali", category: "motivación" },
  { text: "El arte de vivir consiste en saber disfrutar de poco con mucha alegría.", author: "Ruskin", category: "bienestar" },
  { text: "La imaginación es el principio de la creación.", author: "George Bernard Shaw", category: "creatividad" },
  { text: "Sé el cambio que deseas ver en el mundo.", author: "Mahatma Gandhi", category: "motivación" },
  { text: "La mente es todo. En lo que piensas, te conviertes.", author: "Buda", category: "bienestar" },
  { text: "Nunca es demasiado tarde para ser lo que podrías haber sido.", author: "George Eliot", category: "motivación" },
  { text: "La creatividad requiere el coraje de soltar las certezas.", author: "Erich Fromm", category: "creatividad" },
  { text: "Cuida tu cuerpo. Es el único lugar que tienes para vivir.", author: "Jim Rohn", category: "bienestar" },
];

// Creative challenges database
const CHALLENGES = [
  { 
    title: "Dibujo de 5 minutos", 
    description: "Dibuja algo que veas a tu alrededor en solo 5 minutos sin levantar el lápiz.",
    difficulty: "fácil",
    category: "arte",
    icon: "🎨"
  },
  { 
    title: "Escritura creativa", 
    description: "Escribe un micro-relato de exactamente 50 palabras sobre tu día.",
    difficulty: "medio",
    category: "escritura",
    icon: "✍️"
  },
  { 
    title: "Fotografía del momento", 
    description: "Captura una foto que represente tu estado de ánimo actual.",
    difficulty: "fácil",
    category: "fotografía",
    icon: "📸"
  },
  { 
    title: "Playlist emocional", 
    description: "Crea una playlist de 5 canciones que definan cómo te sientes hoy.",
    difficulty: "fácil",
    category: "música",
    icon: "🎵"
  },
  { 
    title: "Collage digital", 
    description: "Crea un collage con 5 imágenes que representen tus metas del mes.",
    difficulty: "medio",
    category: "arte",
    icon: "🖼️"
  },
  { 
    title: "Carta al futuro", 
    description: "Escribe una carta a tu yo del próximo año. ¿Qué le dirías?",
    difficulty: "medio",
    category: "escritura",
    icon: "💌"
  },
  { 
    title: "Haiku del día", 
    description: "Escribe un haiku (5-7-5 sílabas) inspirado en la naturaleza.",
    difficulty: "difícil",
    category: "escritura",
    icon: "🌸"
  },
  { 
    title: "Sketch rápido", 
    description: "Dibuja tu comida favorita en estilo cartoon.",
    difficulty: "fácil",
    category: "arte",
    icon: "🍕"
  },
];

// Daily tips
const WELLNESS_TIPS = [
  { tip: "Toma 5 respiraciones profundas antes de comenzar tu día.", icon: "🌬️" },
  { tip: "Bebe un vaso de agua al despertar para hidratarte.", icon: "💧" },
  { tip: "Dedica 10 minutos a estirarte cada mañana.", icon: "🧘" },
  { tip: "Escribe 3 cosas por las que estés agradecido hoy.", icon: "📝" },
  { tip: "Da un paseo de 15 minutos para despejar la mente.", icon: "🚶" },
  { tip: "Escucha tu canción favorita y déjate llevar.", icon: "🎧" },
  { tip: "Sonríe a un extraño. La amabilidad es contagiosa.", icon: "😊" },
  { tip: "Desconéctate de las redes sociales por 1 hora.", icon: "📵" },
];

const Inspiration = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [currentChallenge, setCurrentChallenge] = useState(CHALLENGES[0]);
  const [currentTip, setCurrentTip] = useState(WELLNESS_TIPS[0]);
  const [copied, setCopied] = useState(false);
  const [likedQuote, setLikedQuote] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Initialize with daily content based on date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    setCurrentQuote(QUOTES[dayOfYear % QUOTES.length]);
    setCurrentChallenge(CHALLENGES[dayOfYear % CHALLENGES.length]);
    setCurrentTip(WELLNESS_TIPS[dayOfYear % WELLNESS_TIPS.length]);
  }, []);

  const refreshQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);
    setLikedQuote(false);
  };

  const refreshChallenge = () => {
    const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
    setCurrentChallenge(CHALLENGES[randomIndex]);
  };

  const copyQuote = async () => {
    await navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    setCopied(true);
    toast.success('Frase copiada al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLikeQuote = () => {
    setLikedQuote(!likedQuote);
    if (!likedQuote) {
      toast.success('¡Frase guardada en favoritos!');
    }
  };

  const markChallengeComplete = () => {
    if (!completedChallenges.includes(currentChallenge.title)) {
      setCompletedChallenges([...completedChallenges, currentChallenge.title]);
      toast.success('¡Desafío completado! 🎉');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil': return 'bg-green-100 text-green-700';
      case 'medio': return 'bg-yellow-100 text-yellow-700';
      case 'difícil': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-calm rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-poppins bg-gradient-calm bg-clip-text text-transparent">
              Inspiración Diaria
            </span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="quotes" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-14">
            <TabsTrigger value="quotes" className="flex items-center gap-2 text-base">
              <Quote className="h-4 w-4" />
              Frases
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Desafíos
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4" />
              Bienestar
            </TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-calm rounded-full mx-auto flex items-center justify-center">
                    <Quote className="h-8 w-8 text-white" />
                  </div>
                  
                  <blockquote className="text-2xl md:text-3xl font-medium font-raleway text-foreground leading-relaxed">
                    "{currentQuote.text}"
                  </blockquote>
                  
                  <p className="text-lg text-muted-foreground font-poppins">
                    — {currentQuote.author}
                  </p>
                  
                  <Badge variant="secondary" className="capitalize">
                    {currentQuote.category}
                  </Badge>
                  
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={toggleLikeQuote}
                      className={likedQuote ? 'text-red-500 border-red-200' : ''}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${likedQuote ? 'fill-current' : ''}`} />
                      {likedQuote ? 'Guardada' : 'Guardar'}
                    </Button>
                    <Button variant="outline" size="lg" onClick={copyQuote}>
                      {copied ? <Check className="h-5 w-5 mr-2" /> : <Copy className="h-5 w-5 mr-2" />}
                      {copied ? 'Copiada' : 'Copiar'}
                    </Button>
                    <Button size="lg" onClick={refreshQuote} className="bg-gradient-calm hover:opacity-90">
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Nueva frase
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* More Quotes Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {QUOTES.slice(0, 4).map((quote, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setCurrentQuote(quote)}
                >
                  <CardContent className="p-6">
                    <p className="text-foreground font-raleway line-clamp-2">"{quote.text}"</p>
                    <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl font-poppins">
                    <span className="text-4xl">{currentChallenge.icon}</span>
                    Desafío del Día
                  </CardTitle>
                  <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
                    {currentChallenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold font-poppins text-foreground">
                      {currentChallenge.title}
                    </h3>
                    <p className="text-lg text-muted-foreground mt-2 font-raleway">
                      {currentChallenge.description}
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="capitalize">
                    {currentChallenge.category}
                  </Badge>
                  
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      size="lg" 
                      onClick={markChallengeComplete}
                      disabled={completedChallenges.includes(currentChallenge.title)}
                      className="bg-gradient-creative hover:opacity-90"
                    >
                      {completedChallenges.includes(currentChallenge.title) ? (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          ¡Completado!
                        </>
                      ) : (
                        <>
                          <Target className="h-5 w-5 mr-2" />
                          Marcar completado
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="lg" onClick={refreshChallenge}>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Otro desafío
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Challenges Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CHALLENGES.map((challenge, index) => (
                <Card 
                  key={index} 
                  className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                    completedChallenges.includes(challenge.title) ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => setCurrentChallenge(challenge)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{challenge.icon}</span>
                      {completedChallenges.includes(challenge.title) && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <h4 className="font-semibold mt-2 font-poppins text-foreground">{challenge.title}</h4>
                    <Badge className={`mt-2 text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <span className="text-6xl">{currentTip.icon}</span>
                  
                  <h3 className="text-2xl md:text-3xl font-bold font-poppins text-foreground">
                    Tip de Bienestar
                  </h3>
                  
                  <p className="text-xl text-muted-foreground font-raleway max-w-lg mx-auto">
                    {currentTip.tip}
                  </p>
                  
                  <Button 
                    size="lg" 
                    onClick={() => {
                      const randomIndex = Math.floor(Math.random() * WELLNESS_TIPS.length);
                      setCurrentTip(WELLNESS_TIPS[randomIndex]);
                    }}
                    className="bg-gradient-wellness hover:opacity-90"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Otro consejo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {WELLNESS_TIPS.map((tip, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setCurrentTip(tip)}
                >
                  <CardContent className="p-6 text-center">
                    <span className="text-3xl">{tip.icon}</span>
                    <p className="text-sm text-muted-foreground mt-3 font-raleway line-clamp-2">
                      {tip.tip}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Daily Summary */}
        <Card className="border-0 shadow-lg mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold font-poppins text-foreground">Tu progreso de hoy</h4>
                  <p className="text-sm text-muted-foreground">
                    {completedChallenges.length} desafío{completedChallenges.length !== 1 ? 's' : ''} completado{completedChallenges.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(completedChallenges.length)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
                {[...Array(Math.max(0, 3 - completedChallenges.length))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Inspiration;
