import { Meditation, MEDITATION_CATEGORIES } from '@/types/wellness';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Clock } from 'lucide-react';

interface MeditationCardProps {
  meditation: Meditation;
  onSelect: (meditation: Meditation) => void;
}

export const MeditationCard = ({ meditation, onSelect }: MeditationCardProps) => {
  const category = MEDITATION_CATEGORIES[meditation.category];

  return (
    <Card 
      className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
      onClick={() => onSelect(meditation)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
            {category.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{meditation.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {category.label}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {meditation.duration_minutes} min
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-wellness flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-5 w-5 ml-0.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
