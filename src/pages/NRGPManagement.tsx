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
import { FileOutput, Plus, Clock, CheckCircle, Eye, Trash2, Printer, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface NRGP {
  id: string;
  vendor: string;
  material: string;
  quantity: string;
  outDate: string;
  purpose: string;
  status: "pending" | "approved" | "dispatched" | "rejected";
  value: string;
  approver: string;
}

const mockNRGPs: NRGP[] = [
  { id: "NRGP-2025-021", vendor: "ABC Scrap Dealers", material: "Metal Scrap - MS", quantity: "500 KG", outDate: "2025-01-15", purpose: "Scrap Disposal", status: "dispatched", value: "₹8,500", approver: "Plant Manager" },
  { id: "NRGP-2025-020", vendor: "XYZ Waste Management", material: "Industrial Waste", quantity: "200 KG", outDate: "2025-01-14", purpose: "Waste Disposal", status: "dispatched", value: "₹0", approver: "Safety Officer" },
  { id: "NRGP-2025-019", vendor: "Sample Company Ltd", material: "Product Samples", quantity: "10 Nos", outDate: "2025-01-13", purpose: "Customer Samples", status: "approved", value: "₹25,000", approver: "Sales Head" },
  { id: "NRGP-2025-018", vendor: "Testing Labs Pvt Ltd", material: "Raw Material Samples", quantity: "5 KG", outDate: "2025-01-12", purpose: "Quality Testing", status: "pending", value: "₹12,000", approver: "QC Manager" },
  { id: "NRGP-2025-017", vendor: "Old Equipment Buyer", material: "Obsolete Machinery", quantity: "1 Nos", outDate: "2025-01-10", purpose: "Asset Sale", status: "rejected", value: "₹1,50,000", approver: "Finance Head" },
];

const statusStyles = {
  pending: { label: "Pending Approval", className: "bg-info/10 text-info border-info/20", icon: Clock },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  dispatched: { label: "Dispatched", className: "bg-primary/10 text-primary border-primary/20", icon: FileOutput },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
};

const purposeCategories = [
  { value: "scrap", label: "Scrap Disposal" },
  { value: "waste", label: "Waste Disposal" },
  { value: "samples", label: "Customer Samples" },
  { value: "testing", label: "Quality Testing" },
  { value: "asset-sale", label: "Asset Sale" },
  { value: "donation", label: "Donation" },
  { value: "transfer", label: "Inter-Plant Transfer" },
  { value: "other", label: "Other" },
];

export default function NRGPManagement() {
  const [activeTab, setActiveTab] = useState("list");

  const handleCreateNRGP = () => {
    toast.success("NRGP created and sent for approval!");
    setActiveTab("list");
  };

  const handleDispatch = (nrgp: NRGP) => {
    toast.success(`${nrgp.id} marked as dispatched`);
  };

  return (
    <MainLayout title="NRGP Management" subtitle="Non-Returnable Gate Pass - Track permanent outward materials">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="list">All NRGPs</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Ready to Dispatch</TabsTrigger>
          </TabsList>
          <Button variant="hero" onClick={() => setActiveTab("new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New NRGP
          </Button>
        </div>

        {/* All NRGPs List */}
        <TabsContent value="list" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>All Non-Returnable Gate Passes</CardTitle>
              <CardDescription>Track materials permanently leaving the premises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NRGP Number</TableHead>
                      <TableHead>Vendor/Recipient</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Out Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNRGPs.map((nrgp, index) => {
                      const StatusIcon = statusStyles[nrgp.status].icon;
                      return (
                        <TableRow key={nrgp.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <TableCell className="font-mono font-medium">{nrgp.id}</TableCell>
                          <TableCell>{nrgp.vendor}</TableCell>
                          <TableCell>{nrgp.material}</TableCell>
                          <TableCell>{nrgp.quantity}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-muted/50">{nrgp.purpose}</Badge>
                          </TableCell>
                          <TableCell>{nrgp.outDate}</TableCell>
                          <TableCell className="font-medium">{nrgp.value}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusStyles[nrgp.status].className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusStyles[nrgp.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
                              {nrgp.status === "approved" && (
                                <Button variant="outline" size="sm" onClick={() => handleDispatch(nrgp)}>
                                  <FileOutput className="h-4 w-4 mr-1" />
                                  Dispatch
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

        {/* Pending Approval Tab */}
        <TabsContent value="pending" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-info" />
                Pending Approvals
              </CardTitle>
              <CardDescription>NRGPs waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NRGP Number</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNRGPs.filter(n => n.status === "pending").map((nrgp, index) => (
                      <TableRow key={nrgp.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono font-medium">{nrgp.id}</TableCell>
                        <TableCell>{nrgp.material}</TableCell>
                        <TableCell>{nrgp.purpose}</TableCell>
                        <TableCell className="font-medium">{nrgp.value}</TableCell>
                        <TableCell>{nrgp.approver}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="success" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Reject
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

        {/* Ready to Dispatch Tab */}
        <TabsContent value="approved" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Ready to Dispatch
              </CardTitle>
              <CardDescription>Approved NRGPs ready for material dispatch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NRGP Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNRGPs.filter(n => n.status === "approved").map((nrgp, index) => (
                      <TableRow key={nrgp.id} className="animate-fade-in bg-success/5" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono font-medium">{nrgp.id}</TableCell>
                        <TableCell>{nrgp.vendor}</TableCell>
                        <TableCell>{nrgp.material}</TableCell>
                        <TableCell>{nrgp.quantity}</TableCell>
                        <TableCell className="font-medium">{nrgp.value}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Button>
                          <Button variant="success" size="sm" onClick={() => handleDispatch(nrgp)}>
                            <FileOutput className="h-4 w-4 mr-1" />
                            Mark Dispatched
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

        {/* Create New NRGP Tab */}
        <TabsContent value="new" className="animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileOutput className="h-5 w-5 text-primary" />
                    Create New NRGP
                  </CardTitle>
                  <CardDescription>Send material out permanently (scrap, samples, waste, etc.)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Purpose Category *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposeCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Vendor/Recipient *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abc">ABC Scrap Dealers</SelectItem>
                          <SelectItem value="xyz">XYZ Waste Management</SelectItem>
                          <SelectItem value="sample">Sample Company Ltd</SelectItem>
                          <SelectItem value="testing">Testing Labs Pvt Ltd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Material Description *</Label>
                      <Input placeholder="Enter material description" />
                    </div>
                    <div>
                      <Label>Quantity *</Label>
                      <Input placeholder="e.g., 500" type="number" />
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
                          <SelectItem value="ltrs">Ltrs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Approximate Value (₹)</Label>
                      <Input type="number" placeholder="e.g., 8500 (0 for waste)" />
                    </div>
                    <div>
                      <Label>Expected Dispatch Date *</Label>
                      <Input type="date" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Remarks / Justification</Label>
                      <Textarea placeholder="Describe the purpose and justification for sending material out" />
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Transport Details (Optional)</h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label>Vehicle Number</Label>
                        <Input placeholder="e.g., TS09AB1234" />
                      </div>
                      <div>
                        <Label>Driver Name</Label>
                        <Input placeholder="Enter driver name" />
                      </div>
                      <div>
                        <Label>Driver Mobile</Label>
                        <Input placeholder="Enter mobile number" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Approval Info */}
              <Card className="bg-info/5 border-info/20">
                <CardHeader>
                  <CardTitle className="text-info flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Approval Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <p>Based on the material value, this NRGP will require approval from:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted/50">₹0 - ₹10,000</Badge>
                      <span>Store Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted/50">₹10,001 - ₹50,000</Badge>
                      <span>Plant Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted/50">₹50,001+</Badge>
                      <span>Finance Head</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button className="w-full" variant="hero" size="lg" onClick={handleCreateNRGP}>
                    <Plus className="mr-2 h-5 w-5" />
                    Create NRGP
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                  </div>
                  <Button className="w-full" variant="ghost" onClick={() => setActiveTab("list")}>
                    Cancel
                  </Button>
                </CardContent>
              </Card>

              {/* Warning */}
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="pt-6 text-sm">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <strong className="text-destructive">Important:</strong> NRGP materials are permanently removed from inventory. Ensure proper documentation and approvals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
