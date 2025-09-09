// src/App.tsx
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/components/context/NotificationContext";
import { ActivityProvider } from "@/components/context/ActivityContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LogoWaveLoader } from "@/components/LoadingScreen/LogoWaveLoader";
import HistoryPage from "./components/History/HistoryPage";


const queryClient = new QueryClient();

function AppContent() {
  const isFetching = useIsFetching();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFetching === 0) {
      // wait a little before hiding loader for smoothness
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [isFetching]);

  return (
    <>
      {loading && <LogoWaveLoader />}
      {!loading && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/History" element={<HistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <ActivityProvider>
          <Toaster />
          <AppContent />
        </ActivityProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
