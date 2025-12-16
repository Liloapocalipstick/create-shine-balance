import { useState } from 'react';
import { ProjectTask, TASK_STATUSES, TaskStatus } from '@/types/projects';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: ProjectTask[];
  onCreateTask: (title: string, status: TaskStatus) => Promise<any>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn = ({ status, tasks, onCreateTask, onStatusChange, onDeleteTask }: KanbanColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const statusInfo = TASK_STATUSES[status];

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await onCreateTask(newTaskTitle, status);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="flex-1 min-w-[280px] max-w-[320px] bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
        <h3 className="font-semibold text-gray-900">{statusInfo.label}</h3>
        <span className="text-sm text-gray-500 ml-auto">{tasks.length}</span>
      </div>

      <div className="space-y-2 mb-3">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onStatusChange={onStatusChange}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {isAdding ? (
        <div className="space-y-2">
          <Input
            placeholder="Título de la tarea..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
              Añadir
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewTaskTitle(''); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-500 hover:text-gray-700"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir tarea
        </Button>
      )}
    </div>
  );
};
