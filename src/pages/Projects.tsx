import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Folder, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import logoImage from '@/assets/logo.png';

const Projects = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { projects, loading, createProject, deleteProject } = useProjects();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src={logoImage} alt="Luminous Mind" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
                Luminous Mind
              </span>
            </div>
          </div>
          
          <CreateProjectDialog onCreateProject={createProject} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-gray-900">
              Proyectos Creativos
            </h1>
            <p className="text-gray-600 font-raleway mt-2">
              Organiza tus ideas y tareas en tableros visuales
            </p>
          </div>

          {projects.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-creative rounded-full mx-auto flex items-center justify-center">
                    <Folder className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-poppins text-gray-900">
                    Crea tu primer proyecto
                  </h3>
                  <p className="text-gray-600 font-raleway max-w-md mx-auto">
                    Empieza a organizar tus ideas con tableros kanban visuales
                  </p>
                  <CreateProjectDialog onCreateProject={createProject} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div 
                    className="h-2 rounded-t-lg" 
                    style={{ backgroundColor: project.color }} 
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="text-lg font-poppins hover:text-orange-600 transition-colors flex-1"
                      >
                        {project.title}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProject(project.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/projects/${project.id}`}>
                      {project.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(project.created_at).toLocaleDateString('es-ES')}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
