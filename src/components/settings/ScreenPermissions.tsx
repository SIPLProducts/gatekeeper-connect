import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Eye, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = 'admin' | 'security_guard' | 'store_manager' | 'plant_manager' | 'finance_head' | 'viewer';

interface ScreenPermission {
  id: string;
  role: AppRole;
  screen_path: string;
  screen_name: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  security_guard: "Security Guard",
  store_manager: "Store Manager",
  plant_manager: "Plant Manager",
  finance_head: "Finance Head",
  viewer: "Viewer",
};

export function ScreenPermissions() {
  const { isAdmin } = useAuth();
  const [permissions, setPermissions] = useState<ScreenPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AppRole>("admin");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('screen_permissions')
        .select('*')
        .order('screen_name');

      if (error) throw error;
      setPermissions((data || []) as ScreenPermission[]);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (
    permissionId: string,
    field: 'can_view' | 'can_create' | 'can_edit' | 'can_delete',
    value: boolean
  ) => {
    if (!isAdmin) {
      toast.error('Only admins can modify permissions');
      return;
    }

    try {
      const { error } = await supabase
        .from('screen_permissions')
        .update({ [field]: value })
        .eq('id', permissionId);

      if (error) throw error;

      setPermissions(prev =>
        prev.map(p =>
          p.id === permissionId ? { ...p, [field]: value } : p
        )
      );
      toast.success('Permission updated');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  const filteredPermissions = permissions.filter(p => p.role === selectedRole);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">You need admin privileges to manage screen permissions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Screen Permissions
        </CardTitle>
        <CardDescription>Configure which screens each role can access</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Role Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Select Role:</label>
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(roleLabels) as AppRole[]).map(role => (
                <SelectItem key={role} value={role}>
                  {roleLabels[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Permissions Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading permissions...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Screen</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Plus className="h-4 w-4" />
                      Create
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Edit className="h-4 w-4" />
                      Edit
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No permissions configured for this role
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.screen_name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {permission.screen_path}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.can_view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, 'can_view', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.can_create}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, 'can_create', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.can_edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, 'can_edit', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.can_delete}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, 'can_delete', !!checked)
                          }
                        />
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
