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
import { Users, Plus, LogIn, LogOut, Camera, Printer, Send, UserCheck, Clock } from "lucide-react";
import { toast } from "sonner";

interface Visitor {
  id: string;
  name: string;
  company: string;
  purpose: string;
  host: string;
  inTime: string;
  outTime?: string;
  status: "checked-in" | "checked-out" | "expected";
  badge: string;
}

const mockVisitors: Visitor[] = [
  { id: "VIS-2025-012", name: "Anil Sharma", company: "Siemens", purpose: "Audit", host: "Plant Head", inTime: "08:30 AM", status: "checked-in", badge: "V-012" },
  { id: "VIS-2025-011", name: "Priya Patel", company: "TCS", purpose: "IT Support", host: "IT Manager", inTime: "09:00 AM", outTime: "11:30 AM", status: "checked-out", badge: "V-011" },
  { id: "VIS-2025-013", name: "Rajesh Kumar", company: "Reliance Industries", purpose: "Business Meeting", host: "GM Operations", inTime: "-", status: "expected", badge: "-" },
  { id: "VIS-2025-010", name: "Sunita Rao", company: "KPMG", purpose: "Financial Audit", host: "CFO", inTime: "10:00 AM", status: "checked-in", badge: "V-010" },
];

const statusStyles = {
  "checked-in": { label: "Checked In", className: "bg-success/10 text-success border-success/20", icon: LogIn },
  "checked-out": { label: "Checked Out", className: "bg-muted text-muted-foreground border-border", icon: LogOut },
  expected: { label: "Expected", className: "bg-info/10 text-info border-info/20", icon: Clock },
};

export default function VisitorManagement() {
  const [activeTab, setActiveTab] = useState("current");

  const handleCheckIn = () => {
    toast.success("Visitor checked in successfully!");
    setActiveTab("current");
  };

  const handleCheckOut = (visitorName: string) => {
    toast.success(`${visitorName} checked out successfully!`);
  };

  return (
    <MainLayout title="Visitor Management" subtitle="Track and manage visitor entries">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="current">Current Visitors</TabsTrigger>
            <TabsTrigger value="expected">Expected Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <Button variant="hero" onClick={() => setActiveTab("new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Visitor Check-In
          </Button>
        </div>

        <TabsContent value="current" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Currently On-Site
              </CardTitle>
              <CardDescription>
                {mockVisitors.filter(v => v.status === "checked-in").length} visitors currently inside the premises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Badge</TableHead>
                      <TableHead>Visitor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>In Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVisitors.filter(v => v.status === "checked-in").map((visitor, index) => {
                      const StatusIcon = statusStyles[visitor.status].icon;
                      return (
                        <TableRow key={visitor.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono bg-accent/10 text-accent border-accent/20">
                              {visitor.badge}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{visitor.id}</TableCell>
                          <TableCell className="font-medium">{visitor.name}</TableCell>
                          <TableCell>{visitor.company}</TableCell>
                          <TableCell>{visitor.purpose}</TableCell>
                          <TableCell>{visitor.host}</TableCell>
                          <TableCell className="font-mono">{visitor.inTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusStyles[visitor.status].className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusStyles[visitor.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleCheckOut(visitor.name)}>
                              <LogOut className="h-4 w-4 mr-1" />
                              Check Out
                            </Button>
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

        <TabsContent value="expected" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-info" />
                Expected Visitors
              </CardTitle>
              <CardDescription>Pre-registered visitors expected today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Expected Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVisitors.filter(v => v.status === "expected").map((visitor, index) => (
                      <TableRow key={visitor.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono">{visitor.id}</TableCell>
                        <TableCell className="font-medium">{visitor.name}</TableCell>
                        <TableCell>{visitor.company}</TableCell>
                        <TableCell>{visitor.purpose}</TableCell>
                        <TableCell>{visitor.host}</TableCell>
                        <TableCell>10:00 AM - 12:00 PM</TableCell>
                        <TableCell className="text-right">
                          <Button variant="success" size="sm">
                            <LogIn className="h-4 w-4 mr-1" />
                            Check In
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

        <TabsContent value="history" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Visitor History</CardTitle>
              <CardDescription>Past visitor records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>In Time</TableHead>
                      <TableHead>Out Time</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVisitors.filter(v => v.status === "checked-out").map((visitor, index) => (
                      <TableRow key={visitor.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <TableCell className="font-mono">{visitor.id}</TableCell>
                        <TableCell className="font-medium">{visitor.name}</TableCell>
                        <TableCell>{visitor.company}</TableCell>
                        <TableCell>{visitor.purpose}</TableCell>
                        <TableCell>{visitor.host}</TableCell>
                        <TableCell className="font-mono">{visitor.inTime}</TableCell>
                        <TableCell className="font-mono">{visitor.outTime}</TableCell>
                        <TableCell>2h 30m</TableCell>
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
                    <UserCheck className="h-5 w-5 text-accent" />
                    New Visitor Check-In
                  </CardTitle>
                  <CardDescription>Register a new visitor entry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Visitor Name *</Label>
                      <Input placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label>Mobile Number *</Label>
                      <Input placeholder="Enter mobile number" />
                    </div>
                    <div>
                      <Label>Company *</Label>
                      <Input placeholder="Enter company name" />
                    </div>
                    <div>
                      <Label>Designation</Label>
                      <Input placeholder="Enter designation" />
                    </div>
                    <div>
                      <Label>Purpose of Visit *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Business Meeting</SelectItem>
                          <SelectItem value="audit">Audit</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Host Employee *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select host" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plant-head">Plant Head</SelectItem>
                          <SelectItem value="gm-ops">GM Operations</SelectItem>
                          <SelectItem value="hr-manager">HR Manager</SelectItem>
                          <SelectItem value="it-manager">IT Manager</SelectItem>
                          <SelectItem value="cfo">CFO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>ID Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="driving">Driving License</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>ID Number</Label>
                      <Input placeholder="Enter ID number" />
                    </div>
                    <div>
                      <Label>Vehicle Number</Label>
                      <Input placeholder="Enter vehicle number (if any)" />
                    </div>
                    <div>
                      <Label>Number of Persons</Label>
                      <Input type="number" placeholder="1" defaultValue={1} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Remarks</Label>
                      <Textarea placeholder="Any additional notes" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Photo Capture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Visitor Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-40 w-40 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Button variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button className="w-full" variant="accent" size="lg" onClick={handleCheckIn}>
                    <LogIn className="mr-2 h-5 w-5" />
                    Check In Visitor
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Badge
                    </Button>
                    <Button variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      Notify Host
                    </Button>
                  </div>
                  <Button className="w-full" variant="ghost" onClick={() => setActiveTab("current")}>
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
