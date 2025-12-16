import { WellnessHabit } from '@/types/wellness';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: WellnessHabit;
  isCompleted: boolean;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard = ({ habit, isCompleted, onToggle, onDelete }: HabitCardProps) => {
  return (
    <Card 
      className={cn(
        "border-0 shadow-md transition-all duration-300 group cursor-pointer",
        isCompleted ? "bg-green-50 ring-2 ring-green-400" : "bg-white hover:shadow-lg"
      )}
      onClick={() => onToggle(habit.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div 
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform",
              isCompleted ? "scale-110" : "group-hover:scale-105"
            )}
            style={{ backgroundColor: isCompleted ? '#22c55e' : habit.color + '20' }}
          >
            {isCompleted ? <Check className="h-6 w-6 text-white" /> : habit.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold truncate",
              isCompleted ? "text-green-700 line-through" : "text-gray-900"
            )}>
              {habit.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {habit.description && (
                <p className="text-sm text-gray-500 truncate">{habit.description}</p>
              )}
              {habit.reminder_time && (
                <span className="flex items-center gap-1 text-xs text-blue-500">
                  <Bell className="h-3 w-3" />
                  {habit.reminder_time}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
