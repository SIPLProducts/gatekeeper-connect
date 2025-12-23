import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CameraCapture } from "@/components/CameraCapture";
import { 
  Search, Truck, Package, Scale, FileText, Printer, Send, Plus, LogOut, CheckCircle, 
  Clock, ArrowDownCircle, ArrowUpCircle, Building2, User, Calendar, Hash, 
  CircleCheck, CircleX, AlertCircle, RefreshCw, Eye, Edit, Trash2, 
  Upload, Image, File, X, Camera, MapPin, CreditCard, Receipt
} from "lucide-react";
import { toast } from "sonner";

// ==================== INTERFACES ====================
interface POLineItem {
  itemNo: number;
  materialCode: string;
  materialDescription: string;
  materialGroup: string;
  batchNumber: string;
  poQuantity: number;
  openQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  balanceQuantity: number;
  uom: string;
  inspectionRequired: boolean;
  grRequired: boolean;
  storageLocation: string;
  serialNumber: string;
  lineStatus: "Pending" | "Inwarded" | "Short" | "Excess";
  sapPOItemNumber: string;
}

interface POHeader {
  poNumber: string;
  poDate: string;
  vendorCode: string;
  vendorName: string;
  poValue: number;
  currency: string;
  plant: string;
}

interface InwardEntry {
  inwardNumber: string;
  inwardDateTime: string;
  gateNumber: string;
  entryType: string;
  securityUser: string;
  poHeader: POHeader | null;
  vehicleNumber: string;
  vehicleType: string;
  transporterName: string;
  driverName: string;
  driverMobile: string;
  lrNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  ewayBillNumber: string;
  storageLocation: string;
  unloadingPoint: string;
  vehicleEntryTime: string;
  vehicleExitTime: string;
  gatePassNumber: string;
  securityRemarks: string;
  status: "Draft" | "Inwarded" | "GR Posted" | "Cancelled";
  sapSyncStatus: "Pending" | "Success" | "Error";
  lineItems: POLineItem[];
  attachments: Attachment[];
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
}

interface Attachment {
  id: string;
  name: string;
  type: "Invoice" | "LR" | "Challan" | "Vehicle";
  url: string;
}

// ==================== MOCK DATA ====================
const mockPOHeader: POHeader = {
  poNumber: "4500012456",
  poDate: "2024-12-20",
  vendorCode: "V100234",
  vendorName: "Tata Steel Limited",
  poValue: 2500000,
  currency: "INR",
  plant: "1000 - Hyderabad"
};

const mockPOLineItems: POLineItem[] = [
  { 
    itemNo: 10, materialCode: "RM-101", materialDescription: "HR Coil 2.5mm x 1250mm", 
    materialGroup: "Raw Material", batchNumber: "BATCH-001", poQuantity: 10000, 
    openQuantity: 2000, receivedQuantity: 0, rejectedQuantity: 0, balanceQuantity: 2000, 
    uom: "KG", inspectionRequired: true, grRequired: true, storageLocation: "SL01",
    serialNumber: "", lineStatus: "Pending", sapPOItemNumber: "0010"
  },
  { 
    itemNo: 20, materialCode: "RM-205", materialDescription: "Zinc Ingots Grade-A", 
    materialGroup: "Raw Material", batchNumber: "BATCH-002", poQuantity: 5000, 
    openQuantity: 1500, receivedQuantity: 0, rejectedQuantity: 0, balanceQuantity: 1500, 
    uom: "KG", inspectionRequired: true, grRequired: true, storageLocation: "SL02",
    serialNumber: "", lineStatus: "Pending", sapPOItemNumber: "0020"
  },
  { 
    itemNo: 30, materialCode: "RM-310", materialDescription: "Copper Wire 4mm Diameter", 
    materialGroup: "Consumable", batchNumber: "", poQuantity: 2000, 
    openQuantity: 800, receivedQuantity: 0, rejectedQuantity: 0, balanceQuantity: 800, 
    uom: "KG", inspectionRequired: false, grRequired: true, storageLocation: "SL03",
    serialNumber: "", lineStatus: "Pending", sapPOItemNumber: "0030"
  },
  { 
    itemNo: 40, materialCode: "RM-415", materialDescription: "Steel Plates 10mm MS", 
    materialGroup: "Raw Material", batchNumber: "BATCH-003", poQuantity: 8000, 
    openQuantity: 3000, receivedQuantity: 0, rejectedQuantity: 0, balanceQuantity: 3000, 
    uom: "KG", inspectionRequired: true, grRequired: true, storageLocation: "SL01",
    serialNumber: "", lineStatus: "Pending", sapPOItemNumber: "0040"
  },
];

