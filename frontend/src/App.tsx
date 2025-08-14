import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import SeedPricing from "./pages/SeedPricing";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

// Component to add page transition animations
const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // Add page transition animation to body
    document.body.classList.add('page-transition');

    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/seed-pricing" element={<SeedPricing />} />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['admin', 'proUser', 'user']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin', 'proUser', 'user']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TranslationProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
