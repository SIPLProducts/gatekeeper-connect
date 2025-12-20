import { Scale, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeighbridgeData {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  lastReading?: string;
  currentVehicle?: string;
}

const weighbridges: WeighbridgeData[] = [
  {
    id: "WB-01",
    name: "Weighbridge 1 - Main Gate",
    status: "busy",
    lastReading: "18,500 KG",
    currentVehicle: "TS09AB1234",
  },
  {
    id: "WB-02",
    name: "Weighbridge 2 - East Gate",
    status: "online",
    lastReading: "7,200 KG",
  },
  {
    id: "WB-03",
    name: "Weighbridge 3 - Dispatch",
    status: "offline",
  },
];

const statusStyles = {
  online: { label: "Online", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "Offline", className: "bg-destructive/10 text-destructive border-destructive/20" },
  busy: { label: "In Use", className: "bg-warning/10 text-warning border-warning/20" },
};

export function WeighbridgeStatus() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Scale className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Weighbridge Status</h2>
          <p className="text-sm text-muted-foreground">Real-time monitoring</p>
        </div>
      </div>
      <div className="space-y-3">
        {weighbridges.map((wb, index) => (
          <div
            key={wb.id}
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${
                wb.status === "online" ? "bg-success animate-pulse" :
                wb.status === "busy" ? "bg-warning animate-pulse" :
                "bg-muted-foreground"
              }`} />
              <div>
                <p className="font-medium text-card-foreground">{wb.name}</p>
                {wb.currentVehicle && (
                  <p className="text-sm text-muted-foreground">
                    Vehicle: {wb.currentVehicle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {wb.lastReading && (
                <span className="text-sm font-mono font-medium text-foreground">
                  {wb.lastReading}
                </span>
              )}
              <Badge variant="outline" className={statusStyles[wb.status].className}>
                {statusStyles[wb.status].label}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
