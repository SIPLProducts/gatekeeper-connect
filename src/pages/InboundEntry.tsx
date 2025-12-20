import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Truck, Package, Scale, FileText, Printer, Send, Plus } from "lucide-react";
import { toast } from "sonner";

interface POItem {
  materialCode: string;
  description: string;
  orderedQty: number;
  receivedQty: number;
  balanceQty: number;
  uom: string;
}

const mockPOItems: POItem[] = [
  { materialCode: "RM-101", description: "HR Coil 2.5mm", orderedQty: 1000, receivedQty: 980, balanceQty: 20, uom: "KG" },
  { materialCode: "RM-205", description: "Zinc Ingots", orderedQty: 500, receivedQty: 500, balanceQty: 0, uom: "KG" },
  { materialCode: "RM-310", description: "Copper Wire 4mm", orderedQty: 200, receivedQty: 150, balanceQty: 50, uom: "KG" },
];

export default function InboundEntry() {
  const [poNumber, setPONumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [poData, setPOData] = useState<{
    vendor: string;
    vendorCode: string;
    items: POItem[];
  } | null>(null);

  const handlePOSearch = () => {
    if (!poNumber) {
      toast.error("Please enter a PO Number");
      return;
    }
    setIsLoading(true);
    // Simulate SAP API call
    setTimeout(() => {
      setPOData({
        vendor: "Tata Steel Ltd",
        vendorCode: "V100234",
        items: mockPOItems,
      });
      setIsLoading(false);
      toast.success("PO data fetched from SAP");
    }, 1000);
  };

  const handleSubmit = () => {
    toast.success("Gate entry created successfully!");
  };

  return (
    <MainLayout title="Inbound Gate Entry" subtitle="Create new PO-based material inward">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Entry Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* PO Search Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                SAP Purchase Order
              </CardTitle>
              <CardDescription>Enter PO number to fetch vendor and material details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="po-number">PO Number</Label>
                  <Input
                    id="po-number"
                    placeholder="e.g., 4500012456"
                    value={poNumber}
                    onChange={(e) => setPONumber(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handlePOSearch} disabled={isLoading}>
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? "Fetching..." : "Fetch from SAP"}
                  </Button>
                </div>
              </div>

              {poData && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 p-4 rounded-lg bg-muted/50 animate-fade-in">
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor Code</p>
                    <p className="font-mono font-semibold">{poData.vendorCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor Name</p>
                    <p className="font-semibold">{poData.vendor}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-info" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="vehicle-number">Vehicle Number *</Label>
                  <Input id="vehicle-number" placeholder="e.g., TS09AB1234" />
                </div>
                <div>
                  <Label htmlFor="driver-name">Driver Name *</Label>
                  <Input id="driver-name" placeholder="Enter driver name" />
                </div>
                <div>
                  <Label htmlFor="driver-mobile">Driver Mobile</Label>
                  <Input id="driver-mobile" placeholder="Enter mobile number" />
                </div>
                <div>
                  <Label htmlFor="lr-number">LR Number</Label>
                  <Input id="lr-number" placeholder="e.g., LR-88901" />
                </div>
                <div>
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input id="invoice-number" placeholder="e.g., INV-4589" />
                </div>
                <div>
                  <Label htmlFor="gate">Gate *</Label>
                  <Select>
                    <SelectTrigger id="gate">
                      <SelectValue placeholder="Select gate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gate-1">Gate-1 (Main)</SelectItem>
                      <SelectItem value="gate-2">Gate-2 (East)</SelectItem>
                      <SelectItem value="gate-3">Gate-3 (Dispatch)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Material Items */}
          {poData && (
            <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-success" />
                  Material Line Items
                </CardTitle>
                <CardDescription>Enter received quantities for each material</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Ordered</TableHead>
                        <TableHead className="text-right">Previously Received</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-right">This Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poData.items.map((item, index) => (
                        <TableRow key={item.materialCode} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <TableCell className="font-mono">{item.materialCode}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.orderedQty} {item.uom}</TableCell>
                          <TableCell className="text-right">{item.receivedQty} {item.uom}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={item.balanceQty === 0 ? "outline" : "secondary"}>
                              {item.balanceQty} {item.uom}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="w-24 text-right font-mono"
                              placeholder="0"
                              max={item.balanceQty}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right - Weighbridge & Actions */}
        <div className="space-y-6">
          {/* Weighbridge */}
          <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-warning" />
                Weighbridge Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Gross Weight (KG)</Label>
                  <Input type="number" placeholder="Auto-capture" className="font-mono text-xl font-bold" />
                </div>
                <div>
                  <Label>Tare Weight (KG)</Label>
                  <Input type="number" placeholder="After unload" className="font-mono text-xl font-bold" />
                </div>
                <div className="rounded-lg bg-success/10 p-4">
                  <p className="text-sm text-muted-foreground">Net Weight</p>
                  <p className="text-2xl font-bold text-success font-mono">0 KG</p>
                </div>
                <div className="rounded-lg bg-info/10 p-4">
                  <p className="text-sm text-muted-foreground">Variance</p>
                  <p className="text-lg font-semibold text-info">Within tolerance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="animate-slide-up" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="hero" size="lg" onClick={handleSubmit}>
                <Plus className="mr-2 h-5 w-5" />
                Create Gate Entry
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Slip
                </Button>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send Alert
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Entry Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry Number</span>
                  <span className="font-mono font-medium">GE-2025-XXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Time</span>
                  <span className="font-mono font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security Officer</span>
                  <span className="font-medium">Rajesh Kumar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
