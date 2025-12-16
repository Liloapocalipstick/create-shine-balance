import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Users, Shield, ShieldCheck, ShieldAlert, 
  User, Crown, UserCog, Trash2, Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AppRole = 'admin' | 'moderator' | 'user';

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  display_name: string | null;
  roles: AppRole[];
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch all profiles (admins can see all via RLS)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithProfile[] = (profiles || []).map(profile => ({
        id: profile.user_id,
        email: profile.display_name || 'Sin nombre',
        created_at: profile.created_at,
        display_name: profile.display_name,
        roles: (allRoles || [])
          .filter(r => r.user_id === profile.user_id)
          .map(r => r.role as AppRole)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });

      if (error) throw error;

      toast.success(`Rol ${role} asignado correctamente`);
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Error al asignar rol');
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (userId === user?.id && role === 'admin') {
      toast.error('No puedes quitarte el rol de admin a ti mismo');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Rol ${role} eliminado`);
      fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Error al eliminar rol');
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'moderator': return <ShieldCheck className="h-3 w-3" />;
      case 'user': return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'moderator': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'user': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-poppins text-foreground">
              Panel de Administración
            </span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Usuarios</p>
                    <p className="text-3xl font-bold font-poppins">{users.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Administradores</p>
                    <p className="text-3xl font-bold font-poppins">
                      {users.filter(u => u.roles.includes('admin')).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Crown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Moderadores</p>
                    <p className="text-3xl font-bold font-poppins">
                      {users.filter(u => u.roles.includes('moderator')).length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <UserCog className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay usuarios registrados</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Roles Actuales</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead>Asignar Rol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                              {(u.display_name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{u.display_name || 'Sin nombre'}</p>
                              <p className="text-sm text-muted-foreground">{u.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {u.roles.length === 0 ? (
                              <Badge variant="outline" className="text-muted-foreground">
                                Sin roles
                              </Badge>
                            ) : (
                              u.roles.map(role => (
                                <Badge 
                                  key={role} 
                                  className={`${getRoleBadgeColor(role)} flex items-center gap-1`}
                                >
                                  {getRoleIcon(role)}
                                  {role}
                                  <button 
                                    onClick={() => removeRole(u.id, role)}
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <Select onValueChange={(role) => assignRole(u.id, role as AppRole)}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Añadir rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Crown className="h-4 w-4 text-red-500" />
                                  Admin
                                </div>
                              </SelectItem>
                              <SelectItem value="moderator">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                                  Moderador
                                </div>
                              </SelectItem>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  Usuario
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
