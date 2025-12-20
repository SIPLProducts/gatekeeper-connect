import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InboundEntry from "./pages/InboundEntry";
import OutboundDelivery from "./pages/OutboundDelivery";
import RGPManagement from "./pages/RGPManagement";
import VisitorManagement from "./pages/VisitorManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inbound" element={<InboundEntry />} />
          <Route path="/inbound/new" element={<InboundEntry />} />
          <Route path="/outbound" element={<OutboundDelivery />} />
          <Route path="/outbound/new" element={<OutboundDelivery />} />
          <Route path="/rgp" element={<RGPManagement />} />
          <Route path="/rgp/new" element={<RGPManagement />} />
          <Route path="/nrgp" element={<RGPManagement />} />
          <Route path="/visitors" element={<VisitorManagement />} />
          <Route path="/visitors/new" element={<VisitorManagement />} />
          <Route path="/weighbridge" element={<InboundEntry />} />
          <Route path="/notifications" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
