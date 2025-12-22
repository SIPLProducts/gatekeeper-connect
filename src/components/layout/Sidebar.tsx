import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Package,
  FileOutput,
  FileInput,
  Users,
  Settings,
  Scale,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useScreenPermissions } from "@/hooks/useScreenPermissions";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inbound Entry", href: "/inbound", icon: Package },
  { name: "Outbound Delivery", href: "/outbound", icon: FileOutput },
  { name: "RGP Management", href: "/rgp", icon: FileInput },
  { name: "NRGP Management", href: "/nrgp", icon: FileOutput },
  { name: "Visitor Management", href: "/visitors", icon: Users },
  { name: "Weighbridge", href: "/weighbridge", icon: Scale },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, roles, signOut, isAdmin } = useAuth();
  const { canViewScreen, loading: permissionsLoading } = useScreenPermissions();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = () => {
    if (roles.length === 0) return "User";
    const roleLabels: Record<string, string> = {
      admin: "Admin",
      security_guard: "Security",
      store_manager: "Store Mgr",
      plant_manager: "Plant Mgr",
      finance_head: "Finance",
      viewer: "Viewer",
    };
    return roleLabels[roles[0]] || roles[0];
  };

  // Filter navigation based on permissions
  const filteredNavigation = navigation.filter((item) => {
    // Always show Dashboard and Settings
    if (item.href === "/" || item.href === "/settings") return true;
    // Admin sees everything
    if (isAdmin) return true;
    // Check permissions
    return canViewScreen(item.href);
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Building2 className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">IGMS</h1>
              <p className="text-xs text-sidebar-foreground/60">Gate Management</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleCollapsed}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "nav-item group",
                isActive && "active"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary-foreground")} />
              {!collapsed && (
                <span className="animate-fade-in truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground">
            <span className="text-sm font-semibold">
              {profile?.full_name ? getInitials(profile.full_name) : "U"}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 animate-fade-in min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/60">{getRoleLabel()}</p>
            </div>
          )}
          {!collapsed && (
            <button 
              onClick={handleLogout}
              className="rounded-lg p-2 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
