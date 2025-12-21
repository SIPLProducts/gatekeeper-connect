import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Truck, Package, Scale, FileText, Printer, Send, Plus, LogOut, CheckCircle, Clock, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

interface POItem {
  materialCode: string;
  description: string;
  orderedQty: number;
  previouslyReceived: number;
  balanceQty: number;
  thisReceipt: number;
  uom: string;
}

interface GateEntry {
  entryNumber: string;
  poNumber: string;
  vendor: string;
  vehicleNumber: string;
  driverName: string;
  inTime: string;
  outTime: string | null;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  status: "in" | "processing" | "completed";
  items: POItem[];
}

const mockPOItems: POItem[] = [
  { materialCode: "RM-101", description: "HR Coil 2.5mm", orderedQty: 1000, previouslyReceived: 800, balanceQty: 200, thisReceipt: 0, uom: "KG" },
  { materialCode: "RM-205", description: "Zinc Ingots", orderedQty: 500, previouslyReceived: 300, balanceQty: 200, thisReceipt: 0, uom: "KG" },
  { materialCode: "RM-310", description: "Copper Wire 4mm", orderedQty: 200, previouslyReceived: 100, balanceQty: 100, thisReceipt: 0, uom: "KG" },
  { materialCode: "RM-415", description: "Steel Plates 10mm", orderedQty: 800, previouslyReceived: 500, balanceQty: 300, thisReceipt: 0, uom: "KG" },
];

const mockActiveEntries: GateEntry[] = [
  {
    entryNumber: "GE-2025-001",
    poNumber: "4500012456",
    vendor: "Tata Steel Ltd",
    vehicleNumber: "TS09AB1234",
    driverName: "Ramesh Kumar",
    inTime: "09:30:00",
    outTime: null,
    grossWeight: 15500,
    tareWeight: 0,
    netWeight: 0,
    status: "in",
    items: mockPOItems.slice(0, 2),
  },
  {
    entryNumber: "GE-2025-002",
    poNumber: "4500012789",
    vendor: "JSW Steel",
    vehicleNumber: "MH12CD5678",
    driverName: "Suresh Patil",
    inTime: "10:15:00",
    outTime: null,
    grossWeight: 22000,
    tareWeight: 8500,
    netWeight: 13500,
    status: "processing",
    items: mockPOItems.slice(2),
  },
];

