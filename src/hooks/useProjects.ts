import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectTask, TaskStatus } from '@/types/projects';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar los proyectos', variant: 'destructive' });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (title: string, description: string, color: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('projects')
      .insert({ title, description, color, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'No se pudo crear el proyecto', variant: 'destructive' });
      return null;
    }

    setProjects([data, ...projects]);
    toast({ title: '¡Proyecto creado!', description: 'Tu nuevo proyecto está listo' });
    return data;
  };

  const deleteProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el proyecto', variant: 'destructive' });
      return false;
    }

    setProjects(projects.filter(p => p.id !== projectId));
    toast({ title: 'Proyecto eliminado' });
    return true;
  };

  return { projects, loading, createProject, deleteProject, refetch: fetchProjects };
};

export const useProjectTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las tareas', variant: 'destructive' });
    } else {
      setTasks((data as ProjectTask[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const createTask = async (title: string, description: string, status: TaskStatus = 'ideas') => {
    const maxPosition = tasks.filter(t => t.status === status).length;
    
    const { data, error } = await supabase
      .from('project_tasks')
      .insert({ project_id: projectId, title, description, status, position: maxPosition })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'No se pudo crear la tarea', variant: 'destructive' });
      return null;
    }

    setTasks([...tasks, data as ProjectTask]);
    return data as ProjectTask;
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const maxPosition = tasks.filter(t => t.status === newStatus).length;
    
    const { error } = await supabase
      .from('project_tasks')
      .update({ status: newStatus, position: maxPosition })
      .eq('id', taskId);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo mover la tarea', variant: 'destructive' });
      return false;
    }

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus, position: maxPosition } : t));
    return true;
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la tarea', variant: 'destructive' });
      return false;
    }

    setTasks(tasks.filter(t => t.id !== taskId));
    return true;
  };

  return { tasks, loading, createTask, updateTaskStatus, deleteTask, refetch: fetchTasks };
};
