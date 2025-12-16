import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, BellOff, BellRing, Check } from 'lucide-react';

export const NotificationPrompt = () => {
  const { permission, isSupported, requestPermission } = useNotifications();

  if (!isSupported) {
    return null;
  }

  if (permission === 'granted') {
    return (
      <Card className="border-0 shadow-md bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full text-white">
              <Check className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">Notificaciones activadas</p>
              <p className="text-sm text-green-600">Recibirás recordatorios de tus hábitos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="border-0 shadow-md bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-400 rounded-full text-white">
              <BellOff className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-700">Notificaciones bloqueadas</p>
              <p className="text-sm text-gray-500">Habilítalas en la configuración del navegador</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-wellness rounded-full text-white animate-pulse">
            <BellRing className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">¿Activar recordatorios?</p>
            <p className="text-sm text-gray-600">Recibe notificaciones para tus hábitos</p>
          </div>
          <Button onClick={requestPermission} variant="wellness" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Activar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
