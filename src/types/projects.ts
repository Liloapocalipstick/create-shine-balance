export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'ideas' | 'in_progress' | 'review' | 'completed';
  position: number;
  created_at: string;
  updated_at: string;
}

export const TASK_STATUSES = {
  ideas: { label: 'Ideas', color: 'bg-purple-500' },
  in_progress: { label: 'En Progreso', color: 'bg-blue-500' },
  review: { label: 'Revisión', color: 'bg-yellow-500' },
  completed: { label: 'Completado', color: 'bg-green-500' }
} as const;

export type TaskStatus = keyof typeof TASK_STATUSES;
