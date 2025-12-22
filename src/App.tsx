import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import InboundEntry from "./pages/InboundEntry";
import OutboundDelivery from "./pages/OutboundDelivery";
import RGPManagement from "./pages/RGPManagement";
import NRGPManagement from "./pages/NRGPManagement";
import VisitorManagement from "./pages/VisitorManagement";
import Weighbridge from "./pages/Weighbridge";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/inbound" element={<ProtectedRoute><InboundEntry /></ProtectedRoute>} />
      <Route path="/inbound/new" element={<ProtectedRoute><InboundEntry /></ProtectedRoute>} />
      <Route path="/outbound" element={<ProtectedRoute><OutboundDelivery /></ProtectedRoute>} />
      <Route path="/outbound/new" element={<ProtectedRoute><OutboundDelivery /></ProtectedRoute>} />
      <Route path="/rgp" element={<ProtectedRoute><RGPManagement /></ProtectedRoute>} />
      <Route path="/rgp/new" element={<ProtectedRoute><RGPManagement /></ProtectedRoute>} />
      <Route path="/nrgp" element={<ProtectedRoute><NRGPManagement /></ProtectedRoute>} />
      <Route path="/nrgp/new" element={<ProtectedRoute><NRGPManagement /></ProtectedRoute>} />
      <Route path="/visitors" element={<ProtectedRoute><VisitorManagement /></ProtectedRoute>} />
      <Route path="/visitors/new" element={<ProtectedRoute><VisitorManagement /></ProtectedRoute>} />
      <Route path="/weighbridge" element={<ProtectedRoute><Weighbridge /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
