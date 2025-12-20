import { ArrowUpRight, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Entry {
  id: string;
  type: "inbound" | "outbound" | "rgp" | "nrgp" | "visitor";
  vehicleNumber: string;
  vendorOrCustomer: string;
  gate: string;
  time: string;
  status: "in-progress" | "completed" | "pending";
}

const recentEntries: Entry[] = [
  {
    id: "GE-2025-001",
    type: "inbound",
    vehicleNumber: "TS09AB1234",
    vendorOrCustomer: "Tata Steel Ltd",
    gate: "Gate-2",
    time: "10:15 AM",
    status: "in-progress",
  },
  {
    id: "GE-2025-002",
    type: "outbound",
    vehicleNumber: "MH12EF4455",
    vendorOrCustomer: "JSW Infrastructure",
    gate: "Gate-1",
    time: "09:45 AM",
    status: "completed",
  },
  {
    id: "RGP-2025-045",
    type: "rgp",
    vehicleNumber: "TS07CD9988",
    vendorOrCustomer: "ABC Job Works",
    gate: "Gate-3",
    time: "09:30 AM",
    status: "pending",
  },
  {
    id: "GE-2025-003",
    type: "inbound",
    vehicleNumber: "AP29XY7788",
    vendorOrCustomer: "Hindalco Industries",
    gate: "Gate-2",
    time: "09:00 AM",
    status: "completed",
  },
  {
    id: "VIS-2025-012",
    type: "visitor",
    vehicleNumber: "AP01ZZ1122",
    vendorOrCustomer: "Siemens - Anil Sharma",
    gate: "Main Gate",
    time: "08:30 AM",
    status: "completed",
  },
];

const typeLabels = {
  inbound: { label: "Inbound", className: "bg-info/10 text-info border-info/20" },
  outbound: { label: "Outbound", className: "bg-success/10 text-success border-success/20" },
  rgp: { label: "RGP", className: "bg-warning/10 text-warning border-warning/20" },
  nrgp: { label: "NRGP", className: "bg-destructive/10 text-destructive border-destructive/20" },
  visitor: { label: "Visitor", className: "bg-accent/10 text-accent border-accent/20" },
};

const statusLabels = {
  "in-progress": { label: "In Progress", className: "status-badge-warning" },
  completed: { label: "Completed", className: "status-badge-success" },
  pending: { label: "Pending", className: "status-badge-info" },
};

export function RecentEntries() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Recent Gate Entries</h2>
          <p className="text-sm text-muted-foreground">Today's vehicle movements</p>
        </div>
        <Button variant="ghost" className="gap-2">
          View All <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Type</th>
              <th>Vehicle</th>
              <th>Vendor/Customer</th>
              <th>Gate</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEntries.map((entry, index) => (
              <tr
                key={entry.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="font-mono font-medium">{entry.id}</td>
                <td>
                  <Badge variant="outline" className={typeLabels[entry.type].className}>
                    {typeLabels[entry.type].label}
                  </Badge>
                </td>
                <td className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{entry.vehicleNumber}</span>
                </td>
                <td>{entry.vendorOrCustomer}</td>
                <td>{entry.gate}</td>
                <td>{entry.time}</td>
                <td>
                  <span className={`status-badge ${statusLabels[entry.status].className}`}>
                    {statusLabels[entry.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
