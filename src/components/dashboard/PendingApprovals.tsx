import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Approval {
  id: string;
  type: "rgp" | "nrgp" | "high-value";
  title: string;
  requestedBy: string;
  value?: string;
  createdAt: string;
  urgency: "high" | "medium" | "low";
}

const pendingApprovals: Approval[] = [
  {
    id: "APR-001",
    type: "rgp",
    title: "RGP-2025-048 - Motor Repair",
    requestedBy: "Stores Dept",
    value: "₹45,000",
    createdAt: "2 hours ago",
    urgency: "high",
  },
  {
    id: "APR-002",
    type: "nrgp",
    title: "NRGP-2025-023 - Scrap Disposal",
    requestedBy: "Maintenance",
    value: "₹25,000",
    createdAt: "4 hours ago",
    urgency: "medium",
  },
  {
    id: "APR-003",
    type: "high-value",
    title: "High Value Inbound - Copper Coils",
    requestedBy: "Purchase Dept",
    value: "₹5,00,000",
    createdAt: "1 day ago",
    urgency: "low",
  },
];

const urgencyStyles = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-info",
};

export function PendingApprovals() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Pending Approvals</h2>
            <p className="text-sm text-muted-foreground">{pendingApprovals.length} items need attention</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {pendingApprovals.map((approval, index) => (
          <div
            key={approval.id}
            className={`flex items-center justify-between border-l-4 p-4 transition-colors hover:bg-muted/30 animate-fade-in ${urgencyStyles[approval.urgency]}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="space-y-1">
              <p className="font-medium text-card-foreground">{approval.title}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Requested by {approval.requestedBy}</span>
                {approval.value && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-foreground">{approval.value}</span>
                  </>
                )}
                <span>•</span>
                <span>{approval.createdAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button size="sm" variant="success">
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
