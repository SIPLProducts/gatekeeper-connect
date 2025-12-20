import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "RGP Overdue", message: "RGP-2025-089 for Motor Pump is overdue by 3 days", type: "warning", timestamp: "2 hours ago", read: false },
  { id: "2", title: "High Value Entry", message: "Inbound entry GE-2025-156 worth ₹5L requires approval", type: "info", timestamp: "4 hours ago", read: false },
  { id: "3", title: "Gate Entry Completed", message: "Vehicle TS09AB1234 has exited via Gate-2", type: "success", timestamp: "5 hours ago", read: true },
  { id: "4", title: "Weighbridge Offline", message: "Weighbridge 2 connection lost. Please check.", type: "error", timestamp: "1 day ago", read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "error": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default: return <Info className="h-5 w-5 text-info" />;
    }
  };

  const filteredNotifications = activeTab === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <MainLayout title="Notifications" subtitle="Stay updated with alerts and system messages">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({notifications.filter(n => !n.read).length})
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`animate-fade-in ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {notification.timestamp}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
