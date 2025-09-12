import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MarketPrices = lazy(() => import("./pages/MarketPrices"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TranslationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public route for the main page */}
              <Route path="/" element={<Index />} />

              {/* Protected route for the admin page */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for 404 pages */}
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;
