import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          onClick={() => setCollapsed(!collapsed)}
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
        {navigation.map((item) => {
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
            <span className="text-sm font-semibold">SA</span>
          </div>
          {!collapsed && (
            <div className="flex-1 animate-fade-in">
              <p className="text-sm font-medium text-sidebar-foreground">Super Admin</p>
              <p className="text-xs text-sidebar-foreground/60">admin@company.com</p>
            </div>
          )}
          {!collapsed && (
            <button className="rounded-lg p-2 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
