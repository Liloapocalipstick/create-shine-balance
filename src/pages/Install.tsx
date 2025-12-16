import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Check, Share, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-wellness/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-wellness" />
            </div>
            <CardTitle className="text-2xl">¡App Instalada!</CardTitle>
            <CardDescription>
              Luminous ya está instalada en tu dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Ir al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl font-bold text-primary-foreground">L</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Instala Luminous
          </h1>
          <p className="text-lg text-muted-foreground">
            Añade Luminous a tu pantalla de inicio para una experiencia más rápida y acceso sin conexión
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Beneficios de instalar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Acceso rápido</p>
                <p className="text-sm text-muted-foreground">
                  Abre la app directamente desde tu pantalla de inicio
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-medium">Funciona sin conexión</p>
                <p className="text-sm text-muted-foreground">
                  Accede a tus hábitos y meditaciones incluso sin internet
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="font-medium">Notificaciones</p>
                <p className="text-sm text-muted-foreground">
                  Recibe recordatorios de tus hábitos diarios
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Install Button or Instructions */}
        {deferredPrompt ? (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <Button 
                onClick={handleInstallClick} 
                size="lg" 
                className="w-full text-lg py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Instalar Luminous
              </Button>
            </CardContent>
          </Card>
        ) : isIOS ? (
          <Card>
            <CardHeader>
              <CardTitle>Cómo instalar en iPhone/iPad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                  1
                </div>
                <div className="flex items-center gap-2">
                  <p>Toca el botón</p>
                  <Share className="w-5 h-5 text-primary" />
                  <p>en Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                  2
                </div>
                <div className="flex items-center gap-2">
                  <p>Selecciona</p>
                  <Plus className="w-5 h-5" />
                  <p>"Añadir a pantalla de inicio"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                  3
                </div>
                <p>Confirma tocando "Añadir"</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Cómo instalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Busca el icono de instalación en la barra de direcciones de tu navegador, 
                o accede al menú del navegador y selecciona "Instalar app" o "Añadir a pantalla de inicio".
              </p>
            </CardContent>
          </Card>
        )}

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link to="/" className="text-primary hover:underline">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Install;
