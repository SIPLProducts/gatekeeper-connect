import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Truck, Package, FileOutput, Printer, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DeliveryItem {
  materialCode: string;
  description: string;
  quantity: number;
  uom: string;
  batch?: string;
}

const mockDeliveryItems: DeliveryItem[] = [
  { materialCode: "FG-501", description: "Finished Steel Sheets 3mm", quantity: 500, uom: "KG", batch: "B2025-001" },
  { materialCode: "FG-502", description: "Galvanized Coil 1.2mm", quantity: 750, uom: "KG", batch: "B2025-002" },
];

export default function OutboundDelivery() {
  const [deliveryNumber, setDeliveryNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryData, setDeliveryData] = useState<{
    customer: string;
    customerCode: string;
    invoiceNumber: string;
    items: DeliveryItem[];
  } | null>(null);

  const handleDeliverySearch = () => {
    if (!deliveryNumber) {
      toast.error("Please enter a Delivery Number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setDeliveryData({
        customer: "JSW Infrastructure",
        customerCode: "C200456",
        invoiceNumber: "INV-99021",
        items: mockDeliveryItems,
      });
      setIsLoading(false);
      toast.success("Delivery data fetched from SAP");
    }, 1000);
  };

  const handleDispatch = () => {
    toast.success("Dispatch gate pass created successfully!");
  };

  return (
    <MainLayout title="Outbound Delivery" subtitle="Create dispatch gate pass with SAP delivery reference">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Delivery Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Search */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileOutput className="h-5 w-5 text-success" />
                SAP Delivery Document
              </CardTitle>
              <CardDescription>Enter delivery number to fetch customer and dispatch details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="delivery-number">Delivery Number</Label>
                  <Input
                    id="delivery-number"
                    placeholder="e.g., 80001234"
                    value={deliveryNumber}
                    onChange={(e) => setDeliveryNumber(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleDeliverySearch} disabled={isLoading} variant="success">
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? "Fetching..." : "Fetch from SAP"}
                  </Button>
                </div>
              </div>

              {deliveryData && (
                <div className="mt-6 grid gap-4 sm:grid-cols-3 p-4 rounded-lg bg-success/5 border border-success/20 animate-fade-in">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Code</p>
                    <p className="font-mono font-semibold">{deliveryData.customerCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-semibold">{deliveryData.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Number</p>
                    <p className="font-mono font-semibold">{deliveryData.invoiceNumber}</p>
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
                Transport Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="vehicle-number">Vehicle Number *</Label>
                  <Input id="vehicle-number" placeholder="e.g., MH12EF4455" />
                </div>
                <div>
                  <Label htmlFor="driver-name">Driver Name *</Label>
                  <Input id="driver-name" placeholder="Enter driver name" />
                </div>
                <div>
                  <Label htmlFor="driver-license">Driver License</Label>
                  <Input id="driver-license" placeholder="Enter license number" />
                </div>
                <div>
                  <Label htmlFor="transporter">Transporter</Label>
                  <Input id="transporter" placeholder="Transport company name" />
                </div>
                <div>
                  <Label htmlFor="gate">Exit Gate *</Label>
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
                <div>
                  <Label htmlFor="seal-number">Seal Number</Label>
                  <Input id="seal-number" placeholder="Container seal number" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispatch Items */}
          {deliveryData && (
            <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-warning" />
                  Dispatch Items
                </CardTitle>
                <CardDescription>Materials to be dispatched</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveryData.items.map((item, index) => (
                        <TableRow key={item.materialCode} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <TableCell className="font-mono">{item.materialCode}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="font-mono text-sm">{item.batch || "-"}</TableCell>
                          <TableCell className="text-right font-mono">
                            {item.quantity} {item.uom}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-success/10 text-success border-success/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready
                            </Badge>
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

        {/* Right - Gate Pass & Actions */}
        <div className="space-y-6">
          {/* Gate Pass Preview */}
          <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <CardHeader className="bg-success/5 border-b border-success/20">
              <CardTitle className="flex items-center gap-2 text-success">
                <FileOutput className="h-5 w-5" />
                Dispatch Gate Pass
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gate Pass No</span>
                  <span className="font-mono font-bold text-lg">DGP-2025-XXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Number</span>
                  <span className="font-mono">{deliveryNumber || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{deliveryData?.customer || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice</span>
                  <span className="font-mono">{deliveryData?.invoiceNumber || "-"}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Out Time</span>
                  <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Authorized By</span>
                  <span className="font-medium">Logistics Dept</span>
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
              <Button className="w-full" variant="success" size="lg" onClick={handleDispatch}>
                <CheckCircle className="mr-2 h-5 w-5" />
                Create Dispatch Pass
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Pass
                </Button>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Notify Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
