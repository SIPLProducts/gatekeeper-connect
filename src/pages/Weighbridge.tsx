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
import { Scale, Truck, RefreshCw, Printer, History, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface WeighbridgeReading {
  id: string;
  vehicleNumber: string;
  entryType: "inbound" | "outbound";
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  timestamp: string;
  status: "completed" | "pending" | "error";
}

const mockReadings: WeighbridgeReading[] = [
  { id: "WB-001", vehicleNumber: "TS09AB1234", entryType: "inbound", grossWeight: 15000, tareWeight: 5000, netWeight: 10000, timestamp: "2025-01-15 09:30:00", status: "completed" },
  { id: "WB-002", vehicleNumber: "AP12CD5678", entryType: "outbound", grossWeight: 18500, tareWeight: 6200, netWeight: 12300, timestamp: "2025-01-15 10:15:00", status: "completed" },
  { id: "WB-003", vehicleNumber: "KA03EF9012", entryType: "inbound", grossWeight: 22000, tareWeight: 0, netWeight: 0, timestamp: "2025-01-15 11:45:00", status: "pending" },
];

export default function Weighbridge() {
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [activeTab, setActiveTab] = useState("live");

  const handleCaptureWeight = () => {
    // Simulate weight capture
    const randomWeight = Math.floor(Math.random() * 20000) + 5000;
    setCurrentWeight(randomWeight);
    toast.success(`Weight captured: ${randomWeight} KG`);
  };

  const handleRefresh = () => {
    setIsConnected(true);
    toast.success("Weighbridge connection refreshed");
  };

  return (
    <MainLayout title="Weighbridge Management" subtitle="Real-time weighbridge monitoring and control">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="live">Live Weighing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Live Weight Display */}
            <Card className="lg:col-span-2 animate-slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    <CardTitle>Live Weight Reading</CardTitle>
                  </div>
                  <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Disconnected
                      </>
                    )}
                  </Badge>
                </div>
                <CardDescription>Weighbridge 1 - Main Gate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-6xl font-bold font-mono text-primary animate-pulse-glow">
                    {currentWeight.toLocaleString()}
                  </div>
                  <div className="text-2xl text-muted-foreground mt-2">KG</div>
                  <div className="flex gap-4 mt-8">
                    <Button size="lg" onClick={handleCaptureWeight} variant="hero">
                      <Scale className="mr-2 h-5 w-5" />
                      Capture Weight
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Entry */}
            <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-info" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vehicle">Vehicle Number</Label>
                  <Input id="vehicle" placeholder="e.g., TS09AB1234" className="font-mono" />
                </div>
                <div>
                  <Label htmlFor="entry-type">Entry Type</Label>
                  <Select>
                    <SelectTrigger id="entry-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbound">Inbound (Gross)</SelectItem>
                      <SelectItem value="outbound">Outbound (Tare)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ref-number">Reference Number</Label>
                  <Input id="ref-number" placeholder="PO/DO/GE Number" className="font-mono" />
                </div>
                <Button className="w-full" variant="success">
                  Save Weight Reading
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current Queue */}
          <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Pending Weighing Queue</CardTitle>
              <CardDescription>Vehicles waiting for weight capture</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Arrival Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReadings.filter(r => r.status === "pending").map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell className="font-mono font-medium">{reading.vehicleNumber}</TableCell>
                      <TableCell>
                        <Badge variant={reading.entryType === "inbound" ? "default" : "secondary"}>
                          {reading.entryType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{reading.id}</TableCell>
                      <TableCell>{reading.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="hero">Weigh Now</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Weighing History
              </CardTitle>
              <CardDescription>Past weighbridge readings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Gross (KG)</TableHead>
                    <TableHead className="text-right">Tare (KG)</TableHead>
                    <TableHead className="text-right">Net (KG)</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReadings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell className="font-mono">{reading.id}</TableCell>
                      <TableCell className="font-mono font-medium">{reading.vehicleNumber}</TableCell>
                      <TableCell>
                        <Badge variant={reading.entryType === "inbound" ? "default" : "secondary"}>
                          {reading.entryType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{reading.grossWeight.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{reading.tareWeight.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{reading.netWeight.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{reading.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={reading.status === "completed" ? "outline" : reading.status === "pending" ? "secondary" : "destructive"}>
                          {reading.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weighbridge Configuration</CardTitle>
              <CardDescription>Configure weighbridge connection and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="wb-ip">Weighbridge IP Address</Label>
                  <Input id="wb-ip" placeholder="192.168.1.100" className="font-mono" />
                </div>
                <div>
                  <Label htmlFor="wb-port">Port</Label>
                  <Input id="wb-port" placeholder="5000" className="font-mono" />
                </div>
                <div>
                  <Label htmlFor="tolerance">Tolerance (%)</Label>
                  <Input id="tolerance" type="number" placeholder="2" />
                </div>
                <div>
                  <Label htmlFor="min-weight">Minimum Weight (KG)</Label>
                  <Input id="min-weight" type="number" placeholder="100" />
                </div>
              </div>
              <Button variant="hero">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
