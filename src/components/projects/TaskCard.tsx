import { ProjectTask, TASK_STATUSES, TaskStatus } from '@/types/projects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, ArrowRight } from 'lucide-react';

interface TaskCardProps {
  task: ProjectTask;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onStatusChange, onDelete }: TaskCardProps) => {
  const statuses = Object.keys(TASK_STATUSES) as TaskStatus[];
  const currentIndex = statuses.indexOf(task.status);

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentIndex < statuses.length - 1 && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, statuses[currentIndex + 1])}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Mover a {TASK_STATUSES[statuses[currentIndex + 1]].label}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
