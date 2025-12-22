import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ScreenPermission {
  screen_name: string;
  screen_path: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export function useScreenPermissions() {
  const { roles, isAdmin } = useAuth();
  const [permissions, setPermissions] = useState<ScreenPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (roles.length === 0) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("screen_permissions")
          .select("*")
          .in("role", roles);

        if (error) throw error;

        // Merge permissions across roles (most permissive wins)
        const mergedPermissions = new Map<string, ScreenPermission>();
        
        data?.forEach((perm) => {
          const existing = mergedPermissions.get(perm.screen_path);
          if (existing) {
            mergedPermissions.set(perm.screen_path, {
              ...existing,
              can_view: existing.can_view || perm.can_view,
              can_create: existing.can_create || perm.can_create,
              can_edit: existing.can_edit || perm.can_edit,
              can_delete: existing.can_delete || perm.can_delete,
            });
          } else {
            mergedPermissions.set(perm.screen_path, {
              screen_name: perm.screen_name,
              screen_path: perm.screen_path,
              can_view: perm.can_view ?? false,
              can_create: perm.can_create ?? false,
              can_edit: perm.can_edit ?? false,
              can_delete: perm.can_delete ?? false,
            });
          }
        });

        setPermissions(Array.from(mergedPermissions.values()));
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [roles]);

  const canViewScreen = (path: string): boolean => {
    if (isAdmin) return true;
    const perm = permissions.find((p) => p.screen_path === path);
    return perm?.can_view ?? false;
  };

  const canCreateOnScreen = (path: string): boolean => {
    if (isAdmin) return true;
    const perm = permissions.find((p) => p.screen_path === path);
    return perm?.can_create ?? false;
  };

  const canEditOnScreen = (path: string): boolean => {
    if (isAdmin) return true;
    const perm = permissions.find((p) => p.screen_path === path);
    return perm?.can_edit ?? false;
  };

  const canDeleteOnScreen = (path: string): boolean => {
    if (isAdmin) return true;
    const perm = permissions.find((p) => p.screen_path === path);
    return perm?.can_delete ?? false;
  };

  return {
    permissions,
    loading,
    canViewScreen,
    canCreateOnScreen,
    canEditOnScreen,
    canDeleteOnScreen,
  };
}
