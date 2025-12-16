import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { KanbanBoard } from '@/components/projects/KanbanBoard';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/projects';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        navigate('/projects');
        return;
      }

      setProject(data);
      setLoading(false);
    };

    if (user) fetchProject();
  }, [id, user, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user || !project) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
                Luminous
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Project Header */}
          <div className="flex items-start gap-4">
            <div 
              className="w-4 h-12 rounded-full" 
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-3xl font-bold font-poppins text-gray-900">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-gray-600 font-raleway mt-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Kanban Board */}
          <KanbanBoard projectId={project.id} />
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
