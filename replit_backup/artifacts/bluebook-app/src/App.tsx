import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

// Pages
import Dashboard from "@/pages/Dashboard";
import IncidentsList from "@/pages/IncidentsList";
import ReportIncident from "@/pages/ReportIncident";
import IncidentDetail from "@/pages/IncidentDetail";
import HazardsList from "@/pages/HazardsList";
import ReportHazard from "@/pages/ReportHazard";
import HazardDetail from "@/pages/HazardDetail";
import NearMissesList from "@/pages/NearMissesList";
import ReportNearMiss from "@/pages/ReportNearMiss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        
        {/* Incidents */}
        <Route path="/incidents" component={IncidentsList} />
        <Route path="/incidents/new" component={ReportIncident} />
        <Route path="/incidents/:id" component={IncidentDetail} />
        
        {/* Hazards */}
        <Route path="/hazards" component={HazardsList} />
        <Route path="/hazards/new" component={ReportHazard} />
        <Route path="/hazards/:id" component={HazardDetail} />
        
        {/* Near Misses */}
        <Route path="/near-misses" component={NearMissesList} />
        <Route path="/near-misses/new" component={ReportNearMiss} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
