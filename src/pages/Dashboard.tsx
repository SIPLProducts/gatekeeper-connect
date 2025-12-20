import { MainLayout } from "@/components/layout/MainLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { WeighbridgeStatus } from "@/components/dashboard/WeighbridgeStatus";
import { Package, Truck, FileOutput, Users, Scale, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard" subtitle="Gate Management Overview">
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