const mockActiveEntries: InwardEntry[] = [
  {
    inwardNumber: "INW-2024-0001",
    inwardDateTime: "2024-12-23 09:30:00",
    gateNumber: "Gate-1",
    entryType: "Inbound - PO",
    securityUser: "Rajesh Kumar",
    poHeader: mockPOHeader,
    vehicleNumber: "TS09AB1234",
    vehicleType: "Truck",
    transporterName: "Blue Dart Logistics",
    driverName: "Ramesh Kumar",
    driverMobile: "9876543210",
    lrNumber: "LR-2024-88901",
    invoiceNumber: "INV-TTS-45890",
    invoiceDate: "2024-12-22",
    ewayBillNumber: "EWB123456789012",
    storageLocation: "SL01",
    unloadingPoint: "Bay-3",
    vehicleEntryTime: "09:30:00",
    vehicleExitTime: "",
    gatePassNumber: "GP-001",
    securityRemarks: "",
    status: "Inwarded",
    sapSyncStatus: "Pending",
    lineItems: mockPOLineItems.slice(0, 2),
    attachments: [],
    grossWeight: 15500,
    tareWeight: 0,
    netWeight: 0
  }
];

const generateInwardNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `INW-${year}-${random}`;
};

// ==================== COMPONENT ====================
export default function InboundEntry() {
  const [activeTab, setActiveTab] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentAttachmentType, setCurrentAttachmentType] = useState<"Invoice" | "LR" | "Challan" | "Vehicle">("Vehicle");
  
  // Form State
  const [entry, setEntry] = useState<InwardEntry>({
    inwardNumber: generateInwardNumber(),
    inwardDateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    gateNumber: "",
    entryType: "Inbound - PO",
    securityUser: "Current User",
    poHeader: null,
    vehicleNumber: "",
    vehicleType: "",
    transporterName: "",
    driverName: "",
    driverMobile: "",
    lrNumber: "",
    invoiceNumber: "",
    invoiceDate: "",
    ewayBillNumber: "",
    storageLocation: "",
    unloadingPoint: "",
    vehicleEntryTime: "",
    vehicleExitTime: "",
    gatePassNumber: "",
    securityRemarks: "",
    status: "Draft",
    sapSyncStatus: "Pending",
    lineItems: [],
    attachments: [],
    grossWeight: 0,
    tareWeight: 0,
    netWeight: 0
  });

  const [poSearchValue, setPoSearchValue] = useState("");
  const [weighbridgeStep, setWeighbridgeStep] = useState<"pending" | "in" | "out">("pending");

  // ==================== HANDLERS ====================
  const handlePOSearch = () => {
    if (!poSearchValue.trim()) {
      toast.error("Please enter a PO Number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setEntry(prev => ({
        ...prev,
        poHeader: mockPOHeader,
        lineItems: mockPOLineItems.map(item => ({ ...item, receivedQuantity: 0, rejectedQuantity: 0 })),
        storageLocation: "SL01"
      }));
      setIsLoading(false);
      toast.success("PO data fetched successfully from SAP");
    }, 1000);
  };

  const handleReceivedQtyChange = (index: number, value: number) => {
    const newItems = [...entry.lineItems];
    const maxAllowed = newItems[index].openQuantity;
    newItems[index].receivedQuantity = Math.min(Math.max(0, value), maxAllowed * 1.1); // 10% tolerance
    newItems[index].balanceQuantity = newItems[index].openQuantity - newItems[index].receivedQuantity;
    
    // Auto-calculate line status
    if (newItems[index].receivedQuantity === 0) {
      newItems[index].lineStatus = "Pending";
    } else if (newItems[index].receivedQuantity < newItems[index].openQuantity) {
      newItems[index].lineStatus = "Short";
    } else if (newItems[index].receivedQuantity > newItems[index].openQuantity) {
      newItems[index].lineStatus = "Excess";
    } else {
      newItems[index].lineStatus = "Inwarded";
    }
    
    setEntry(prev => ({ ...prev, lineItems: newItems }));
  };

  const handleRejectedQtyChange = (index: number, value: number) => {
    const newItems = [...entry.lineItems];
    newItems[index].rejectedQuantity = Math.max(0, value);
    setEntry(prev => ({ ...prev, lineItems: newItems }));
  };

  const handleCaptureGrossWeight = () => {
    const simulatedGross = Math.floor(Math.random() * 10000) + 15000;
    setEntry(prev => ({ 
      ...prev, 
      grossWeight: simulatedGross,
      vehicleEntryTime: new Date().toLocaleTimeString()
    }));
    setWeighbridgeStep("in");
    toast.success(`Gross Weight captured: ${simulatedGross.toLocaleString()} KG`);
  };

  const handleCaptureTareWeight = () => {
    const simulatedTare = Math.floor(Math.random() * 3000) + 6000;
    const netWeight = entry.grossWeight - simulatedTare;
    setEntry(prev => ({ 
      ...prev, 
      tareWeight: simulatedTare,
      netWeight: netWeight
    }));
    setWeighbridgeStep("out");
    toast.success(`Tare Weight captured: ${simulatedTare.toLocaleString()} KG`);
  };

  const handleSaveAsDraft = () => {
    if (!entry.poHeader) {
      toast.error("Please fetch PO data first");
      return;
    }
    if (!entry.vehicleNumber.trim()) {
      toast.error("Vehicle Number is mandatory");
      return;
    }
    setEntry(prev => ({ ...prev, status: "Draft" }));
    toast.success("Inward entry saved as Draft");
  };

  const handleSubmitInward = () => {
    if (!entry.poHeader) {
      toast.error("Please fetch PO data first");
      return;
    }
    if (!entry.vehicleNumber.trim()) {
      toast.error("Vehicle Number is mandatory");
      return;
    }
    if (!entry.lineItems.some(item => item.receivedQuantity > 0)) {
      toast.error("At least one line item with received quantity is required");
      return;
    }
    setEntry(prev => ({ 
      ...prev, 
      status: "Inwarded",
      vehicleEntryTime: prev.vehicleEntryTime || new Date().toLocaleTimeString()
    }));
    toast.success(`Inward ${entry.inwardNumber} submitted successfully`);
  };

  const handlePostGR = () => {
    if (entry.status !== "Inwarded") {
      toast.error("Only Inwarded entries can be posted to SAP");
      return;
    }
    setEntry(prev => ({ ...prev, status: "GR Posted", sapSyncStatus: "Success" }));
    toast.success("Goods Receipt posted to SAP successfully");
  };

  const handleCancelEntry = () => {
    if (entry.status === "GR Posted") {
      toast.error("Cannot cancel entry after SAP GR posting");
      return;
    }
    setEntry(prev => ({ ...prev, status: "Cancelled" }));
    toast.warning("Inward entry cancelled");
  };

  const handleVehicleExit = () => {
    if (entry.tareWeight === 0) {
      toast.error("Please capture Tare Weight before vehicle exit");
      return;
    }
    setEntry(prev => ({ 
      ...prev, 
      vehicleExitTime: new Date().toLocaleTimeString()
    }));
    toast.success(`Vehicle EXIT recorded. Net Weight: ${entry.netWeight.toLocaleString()} KG`);
  };

  const handleCameraCapture = (imageData: string) => {
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: `${currentAttachmentType}-${Date.now()}.jpg`,
      type: currentAttachmentType,
      url: imageData
    };
    setEntry(prev => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment]
    }));
    setShowCamera(false);
    toast.success(`${currentAttachmentType} image captured`);
  };

  const handleRemoveAttachment = (id: string) => {
    setEntry(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
    toast.info("Attachment removed");
  };

  const openCameraForType = (type: "Invoice" | "LR" | "Challan" | "Vehicle") => {
    setCurrentAttachmentType(type);
    setShowCamera(true);
  };

  // Calculations
  const totalReceivedQty = entry.lineItems.reduce((sum, item) => sum + item.receivedQuantity, 0);
  const totalRejectedQty = entry.lineItems.reduce((sum, item) => sum + item.rejectedQuantity, 0);
  const totalLineItems = entry.lineItems.length;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Draft": return "secondary";
      case "Inwarded": return "default";
      case "GR Posted": return "outline";
      case "Cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "Success": return <CircleCheck className="h-4 w-4 text-success" />;
      case "Error": return <CircleX className="h-4 w-4 text-destructive" />;
      default: return <RefreshCw className="h-4 w-4 text-warning animate-spin" />;
    }
  };

  const getLineStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return <Badge variant="secondary">Pending</Badge>;
      case "Inwarded": return <Badge className="bg-success text-success-foreground">Inwarded</Badge>;
      case "Short": return <Badge variant="destructive">Short</Badge>;
      case "Excess": return <Badge className="bg-warning text-warning-foreground">Excess</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isEditable = entry.status === "Draft" || entry.status === "Inwarded";

  return (
    <MainLayout title="Inwards - Gate Entry (PO Based)" subtitle="Transaction Screen | SAP MM Integration">
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Capture {currentAttachmentType} Image</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCamera(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <CameraCapture onCapture={handleCameraCapture} />
            </div>
          </div>
        </div>
      )}

      {/* ==================== HEADER SUMMARY BAR ==================== */}
      <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-6 px-6 py-4 bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Inward Number</p>
              <p className="text-lg font-bold font-mono text-primary">{entry.inwardNumber}</p>
            </div>
            <Separator orientation="vertical" className="h-10 hidden sm:block" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">PO Number</p>
              <p className="font-semibold font-mono">{entry.poHeader?.poNumber || "—"}</p>
            </div>
            <Separator orientation="vertical" className="h-10 hidden sm:block" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Vendor</p>
              <p className="font-medium truncate max-w-[200px]">{entry.poHeader?.vendorName || "—"}</p>
            </div>
            <Separator orientation="vertical" className="h-10 hidden sm:block" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicle</p>
              <p className="font-mono font-medium">{entry.vehicleNumber || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <Badge variant={getStatusBadgeVariant(entry.status)} className="mt-1">
                {entry.status}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">SAP Sync</p>
              <div className="flex items-center gap-1.5 mt-1">
                {getSyncStatusIcon(entry.sapSyncStatus)}
                <span className="text-sm font-medium">{entry.sapSyncStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MAIN TABS ==================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="create">Create / Edit</TabsTrigger>
            <TabsTrigger value="active">Active Entries</TabsTrigger>
            <TabsTrigger value="view">View History</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              setEntry({
                ...entry,
                inwardNumber: generateInwardNumber(),
                inwardDateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                poHeader: null,
                lineItems: [],
                status: "Draft",
                sapSyncStatus: "Pending",
                vehicleNumber: "",
                grossWeight: 0,
                tareWeight: 0,
                netWeight: 0
              });
              setPoSearchValue("");
              setWeighbridgeStep("pending");
            }}>
              <Plus className="h-4 w-4 mr-1" />
              New Entry
            </Button>
          </div>
        </div>

        {/* ==================== CREATE/EDIT TAB ==================== */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Left Column - Main Form */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Section 1: Inward Identification */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Hash className="h-4 w-4 text-primary" />
                    Section 1: Inward Identification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Inward Number</Label>
                      <Input value={entry.inwardNumber} readOnly className="font-mono bg-muted/50" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Inward Date & Time</Label>
                      <Input value={entry.inwardDateTime} readOnly className="bg-muted/50" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Gate Number *</Label>
                      <Select value={entry.gateNumber} onValueChange={(v) => setEntry(prev => ({...prev, gateNumber: v}))} disabled={!isEditable}>
                        <SelectTrigger><SelectValue placeholder="Select Gate" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gate-1">Gate-1 (Main)</SelectItem>
                          <SelectItem value="Gate-2">Gate-2 (East)</SelectItem>
                          <SelectItem value="Gate-3">Gate-3 (Dispatch)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Security User</Label>
                      <Input value={entry.securityUser} readOnly className="bg-muted/50" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Purchase Order Reference */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-info" />
                    Section 2: Purchase Order Reference (SAP EKKO)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">PO Number *</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter PO Number (e.g., 4500012456)" 
                          value={poSearchValue}
                          onChange={(e) => setPoSearchValue(e.target.value)}
                          className="font-mono"
                          disabled={!!entry.poHeader || !isEditable}
                        />
                        <Button onClick={handlePOSearch} disabled={isLoading || !!entry.poHeader || !isEditable}>
                          <Search className="h-4 w-4 mr-1" />
                          {isLoading ? "Fetching..." : "Fetch"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {entry.poHeader && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4 rounded-lg bg-muted/30 border border-border">
                      <div>
                        <Label className="text-xs text-muted-foreground">PO Date</Label>
                        <p className="font-medium">{entry.poHeader.poDate}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Vendor Code</Label>
                        <p className="font-mono font-medium">{entry.poHeader.vendorCode}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Vendor Name</Label>
                        <p className="font-medium">{entry.poHeader.vendorName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">PO Value</Label>
                        <p className="font-mono font-semibold text-primary">
                          {entry.poHeader.currency} {entry.poHeader.poValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Currency</Label>
                        <p className="font-medium">{entry.poHeader.currency}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Plant</Label>
                        <p className="font-medium">{entry.poHeader.plant}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section 3: Vehicle & Logistics Details */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="h-4 w-4 text-warning" />
                    Section 3: Vehicle & Logistics Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Vehicle Number *</Label>
                      <Input 
                        placeholder="e.g., TS09AB1234" 
                        value={entry.vehicleNumber}
                        onChange={(e) => setEntry(prev => ({...prev, vehicleNumber: e.target.value.toUpperCase()}))}
                        className="font-mono uppercase"
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Vehicle Type *</Label>
                      <Select value={entry.vehicleType} onValueChange={(v) => setEntry(prev => ({...prev, vehicleType: v}))} disabled={!isEditable}>
                        <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Container">Container</SelectItem>
                          <SelectItem value="Tempo">Tempo</SelectItem>
                          <SelectItem value="Trailer">Trailer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Transporter Name</Label>
                      <Input 
                        placeholder="Enter transporter" 
                        value={entry.transporterName}
                        onChange={(e) => setEntry(prev => ({...prev, transporterName: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Driver Name *</Label>
                      <Input 
                        placeholder="Enter driver name" 
                        value={entry.driverName}
                        onChange={(e) => setEntry(prev => ({...prev, driverName: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Driver Mobile</Label>
                      <Input 
                        placeholder="Enter mobile number" 
                        value={entry.driverMobile}
                        onChange={(e) => setEntry(prev => ({...prev, driverMobile: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">LR Number</Label>
                      <Input 
                        placeholder="e.g., LR-88901" 
                        value={entry.lrNumber}
                        onChange={(e) => setEntry(prev => ({...prev, lrNumber: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                      <Input 
                        placeholder="e.g., INV-4589" 
                        value={entry.invoiceNumber}
                        onChange={(e) => setEntry(prev => ({...prev, invoiceNumber: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Invoice Date</Label>
                      <Input 
                        type="date"
                        value={entry.invoiceDate}
                        onChange={(e) => setEntry(prev => ({...prev, invoiceDate: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">E-Way Bill Number</Label>
                      <Input 
                        placeholder="Optional" 
                        value={entry.ewayBillNumber}
                        onChange={(e) => setEntry(prev => ({...prev, ewayBillNumber: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 4: Plant & Storage */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-4 w-4 text-accent" />
                    Section 4: Plant & Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Plant</Label>
                      <Input value={entry.poHeader?.plant || "—"} readOnly className="bg-muted/50" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Storage Location (SAP LOV)</Label>
                      <Select value={entry.storageLocation} onValueChange={(v) => setEntry(prev => ({...prev, storageLocation: v}))} disabled={!isEditable}>
                        <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SL01">SL01 - Main Warehouse</SelectItem>
                          <SelectItem value="SL02">SL02 - Raw Material Store</SelectItem>
                          <SelectItem value="SL03">SL03 - Finished Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Unloading Point</Label>
                      <Input 
                        placeholder="e.g., Bay-3" 
                        value={entry.unloadingPoint}
                        onChange={(e) => setEntry(prev => ({...prev, unloadingPoint: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Line Items Section */}
              {entry.poHeader && (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4 text-success" />
                        Line Items (PO Based - Tabular Grid)
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Total Items: <strong>{totalLineItems}</strong></span>
                        <span className="text-muted-foreground">Received: <strong className="text-success">{totalReceivedQty.toLocaleString()} KG</strong></span>
                        <span className="text-muted-foreground">Rejected: <strong className="text-destructive">{totalRejectedQty.toLocaleString()} KG</strong></span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="w-full">
                      <div className="min-w-[1200px]">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="w-[60px]">Item</TableHead>
                              <TableHead className="w-[100px]">Material Code</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[100px]">Mat. Group</TableHead>
                              <TableHead className="w-[100px]">Batch No.</TableHead>
                              <TableHead className="text-right w-[90px]">PO Qty</TableHead>
                              <TableHead className="text-right w-[90px]">Open Qty</TableHead>
                              <TableHead className="text-right w-[100px]">Received *</TableHead>
                              <TableHead className="text-right w-[90px]">Rejected</TableHead>
                              <TableHead className="text-right w-[90px]">Balance</TableHead>
                              <TableHead className="w-[50px]">UOM</TableHead>
                              <TableHead className="w-[60px] text-center">Insp.</TableHead>
                              <TableHead className="w-[60px] text-center">GR</TableHead>
                              <TableHead className="w-[80px]">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entry.lineItems.map((item, index) => (
                              <TableRow key={item.itemNo} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs">{item.sapPOItemNumber}</TableCell>
                                <TableCell className="font-mono text-sm font-medium">{item.materialCode}</TableCell>
                                <TableCell className="text-sm max-w-[200px] truncate" title={item.materialDescription}>
                                  {item.materialDescription}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{item.materialGroup}</TableCell>
                                <TableCell className="font-mono text-xs">{item.batchNumber || "—"}</TableCell>
                                <TableCell className="text-right font-mono">{item.poQuantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-mono font-medium">{item.openQuantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  <Input 
                                    type="number"
                                    className="w-20 text-right font-mono h-8"
                                    value={item.receivedQuantity || ""}
                                    onChange={(e) => handleReceivedQtyChange(index, Number(e.target.value))}
                                    disabled={!isEditable}
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <Input 
                                    type="number"
                                    className="w-16 text-right font-mono h-8"
                                    value={item.rejectedQuantity || ""}
                                    onChange={(e) => handleRejectedQtyChange(index, Number(e.target.value))}
                                    disabled={!isEditable}
                                  />
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  <span className={item.balanceQuantity < 0 ? "text-destructive" : ""}>
                                    {item.balanceQuantity.toLocaleString()}
                                  </span>
                                </TableCell>
                                <TableCell className="text-xs">{item.uom}</TableCell>
                                <TableCell className="text-center">
                                  {item.inspectionRequired ? 
                                    <CheckCircle className="h-4 w-4 text-warning mx-auto" /> : 
                                    <span className="text-muted-foreground">—</span>
                                  }
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.grRequired ? 
                                    <CheckCircle className="h-4 w-4 text-success mx-auto" /> : 
                                    <span className="text-muted-foreground">—</span>
                                  }
                                </TableCell>
                                <TableCell>{getLineStatusBadge(item.lineStatus)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Attachments Section */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Upload className="h-4 w-4 text-info" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(["Invoice", "LR", "Challan", "Vehicle"] as const).map((type) => (
                      <div key={type} className="border border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          {type === "Vehicle" ? <Camera className="h-8 w-8 text-muted-foreground" /> : <File className="h-8 w-8 text-muted-foreground" />}
                          <p className="text-sm font-medium">{type} Copy</p>
                          <Button variant="outline" size="sm" onClick={() => openCameraForType(type)} disabled={!isEditable}>
                            <Camera className="h-3 w-3 mr-1" />
                            Capture
                          </Button>
                        </div>
                        {entry.attachments.filter(a => a.type === type).map(att => (
                          <div key={att.id} className="mt-2 relative">
                            <img src={att.url} alt={att.name} className="w-full h-20 object-cover rounded" />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute -top-2 -right-2 h-5 w-5"
                              onClick={() => handleRemoveAttachment(att.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gate Entry Control & Remarks */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4 text-primary" />
                    Gate Entry Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Vehicle Entry Time</Label>
                      <Input value={entry.vehicleEntryTime || "—"} readOnly className="bg-muted/50 font-mono" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Vehicle Exit Time</Label>
                      <Input value={entry.vehicleExitTime || "—"} readOnly className="bg-muted/50 font-mono" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Gate Pass Number</Label>
                      <Input 
                        placeholder="Optional" 
                        value={entry.gatePassNumber}
                        onChange={(e) => setEntry(prev => ({...prev, gatePassNumber: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Label className="text-xs text-muted-foreground">Security Remarks</Label>
                      <Textarea 
                        placeholder="Enter remarks..."
                        value={entry.securityRemarks}
                        onChange={(e) => setEntry(prev => ({...prev, securityRemarks: e.target.value}))}
                        className="h-10 resize-none"
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Weighbridge & Actions */}
            <div className="space-y-6">
              {/* Weighbridge Integration */}
              <Card className="sticky top-32">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Scale className="h-4 w-4 text-warning" />
                    Weighbridge Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Step Indicator */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className={`flex items-center gap-2 ${weighbridgeStep === "in" || weighbridgeStep === "out" ? "text-success" : "text-muted-foreground"}`}>
                      <ArrowDownCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">IN</span>
                    </div>
                    <div className="h-px flex-1 mx-3 bg-border" />
                    <div className={`flex items-center gap-2 ${weighbridgeStep === "out" ? "text-success" : "text-muted-foreground"}`}>
                      <ArrowUpCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">OUT</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Gross Weight (IN) - KG</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={entry.grossWeight || ""} 
                          onChange={(e) => setEntry(prev => ({...prev, grossWeight: Number(e.target.value)}))}
                          placeholder="Auto-capture" 
                          className="font-mono text-lg font-bold" 
                          disabled={!entry.poHeader || entry.grossWeight > 0}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleCaptureGrossWeight}
                          disabled={!entry.poHeader || entry.grossWeight > 0}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Tare Weight (OUT) - KG</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={entry.tareWeight || ""} 
                          onChange={(e) => setEntry(prev => ({...prev, tareWeight: Number(e.target.value)}))}
                          placeholder="After unload" 
                          className="font-mono text-lg font-bold" 
                          disabled={entry.grossWeight === 0 || entry.tareWeight > 0}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleCaptureTareWeight}
                          disabled={entry.grossWeight === 0 || entry.tareWeight > 0}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-success/10 p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Weight</p>
                      <p className="text-2xl font-bold text-success font-mono">
                        {entry.netWeight > 0 ? entry.netWeight.toLocaleString() : "0"} KG
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.status === "Draft" && (
                    <>
                      <Button className="w-full" variant="outline" onClick={handleSaveAsDraft}>
                        <FileText className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button className="w-full" onClick={handleSubmitInward}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Inward
                      </Button>
                    </>
                  )}
                  {entry.status === "Inwarded" && (
                    <>
                      <Button className="w-full bg-success hover:bg-success/90" onClick={handlePostGR}>
                        <Send className="h-4 w-4 mr-2" />
                        Post GR to SAP
                      </Button>
                      {entry.tareWeight > 0 && !entry.vehicleExitTime && (
                        <Button className="w-full" variant="secondary" onClick={handleVehicleExit}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Record Vehicle Exit
                        </Button>
                      )}
                    </>
                  )}
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled={entry.status === "Draft"}>
                      <Printer className="h-3 w-3 mr-1" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" disabled={entry.status === "Draft"}>
                      <Send className="h-3 w-3 mr-1" />
                      Alert
                    </Button>
                  </div>
                  {isEditable && entry.status !== "GR Posted" && (
                    <Button variant="destructive" className="w-full" size="sm" onClick={handleCancelEntry}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Cancel Entry
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==================== ACTIVE ENTRIES TAB ==================== */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-info" />
                Active Inbound Entries
              </CardTitle>
              <CardDescription>Vehicles currently inside the premises awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inward No.</TableHead>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Entry Time</TableHead>
                      <TableHead className="text-right">Gross Wt</TableHead>
                      <TableHead className="text-right">Tare Wt</TableHead>
                      <TableHead className="text-right">Net Wt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>SAP Sync</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActiveEntries.map((ent) => (
                      <TableRow key={ent.inwardNumber}>
                        <TableCell className="font-mono font-bold">{ent.inwardNumber}</TableCell>
                        <TableCell className="font-mono">{ent.poHeader?.poNumber}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{ent.poHeader?.vendorName}</TableCell>
                        <TableCell className="font-mono">{ent.vehicleNumber}</TableCell>
                        <TableCell className="font-mono">{ent.vehicleEntryTime}</TableCell>
                        <TableCell className="text-right font-mono">{ent.grossWeight.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">{ent.tareWeight > 0 ? ent.tareWeight.toLocaleString() : "—"}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{ent.netWeight > 0 ? ent.netWeight.toLocaleString() : "—"}</TableCell>
                        <TableCell><Badge variant={getStatusBadgeVariant(ent.status)}>{ent.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getSyncStatusIcon(ent.sapSyncStatus)}
                            <span className="text-xs">{ent.sapSyncStatus}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== VIEW HISTORY TAB ==================== */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Inward Entry History
              </CardTitle>
              <CardDescription>View completed and historical inward entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Input placeholder="Search by Inward No., PO No., Vehicle No., or Vendor..." />
                </div>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Enter search criteria to view historical entries</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
