import { Link } from "react-router-dom";
import { Package, FileOutput, FileInput, Users, Scale, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    name: "New Inbound Entry",
    description: "Create PO-based gate entry",
    href: "/inbound/new",
    icon: Package,
    color: "bg-info",
  },
  {
    name: "New Outbound Entry",
    description: "Dispatch with delivery number",
    href: "/outbound/new",
    icon: FileOutput,
    color: "bg-success",
  },
  {
    name: "Create RGP",
    description: "Returnable gate pass",
    href: "/rgp/new",
    icon: FileInput,
    color: "bg-warning",
  },
  {
    name: "Register Visitor",
    description: "New visitor check-in",
    href: "/visitors/new",
    icon: Users,
    color: "bg-accent",
  },
  {
    name: "Weighbridge Entry",
    description: "Record weight measurement",
    href: "/weighbridge/new",
    icon: Scale,
    color: "bg-primary",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">Quick Actions</h2>
      <div className="grid gap-3">
        {actions.map((action, index) => (
          <Link
            key={action.name}
            to={action.href}
            className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:bg-muted/50 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${action.color}`}
            >
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-card-foreground">{action.name}</p>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
            <Plus className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:rotate-90" />
          </Link>
        ))}
      </div>
    </div>
  );
}
