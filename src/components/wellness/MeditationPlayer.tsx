import { useState, useEffect, useCallback } from 'react';
import { Meditation, MEDITATION_CATEGORIES } from '@/types/wellness';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, Pause, X, RotateCcw } from 'lucide-react';

interface MeditationPlayerProps {
  meditation: Meditation;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (meditationId: string, durationSeconds: number) => void;
}

export const MeditationPlayer = ({ meditation, isOpen, onClose, onComplete }: MeditationPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(meditation.duration_minutes * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const category = MEDITATION_CATEGORIES[meditation.category];

  const totalSeconds = meditation.duration_minutes * 60;
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  useEffect(() => {
    setTimeRemaining(meditation.duration_minutes * 60);
    setElapsedTime(0);
    setIsPlaying(false);
  }, [meditation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            onComplete(meditation.id, totalSeconds);
            return 0;
          }
          return prev - 1;
        });
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, meditation.id, totalSeconds, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = useCallback(() => {
    if (elapsedTime > 30) {
      onComplete(meditation.id, elapsedTime);
    }
    setIsPlaying(false);
    onClose();
  }, [elapsedTime, meditation.id, onClose, onComplete]);

  const reset = () => {
    setTimeRemaining(meditation.duration_minutes * 60);
    setElapsedTime(0);
    setIsPlaying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center py-8 space-y-8">
          {/* Category Icon */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
            isPlaying ? 'animate-pulse' : ''
          }`} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            {category.icon}
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-poppins">{meditation.title}</h2>
            <p className="text-white/70 text-sm">{meditation.description}</p>
          </div>

          {/* Timer */}
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8BC34A" />
                  <stop offset="100%" stopColor="#00BCD4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={reset}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-white text-purple-900 hover:bg-white/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
            
            <div className="w-10" /> {/* Spacer for balance */}
          </div>

          {/* Breathing Guide */}
          {meditation.category === 'breathing' && isPlaying && (
            <p className="text-white/70 text-sm animate-pulse">
              Respira profundo... inhala... exhala...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
