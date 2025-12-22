import { MainLayout } from "@/components/layout/MainLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { WeighbridgeStatus } from "@/components/dashboard/WeighbridgeStatus";
import { Package, Truck, FileOutput, Users, Scale, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { profile, roles } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getRoleDisplay = () => {
    if (roles.length === 0) return "User";
    const roleLabels: Record<string, string> = {
      admin: "Administrator",
      security_guard: "Security Guard",
      store_manager: "Store Manager",
      plant_manager: "Plant Manager",
      finance_head: "Finance Head",
      viewer: "Viewer",
    };
    return roles.map(r => roleLabels[r] || r).join(", ");
  };

  return (
    <MainLayout title="Dashboard" subtitle="Gate Management Overview">
      {/* Welcome Message with gradient colors */}
      <Card className="mb-6 bg-gradient-to-r from-secondary/20 via-secondary/10 to-transparent border-secondary/30 animate-fade-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {getGreeting()}, <span className="text-secondary">{profile?.full_name || "User"}</span>! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                Welcome to IGMS. You are logged in as <span className="font-medium text-primary">{getRoleDisplay()}</span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground">Today's Date</p>
              <p className="font-semibold text-foreground">{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          title="Today's Inbound"
          value="24"
          change="+12% from yesterday"
          changeType="positive"
          icon={Package}
          iconColor="bg-info"
        />
        <MetricCard
          title="Today's Outbound"
          value="18"
          change="+5% from yesterday"
          changeType="positive"
          icon={FileOutput}
          iconColor="bg-success"
        />
        <MetricCard
          title="Active RGP"
          value="12"
          change="3 overdue"
          changeType="negative"
          icon={Truck}
          iconColor="bg-warning"
        />
        <MetricCard
          title="Pending NRGP"
          value="5"
          change="2 awaiting approval"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="bg-destructive"
        />
        <MetricCard
          title="Visitors Today"
          value="8"
          change="All checked in"
          changeType="positive"
          icon={Users}
          iconColor="bg-accent"
        />
        <MetricCard
          title="Weighbridge"
          value="156"
          change="Transactions today"
          changeType="neutral"
          icon={Scale}
          iconColor="bg-primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Recent Entries */}
        <div className="lg:col-span-2 space-y-6">
          <RecentEntries />
          <PendingApprovals />
        </div>

        {/* Right Column - Quick Actions & Status */}
        <div className="space-y-6">
          <QuickActions />
          <WeighbridgeStatus />
        </div>
      </div>
    </MainLayout>
  );
}