export default function InboundEntry() {
  const [activeTab, setActiveTab] = useState("new");
  const [poNumber, setPONumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [poData, setPOData] = useState<{
    vendor: string;
    vendorCode: string;
    items: POItem[];
  } | null>(null);
  const [items, setItems] = useState<POItem[]>([]);
  const [grossWeight, setGrossWeight] = useState<number>(0);
  const [tareWeight, setTareWeight] = useState<number>(0);
  const [gateEntryNumber, setGateEntryNumber] = useState("GE-2025-XXX");
  const [vehicleIn, setVehicleIn] = useState(false);
  const [weighbridgeStep, setWeighbridgeStep] = useState<"pending" | "in" | "out">("pending");

  const handlePOSearch = () => {
    if (!poNumber) {
      toast.error("Please enter a PO Number");
      return;
    }
    setIsLoading(true);
    // Simulate SAP API call
    setTimeout(() => {
      const fetchedItems = mockPOItems.map(item => ({ ...item, thisReceipt: 0 }));
      setPOData({
        vendor: "Tata Steel Ltd",
        vendorCode: "V100234",
        items: fetchedItems,
      });
      setItems(fetchedItems);
      setIsLoading(false);
      toast.success("PO data fetched from SAP");
    }, 1000);
  };

  const handleReceiptQtyChange = (index: number, value: number) => {
    const newItems = [...items];
    const maxAllowed = newItems[index].balanceQty;
    newItems[index].thisReceipt = Math.min(value, maxAllowed);
    // Auto-calculate new balance
    newItems[index].balanceQty = (mockPOItems[index].orderedQty - mockPOItems[index].previouslyReceived) - newItems[index].thisReceipt;
    setItems(newItems);
  };

  const netWeight = grossWeight - tareWeight;

  const handleVehicleIn = () => {
    if (!poData) {
      toast.error("Please fetch PO data first");
      return;
    }
    const newEntryNumber = `GE-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setGateEntryNumber(newEntryNumber);
    setVehicleIn(true);
    setWeighbridgeStep("in");
    toast.success(`Gate Entry ${newEntryNumber} created - Vehicle IN recorded`);
  };

  const handleCaptureGrossWeight = () => {
    // Simulate weighbridge capture
    const simulatedGross = Math.floor(Math.random() * 10000) + 15000;
    setGrossWeight(simulatedGross);
    toast.success(`Gross Weight captured: ${simulatedGross} KG`);
  };

  const handleCaptureTareWeight = () => {
    // Simulate weighbridge capture
    const simulatedTare = Math.floor(Math.random() * 3000) + 6000;
    setTareWeight(simulatedTare);
    setWeighbridgeStep("out");
    toast.success(`Tare Weight captured: ${simulatedTare} KG`);
  };

  const handleVehicleExit = () => {
    if (tareWeight === 0) {
      toast.error("Please capture Tare Weight before vehicle exit");
      return;
    }
    toast.success(`Gate Entry ${gateEntryNumber} - Vehicle EXIT recorded. Net Weight: ${netWeight} KG`);
    // Reset form
    setPONumber("");
    setPOData(null);
    setItems([]);
    setGrossWeight(0);
    setTareWeight(0);
    setVehicleIn(false);
    setWeighbridgeStep("pending");
    setGateEntryNumber("GE-2025-XXX");
  };

  const handleCompleteEntry = (entry: GateEntry) => {
    toast.success(`Entry ${entry.entryNumber} marked as completed`);
  };

  return (
    <MainLayout title="Inbound Gate Entry" subtitle="PO-based material inward with weighbridge integration">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="new">New Entry</TabsTrigger>
            <TabsTrigger value="active">Active Entries</TabsTrigger>
            <TabsTrigger value="exit">Vehicle Exit</TabsTrigger>
          </TabsList>
        </div>

        {/* New Entry Tab */}
        <TabsContent value="new" className="animate-fade-in">
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
                        disabled={vehicleIn}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handlePOSearch} disabled={isLoading || vehicleIn}>
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
                      <Input id="vehicle-number" placeholder="e.g., TS09AB1234" disabled={vehicleIn} />
                    </div>
                    <div>
                      <Label htmlFor="driver-name">Driver Name *</Label>
                      <Input id="driver-name" placeholder="Enter driver name" disabled={vehicleIn} />
                    </div>
                    <div>
                      <Label htmlFor="driver-mobile">Driver Mobile</Label>
                      <Input id="driver-mobile" placeholder="Enter mobile number" disabled={vehicleIn} />
                    </div>
                    <div>
                      <Label htmlFor="lr-number">LR Number</Label>
                      <Input id="lr-number" placeholder="e.g., LR-88901" disabled={vehicleIn} />
                    </div>
                    <div>
                      <Label htmlFor="invoice-number">Invoice Number</Label>
                      <Input id="invoice-number" placeholder="e.g., INV-4589" disabled={vehicleIn} />
                    </div>
                    <div>
                      <Label htmlFor="gate">Gate *</Label>
                      <Select disabled={vehicleIn}>
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

              {/* Material Items with auto-calculated balance */}
              {poData && (
                <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-success" />
                      Material Line Items
                    </CardTitle>
                    <CardDescription>Enter received quantities - Balance auto-calculated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Ordered Qty</TableHead>
                            <TableHead className="text-right">Previously Received</TableHead>
                            <TableHead className="text-right">Balance Qty</TableHead>
                            <TableHead className="text-right">This Receipt</TableHead>
                            <TableHead className="text-right">New Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => {
                            const originalBalance = mockPOItems[index].orderedQty - mockPOItems[index].previouslyReceived;
                            const newBalance = originalBalance - item.thisReceipt;
                            return (
                              <TableRow key={item.materialCode} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <TableCell className="font-mono">{item.materialCode}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right font-mono">{item.orderedQty} {item.uom}</TableCell>
                                <TableCell className="text-right font-mono">{item.previouslyReceived} {item.uom}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant="secondary" className="font-mono">
                                    {originalBalance} {item.uom}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Input
                                    type="number"
                                    className="w-24 text-right font-mono"
                                    placeholder="0"
                                    value={item.thisReceipt || ""}
                                    onChange={(e) => handleReceiptQtyChange(index, Number(e.target.value))}
                                    max={originalBalance}
                                    disabled={!vehicleIn}
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={newBalance === 0 ? "default" : "outline"} className={`font-mono ${newBalance === 0 ? "bg-success text-success-foreground" : ""}`}>
                                    {newBalance} {item.uom}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total This Receipt</p>
                        <p className="text-xl font-bold font-mono text-primary">
                          {items.reduce((sum, item) => sum + item.thisReceipt, 0)} KG
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right - Weighbridge & Actions */}
            <div className="space-y-6">
              {/* Gate Entry Info */}
              <Card className={`animate-slide-up ${vehicleIn ? "border-success/50 bg-success/5" : ""}`}>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Entry Number</span>
                      <span className="font-mono font-bold text-lg">{gateEntryNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={vehicleIn ? "default" : "secondary"} className={vehicleIn ? "bg-success" : ""}>
                        {vehicleIn ? "Vehicle IN" : "Pending Entry"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">In Time</span>
                      <span className="font-mono font-medium">{vehicleIn ? new Date().toLocaleTimeString() : "--:--:--"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Officer</span>
                      <span className="font-medium">Rajesh Kumar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weighbridge Integration */}
              <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-warning" />
                    Weighbridge Integration
                  </CardTitle>
                  <CardDescription>Capture IN and OUT weights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Weighbridge Step Indicator */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className={`flex items-center gap-2 ${weighbridgeStep === "in" ? "text-warning" : weighbridgeStep === "out" ? "text-success" : "text-muted-foreground"}`}>
                      <ArrowDownCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">IN Weight</span>
                    </div>
                    <div className="h-px flex-1 mx-4 bg-border" />
                    <div className={`flex items-center gap-2 ${weighbridgeStep === "out" ? "text-warning" : "text-muted-foreground"}`}>
                      <ArrowUpCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">OUT Weight</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label>Gross Weight (IN) - KG</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={grossWeight || ""} 
                          onChange={(e) => setGrossWeight(Number(e.target.value))}
                          placeholder="Auto-capture" 
                          className="font-mono text-xl font-bold" 
                          disabled={!vehicleIn}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleCaptureGrossWeight}
                          disabled={!vehicleIn || grossWeight > 0}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Tare Weight (OUT) - KG</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={tareWeight || ""} 
                          onChange={(e) => setTareWeight(Number(e.target.value))}
                          placeholder="After unload" 
                          className="font-mono text-xl font-bold" 
                          disabled={grossWeight === 0}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleCaptureTareWeight}
                          disabled={grossWeight === 0 || tareWeight > 0}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-success/10 p-4">
                      <p className="text-sm text-muted-foreground">Net Weight</p>
                      <p className="text-2xl font-bold text-success font-mono">{netWeight > 0 ? netWeight : 0} KG</p>
                    </div>
                    {netWeight > 0 && (
                      <div className="rounded-lg bg-info/10 p-4 animate-fade-in">
                        <p className="text-sm text-muted-foreground">Variance Check</p>
                        <p className="text-lg font-semibold text-info">
                          {Math.abs(netWeight - items.reduce((sum, item) => sum + item.thisReceipt, 0)) < 50 
                            ? "✓ Within tolerance" 
                            : "⚠ Variance detected"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="animate-slide-up" style={{ animationDelay: "250ms" }}>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!vehicleIn ? (
                    <Button className="w-full" variant="hero" size="lg" onClick={handleVehicleIn} disabled={!poData}>
                      <Plus className="mr-2 h-5 w-5" />
                      Vehicle IN - Create Entry
                    </Button>
                  ) : (
                    <Button className="w-full" variant="success" size="lg" onClick={handleVehicleExit} disabled={tareWeight === 0}>
                      <LogOut className="mr-2 h-5 w-5" />
                      Vehicle EXIT - Complete
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" disabled={!vehicleIn}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Slip
                    </Button>
                    <Button variant="outline" disabled={!vehicleIn}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Active Entries Tab */}
        <TabsContent value="active" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-info" />
                Active Inbound Entries
              </CardTitle>
              <CardDescription>Vehicles currently inside the premises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entry Number</TableHead>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>In Time</TableHead>
                      <TableHead>Gross Wt</TableHead>
                      <TableHead>Tare Wt</TableHead>
                      <TableHead>Net Wt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActiveEntries.map((entry, index) => (
                      <TableRow key={entry.entryNumber} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono font-bold">{entry.entryNumber}</TableCell>
                        <TableCell className="font-mono">{entry.poNumber}</TableCell>
                        <TableCell>{entry.vendor}</TableCell>
                        <TableCell className="font-mono">{entry.vehicleNumber}</TableCell>
                        <TableCell className="font-mono">{entry.inTime}</TableCell>
                        <TableCell className="font-mono">{entry.grossWeight} KG</TableCell>
                        <TableCell className="font-mono">{entry.tareWeight > 0 ? `${entry.tareWeight} KG` : "-"}</TableCell>
                        <TableCell className="font-mono font-bold">{entry.netWeight > 0 ? `${entry.netWeight} KG` : "-"}</TableCell>
                        <TableCell>
                          <Badge variant={entry.status === "in" ? "secondary" : entry.status === "processing" ? "default" : "outline"} 
                            className={entry.status === "processing" ? "bg-warning text-warning-foreground" : ""}>
                            {entry.status === "in" ? "Vehicle IN" : entry.status === "processing" ? "Processing" : "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleCompleteEntry(entry)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Exit Tab */}
        <TabsContent value="exit" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-success" />
                Vehicle Exit - Same Gate Entry
              </CardTitle>
              <CardDescription>Search by Gate Entry Number to process vehicle exit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-xl space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Gate Entry Number</Label>
                    <Input placeholder="e.g., GE-2025-001" className="font-mono" />
                  </div>
                  <div className="flex items-end">
                    <Button>
                      <Search className="mr-2 h-4 w-4" />
                      Search Entry
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Enter a Gate Entry Number to load vehicle details and process exit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
