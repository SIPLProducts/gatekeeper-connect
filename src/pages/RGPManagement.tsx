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
import { Textarea } from "@/components/ui/textarea";
import { FileInput, Plus, Clock, AlertTriangle, CheckCircle, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface RGP {
  id: string;
  vendor: string;
  material: string;
  quantity: string;
  outDate: string;
  expectedReturn: string;
  status: "pending" | "approved" | "out" | "returned" | "overdue";
  value: string;
}

const mockRGPs: RGP[] = [
  { id: "RGP-2025-045", vendor: "ABC Job Works", material: "Motor Assembly", quantity: "2 Nos", outDate: "2025-01-15", expectedReturn: "2025-01-25", status: "out", value: "₹45,000" },
  { id: "RGP-2025-044", vendor: "XYZ Repairs", material: "Pump Set", quantity: "1 Nos", outDate: "2025-01-10", expectedReturn: "2025-01-18", status: "overdue", value: "₹28,000" },
  { id: "RGP-2025-043", vendor: "Delta Engineering", material: "Gear Box", quantity: "1 Nos", outDate: "2025-01-08", expectedReturn: "2025-01-15", status: "returned", value: "₹75,000" },
  { id: "RGP-2025-042", vendor: "ABC Job Works", material: "Conveyor Belt Section", quantity: "5 Mtrs", outDate: "2025-01-05", expectedReturn: "2025-01-12", status: "returned", value: "₹15,000" },
];

const statusStyles = {
  pending: { label: "Pending Approval", className: "bg-info/10 text-info border-info/20", icon: Clock },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  out: { label: "Material Out", className: "bg-warning/10 text-warning border-warning/20", icon: FileInput },
  returned: { label: "Returned", className: "bg-success/10 text-success border-success/20", icon: RotateCcw },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
};

export default function RGPManagement() {
  const [activeTab, setActiveTab] = useState("list");

  const handleCreateRGP = () => {
    toast.success("RGP created and sent for approval!");
    setActiveTab("list");
  };

  return (
    <MainLayout title="RGP Management" subtitle="Returnable Gate Pass - Track materials sent for job work">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="list">All RGPs</TabsTrigger>
            <TabsTrigger value="pending">Pending Return</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          <Button variant="hero" onClick={() => setActiveTab("new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New RGP
          </Button>
        </div>

        <TabsContent value="list" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>All Returnable Gate Passes</CardTitle>
              <CardDescription>Track materials sent out for job work and repairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RGP Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Out Date</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRGPs.map((rgp, index) => {
                      const StatusIcon = statusStyles[rgp.status].icon;
                      return (
                        <TableRow key={rgp.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <TableCell className="font-mono font-medium">{rgp.id}</TableCell>
                          <TableCell>{rgp.vendor}</TableCell>
                          <TableCell>{rgp.material}</TableCell>
                          <TableCell>{rgp.quantity}</TableCell>
                          <TableCell>{rgp.outDate}</TableCell>
                          <TableCell>{rgp.expectedReturn}</TableCell>
                          <TableCell className="font-medium">{rgp.value}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusStyles[rgp.status].className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusStyles[rgp.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {rgp.status === "out" && (
                                <Button variant="outline" size="sm">
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Return
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Returns
              </CardTitle>
              <CardDescription>Materials currently out for job work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RGP Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Out Date</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRGPs.filter(r => r.status === "out").map((rgp, index) => (
                      <TableRow key={rgp.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono font-medium">{rgp.id}</TableCell>
                        <TableCell>{rgp.vendor}</TableCell>
                        <TableCell>{rgp.material}</TableCell>
                        <TableCell>{rgp.outDate}</TableCell>
                        <TableCell>{rgp.expectedReturn}</TableCell>
                        <TableCell>
                          <Badge className="bg-warning/10 text-warning">5 days</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Mark Returned
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="animate-fade-in">
          <Card className="border-destructive/20">
            <CardHeader className="bg-destructive/5">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Overdue RGPs
              </CardTitle>
              <CardDescription>Materials past their expected return date</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RGP Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Value at Risk</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRGPs.filter(r => r.status === "overdue").map((rgp, index) => (
                      <TableRow key={rgp.id} className="animate-fade-in bg-destructive/5" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono font-medium">{rgp.id}</TableCell>
                        <TableCell>{rgp.vendor}</TableCell>
                        <TableCell>{rgp.material}</TableCell>
                        <TableCell>{rgp.expectedReturn}</TableCell>
                        <TableCell>
                          <Badge className="bg-destructive/10 text-destructive">2 days</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-destructive">{rgp.value}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm">Send Reminder</Button>
                          <Button variant="destructive" size="sm">Escalate</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileInput className="h-5 w-5 text-warning" />
                    Create New RGP
                  </CardTitle>
                  <CardDescription>Send material out for job work or repair</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Vendor *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abc">ABC Job Works</SelectItem>
                          <SelectItem value="xyz">XYZ Repairs</SelectItem>
                          <SelectItem value="delta">Delta Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Material Category *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="machinery">Machinery</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="spares">Spare Parts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Material Description *</Label>
                      <Input placeholder="Enter material description" />
                    </div>
                    <div>
                      <Label>Quantity *</Label>
                      <Input placeholder="e.g., 2" />
                    </div>
                    <div>
                      <Label>UOM *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nos">Nos</SelectItem>
                          <SelectItem value="kg">KG</SelectItem>
                          <SelectItem value="mtrs">Mtrs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Approximate Value (₹) *</Label>
                      <Input type="number" placeholder="e.g., 45000" />
                    </div>
                    <div>
                      <Label>Expected Return Date *</Label>
                      <Input type="date" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Purpose / Remarks</Label>
                      <Textarea placeholder="Describe the purpose of sending material out" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-warning/5 border-warning/20">
                <CardHeader>
                  <CardTitle className="text-warning">Approval Required</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>This RGP will be sent to:</p>
                  <p className="font-medium">Purchase Head</p>
                  <p className="text-muted-foreground">for approval before material dispatch.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button className="w-full" variant="warning" size="lg" onClick={handleCreateRGP}>
                    <Plus className="mr-2 h-5 w-5" />
                    Create RGP
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("list")}>
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
