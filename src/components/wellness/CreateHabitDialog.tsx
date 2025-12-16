import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { HABIT_ICONS } from '@/types/wellness';

const HABIT_COLORS = ['#00BCD4', '#8BC34A', '#FF5722', '#9C27B0', '#2196F3', '#FF9800', '#E91E63', '#4CAF50'];

interface CreateHabitDialogProps {
  onCreateHabit: (habit: { title: string; description: string; icon: string; color: string; frequency: 'daily' | 'weekly'; target_count: number; reminder_time: string | null }) => Promise<any>;
}

export const CreateHabitDialog = ({ onCreateHabit }: CreateHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [reminderTime, setReminderTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const result = await onCreateHabit({
      title,
      description,
      icon,
      color,
      frequency: 'daily',
      target_count: 1,
      reminder_time: reminderTime || null
    });
    setIsSubmitting(false);

    if (result) {
      setTitle('');
      setDescription('');
      setIcon(HABIT_ICONS[0]);
      setColor(HABIT_COLORS[0]);
      setReminderTime('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="wellness">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Hábito
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-poppins">Crear Nuevo Hábito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nombre del hábito</Label>
            <Input
              id="title"
              placeholder="Ej: Beber 8 vasos de agua"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              placeholder="¿Por qué es importante?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Icono</Label>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === i ? 'bg-gray-200 ring-2 ring-gray-400 scale-110' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder">Recordatorio (opcional)</Label>
            <Input
              id="reminder"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="wellness" disabled={isSubmitting || !title.trim()} className="flex-1">
              {isSubmitting ? 'Creando...' : 'Crear Hábito'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
