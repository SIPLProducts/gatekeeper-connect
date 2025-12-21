import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Edit, Trash2, Shield, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = 'admin' | 'security_guard' | 'store_manager' | 'plant_manager' | 'finance_head' | 'viewer';

interface UserWithRoles {
  id: string;
  full_name: string;
  email: string;
  department: string | null;
  is_active: boolean;
  roles: AppRole[];
}

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  security_guard: "Security Guard",
  store_manager: "Store Manager",
  plant_manager: "Plant Manager",
  finance_head: "Finance Head",
  viewer: "Viewer",
};

const roleColors: Record<AppRole, string> = {
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  security_guard: "bg-info/10 text-info border-info/20",
  store_manager: "bg-success/10 text-success border-success/20",
  plant_manager: "bg-warning/10 text-warning border-warning/20",
  finance_head: "bg-primary/10 text-primary border-primary/20",
  viewer: "bg-muted text-muted-foreground border-muted",
};

export function UserManagement() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        department: profile.department,
        is_active: profile.is_active ?? true,
        roles: (userRoles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: selectedRole,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('User already has this role');
        } else {
          throw error;
        }
        return;
      }

      toast.success(`Role "${roleLabels[selectedRole]}" added to ${selectedUser.full_name}`);
      fetchUsers();
      setIsDialogOpen(false);
      setSelectedRole("");
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to add role');
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role "${roleLabels[role]}" removed`);
      fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">You need admin privileges to manage users</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage users and assign roles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading users...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.email}</TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="outline"
                              className={`${roleColors[role]} cursor-pointer`}
                              onClick={() => handleRemoveRole(user.id, role)}
                            >
                              {roleLabels[role]}
                              <span className="ml-1 opacity-60">×</span>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (open) setSelectedUser(user);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Role
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Role to {user.full_name}</DialogTitle>
                              <DialogDescription>
                                Select a role to assign to this user
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <Label>Role</Label>
                                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(Object.keys(roleLabels) as AppRole[])
                                      .filter(role => !user.roles.includes(role))
                                      .map(role => (
                                        <SelectItem key={role} value={role}>
                                          {roleLabels[role]}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleAddRole} className="w-full" disabled={!selectedRole}>
                                Add Role
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
