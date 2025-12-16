import { useProjectTasks } from '@/hooks/useProjects';
import { KanbanColumn } from './KanbanColumn';
import { TASK_STATUSES, TaskStatus } from '@/types/projects';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const { tasks, loading, createTask, updateTaskStatus, deleteTask } = useProjectTasks(projectId);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.keys(TASK_STATUSES).map((status) => (
          <div key={status} className="flex-1 min-w-[280px] max-w-[320px] bg-gray-50 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
            <div className="space-y-2">
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statuses = Object.keys(TASK_STATUSES) as TaskStatus[];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
          onCreateTask={(title) => createTask(title, '', status)}
          onStatusChange={updateTaskStatus}
          onDeleteTask={deleteTask}
        />
      ))}
    </div>
  );
};
